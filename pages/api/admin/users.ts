import { db } from "database";
import { IUser } from "interfaces";
import { User } from "models";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
	| {
			message: string;
	  }
	| IUser[];

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "GET":
			return getUsers(req, res);
		case "PUT":
			return updateUser(req, res);
		default:
			return res.status(400).json({ message: "Bad request" });
	}
}
const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await db.connect();
	const users = await User.find().select("-password").lean();
	await db.disconnect();

	return res.status(200).json(users);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { userId = "", role = "" } = req.body;

	if (!mongoose.isValidObjectId(userId)) {
		return res.status(400).json({ message: "Is not an user with this Id" });
	}

	const validRoles = ["admin", "client", "super-user", "SEO"];

	if (!validRoles.includes(role)) {
		return res.status(400).json({
			message:
				"Rol not allowed " + validRoles.join(", ") + " Recived " + role,
		});
	}

	await db.connect();
	const user = await User.findById(userId);

	if (!user) {
		await db.disconnect();
		return res.status(404).json({ message: "User no found" });
	}

	user.role = role;
	await user.save();
	await db.disconnect();

	return res.status(200).json({ message: "User was updated" });
};
