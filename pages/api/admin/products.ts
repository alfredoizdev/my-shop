import { db } from "database";
import { IProduct } from "interfaces";
import { Product } from "models";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
	| {
			message: string;
	  }
	| IProduct[];

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "GET":
			return getProduct(req, res);
		case "PUT":
			return res.status(400).json({ message: "Bad request" });
		case "POST":
			return res.status(400).json({ message: "Bad request" });
		default:
			return res.status(400).json({ message: "Bad request" });
	}
}

const getProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await db.connect();
	const product = await Product.find().sort({ title: "asc" }).lean();
	await db.disconnect();
	// TODO:
	// Tedremos que actualizar las imagenes
	return res.status(200).json(product);
};
