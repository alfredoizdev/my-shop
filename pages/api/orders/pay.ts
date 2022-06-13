import axios from "axios";
import { db } from "database";
import { IPaypal } from "interfaces";
import { Order } from "models";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

type Data = {
	message: string;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "POST":
			return payOrder(req, res);

		default:
			return res.status(400).json({ message: "Bad request" });
	}
}

const getPaypalBearerToken = async (): Promise<string | null> => {
	const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
	const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

	const base64Token = Buffer.from(
		`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
		"utf-8"
	).toString("base64");
	const body = new URLSearchParams("grant_type=client_credentials");

	try {
		const { data } = await axios.post(
			process.env.PAYPAL_OAUTH_URL || "",
			body,
			{
				headers: {
					Authorization: `Basic ${base64Token}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		return data.access_token;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log(error.response?.data);
		} else {
			console.log(error);
		}

		return null;
	}
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	//  validate user session
	const { transactionId = "", orderId = "" } = req.body;
	const session = await getSession({ req });
	if (!session) {
		return res.status(401).json({
			message: "You need has session login to completed this order",
		});
	}

	//  validate mongo id
	if (!mongoose.isValidObjectId(orderId)) {
		return res.status(400).json({
			message: "Is not a valid order",
		});
	}
	const paypalBearerToken = await getPaypalBearerToken();

	if (!paypalBearerToken) {
		return res
			.status(400)
			.json({ message: "Can't confirm the paypal token" });
	}

	const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(
		`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
		{
			headers: {
				Authorization: `Bearer ${paypalBearerToken}`,
			},
		}
	);
	if (data.status !== "COMPLETED") {
		return res.status(401).json({ message: "The Order are no approved" });
	}

	await db.connect();
	const dbOrder = await Order.findById(orderId);

	if (!dbOrder) {
		await db.disconnect();
		return res.status(400).json({ message: "The Order is not in database" });
	}

	if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
		await db.disconnect();
		return res.status(400).json({
			message:
				"The amount coming from paypal and the amount on databse don't match",
		});
	}

	dbOrder.transactionId = transactionId;
	dbOrder.isPaid = true;
	await dbOrder.save();
	await db.disconnect();

	return res.status(200).json({ message: "Order was pay successfully" });
};
