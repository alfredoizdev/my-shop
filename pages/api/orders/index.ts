import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "database";
import { IOrder } from "interfaces";
import { Product, Order } from "models";

type Data =
	| {
			message: string;
	  }
	| IOrder;

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "POST":
			return createOrder(req, res);

		default:
			return res.status(400).json({ message: "Bad request" });
	}
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { orderItems, total } = req.body as IOrder;

	// verify is user are login
	const session: any = await getSession({ req });

	if (!session) {
		return res.status(401).json({ message: "User need being authenticated" });
	}

	// create array with the product select by the user
	const productIds: string[] = orderItems.map((product) => product._id);
	await db.connect();
	// encuentra todos los productos que exitan en (productIds array string)
	const dbProducts = await Product.find({ _id: { $in: productIds } });

	try {
		const subTotal = orderItems.reduce((prev, current) => {
			const currentPrice = dbProducts.find(
				(prod) => prod._id.toString() === current._id
			)?.price;

			if (!currentPrice) {
				throw new Error("Verify the cart product is incorrect ");
			}

			return currentPrice * current.quantity + prev;
		}, 0);

		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

		const backendTotal = subTotal * (taxRate + 1);

		if (total !== backendTotal) {
			throw new Error(
				"Verify the cart, the total is not match with the amount of product"
			);
		}

		// all is success

		const userId = session.user._id;
		const newOrder = new Order({
			...req.body,
			isPaid: false,
			user: userId,
		});
		// remover decimales solo dejas dos (exp 700.00)
		newOrder.total = Math.round(newOrder.total * 100) / 100;

		await newOrder.save();
		await db.disconnect();
		return res.status(201).json(newOrder);
	} catch (error: any) {
		await db.disconnect();
		console.log(error);
		return res
			.status(400)
			.json({ message: error.message || "Check server logs" });
	}
};
