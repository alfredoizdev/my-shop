import { db } from "database";
import { IProduct } from "interfaces";
import { Product } from "models";
import type { NextApiRequest, NextApiResponse } from "next";
import { isValidObjectId } from "mongoose";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL || "");

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
			return createdProduct(req, res);
		default:
			return res.status(400).json({ message: "Bad request" });
	}
}

const getProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await db.connect();
	const products = await Product.find().sort({ title: "asc" }).lean();
	await db.disconnect();
	// TODO:
	// Tedremos que actualizar las imagenes
	const updatedProduct = products.map((product) => {
		product.images = product.images.map((image) => {
			return image.includes("http")
				? image
				: `${process.env.HOST_NAME}products/${image}`;
		});

		return product;
	});

	return res.status(200).json(updatedProduct);
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
		return res.status(400).json({ message: "Need less two images" });
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
		//https://res.cloudinary.com/dujqbnxyg/image/upload/v1655306876/ctyidkefduiuh3cf2gz2.webp

		product.images.forEach(async (image) => {
			// si alguna imagen que esta en el producto no viene el req.bodi images
			// entonces delete
			if (!images.includes(image)) {
				// delete cloudinary
				// hago un split para obtnere el id en url
				const [fiedlId, ext] = image
					.substring(image.lastIndexOf("/") + 1)
					.split(".");
				await cloudinary.uploader.destroy(fiedlId);
			}
		});

		await product.update(req.body);
		await db.disconnect();

		return res.status(200).json(product);
	} catch (error) {
		console.log(error);
		await db.disconnect();
		return res.status(500).json({ message: "Server error check logs" });
	}
};
const createdProduct = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { images = [] } = req.body as IProduct;

	if (images.length < 2) {
		return res.status(400).json({ message: "Need less two images" });
	}

	try {
		await db.connect();
		const productInDB = await Product.findOne({ slug: req.body.slug });

		if (productInDB) {
			await db.disconnect();
			return res
				.status(400)
				.json({ message: "Is a product with this slugs already" });
		}

		const product = new Product(req.body);
		await product.save();
		await db.disconnect();

		return res.status(201).json(product);
	} catch (error) {
		console.log(error);
		await db.disconnect();
		return res.status(500).json({ message: "Server error check logs" });
	}

	//TODO: posiblemente tendremos localhost:3000/products/image.jpg
};
