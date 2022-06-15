import { db } from "database";
import { IProduct } from "interfaces";
import { Product } from "models";
import type { NextApiRequest, NextApiResponse } from "next";
import { isValidObjectId } from "mongoose";

type Data =
	| {
			message: string;
	  }
	| IProduct[]
	| IProduct;

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "GET":
			return getProduct(req, res);
		case "PUT":
			return updatedProduct(req, res);
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
const updatedProduct = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { _id = "", images = [] } = req.body as IProduct;

	if (!isValidObjectId(_id)) {
		return res.status(400).json({ message: "This Id is not valid" });
	}

	if (images.length < 2) {
		return res.status(400).json({ message: "Need less tow images" });
	}

	//TODO: posiblemente tendremos localhost:3000/products/image.jpg

	try {
		await db.connect();

		const product = await Product.findById(_id);

		if (!product) {
			await db.disconnect();
			return res
				.status(400)
				.json({ message: "Is not a product with this ID" });
		}

		//TODO: eliminar fotos en Cloudinary

		await product.update(req.body);
		await db.disconnect();

		return res.status(200).json(product);
	} catch (error) {
		console.log(error);
		await db.disconnect();
		return res.status(500).json({ message: "Server error check logs" });
	}
};
