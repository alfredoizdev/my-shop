import { db } from "database";
import { User } from "models";
import type { NextApiRequest, NextApiResponse } from "next";
import bcryptjs from "bcryptjs";
import { jwt, validation } from "utils";

type Data =
	| {
			message: string;
	  }
	| {
			token: string;
			user: {
				email: string;
				name: string;
				role: string;
			};
	  };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "POST":
			return registerUser(req, res);

		default:
			return res.status(400).json({ message: "Bad request" });
	}
}

const registerUser = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const {
		name = "",
		email = "",
		password = "",
	} = req.body as { name: string; email: string; password: string };

	if (password.length < 6) {
		return res
			.status(400)
			.json({ message: "the password shoul be 6 or more characters" });
	}

	if (name.length < 3) {
		return res
			.status(400)
			.json({ message: "the password shoul be 2 or more characters" });
	}

	if (!validation.isValidEmail(email)) {
		return res.status(400).json({ message: "Email format are no valid" });
	}

	await db.connect();
	const user = await User.findOne({ email });

	if (user) {
		await db.disconnect();
		return res
			.status(400)
			.json({ message: "This credential is alredy exist" });
	}

	const newUser = new User({
		email,
		password: bcryptjs.hashSync(password),
		role: "client",
		name,
	});

	try {
		await newUser.save({ validateBeforeSave: true });
		await db.disconnect();
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Checl log of the server",
		});
	}

	const { _id, role } = newUser;

	const token = jwt.singToken(_id, email);

	return res.status(200).json({
		token,
		user: {
			email,
			role,
			name,
		},
	});
};
