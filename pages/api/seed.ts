import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { db, seedDatabase } from "database";
import { Product, User } from "models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (process.env.NODE_ENV === "production") {
		return res
			.status(401)
			.json({ message: "You have not access to this endpoint" });
	}

	await db.connect();

	await User.deleteMany();
	await User.insertMany(seedDatabase.initialData.users);

	await Product.deleteMany();
	await Product.insertMany(seedDatabase.initialData.products);

	await db.disconnect();

	res.status(201).json({ message: "proccess succsefully done" });
}
