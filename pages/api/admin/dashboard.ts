import { db } from "database";
import { Order, Product, User } from "models";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
	numberOfOrders: number;
	paidOrders: number;
	notPaidOrders: number;
	numberOfClient: number;
	numberOfProduct: number;
	productsWithNoInventory: number;
	lowInventory: number;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	await db.connect();

	const [
		numberOfOrders,
		paidOrders,
		numberOfClient,
		numberOfProduct,
		productsWithNoInventory,
		lowInventory,
	] = await Promise.all([
		Order.count(),
		Order.find({ isPaid: true }).count(),
		User.find({ role: "client" }).count(),
		Product.count(),
		Product.find({ inStock: 0 }).count(),
		Product.find({ inStock: { $lte: 10 } }).count(),
	]);

	await db.disconnect();

	return res.status(200).json({
		numberOfClient,
		numberOfProduct,
		productsWithNoInventory,
		numberOfOrders,
		paidOrders,
		lowInventory,
		notPaidOrders: numberOfOrders - paidOrders,
	});
}
