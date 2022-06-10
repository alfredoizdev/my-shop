import type { NextApiRequest, NextApiResponse } from "next";
import { jwt } from "utils";
import { IShippingAddress } from "interfaces/shippingAddress";
import { User } from "models";
import { db } from "database";
import Address from "models/Address";

type Data =
	| {
			message: string;
	  }
	| {
			address?: IShippingAddress;
	  };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "POST":
			return saveAddress(req, res);
		case "GET":
			return getAddress(req, res);

		default:
			return res.status(400).json({ message: "Bad request" });
	}
}

const saveAddress = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { token = "" } = req.cookies;
	const {
		address = "",
		address2 = "",
		firstname = "",
		lastname = "",
		zip = "",
		phone = "",
		country = "",
	} = req.body as {
		address: string;
		address2: string;
		firstname: string;
		lastname: string;
		zip: string;
		phone: string;
		country: string;
	};

	if (address.trim() === "") {
		return res.status(400).json({ message: "the address must no be empty" });
	}
	if (firstname.trim() === "") {
		return res
			.status(400)
			.json({ message: "the Firstname must no be empty" });
	}
	if (firstname.length > 2) {
		return res
			.status(400)
			.json({ message: "the firstname should has more the 2 characters" });
	}
	if (lastname.trim() === "") {
		return res.status(400).json({ message: "the lastname must no be empty" });
	}
	if (lastname.length > 2) {
		return res
			.status(400)
			.json({ message: "the Lastname should has more the 2 characters" });
	}
	if (zip.trim() === "") {
		return res.status(400).json({ message: "the Zip must no be empty" });
	}
	if (phone.trim() === "") {
		return res.status(400).json({ message: "the Phone must no be empty" });
	}
	if (country.trim() === "") {
		return res.status(400).json({ message: "the Country must no be empty" });
	}

	let userId = "";

	try {
		userId = await jwt.isValidToken(token);
	} catch (error) {
		return res.status(401).json({ message: "Token are no valid" });
	}

	const shippingAddress = new Address({
		address,
		address2,
		zip,
		firstname,
		lastname,
		country,
		phone,
	});

	try {
		await db.connect();
		await shippingAddress.save();
		const userById = await User.findById(userId);

		if (userById) {
			console.log("find user added address");
			userById.address = shippingAddress;
			await userById.save();
		}
	} catch (error) {
		await db.disconnect();
		return res.status(500).json({ message: "Error on create address" });
	}

	return res.status(201).json({ address: shippingAddress });
};

const getAddress = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { token = "" } = req.cookies;
	let userId = "";
	try {
		userId = await jwt.isValidToken(token);
	} catch (error) {
		return res.status(401).json({ message: "Token are no valid" });
	}
	await db.connect();
	const shippingAddress = await User.findById(userId).populate("address");
	await db.disconnect();

	if (shippingAddress?.address) {
		const { address } = shippingAddress;
		return res.status(200).json({ address });
	} else {
		return res
			.status(404)
			.json({ message: "Address not found for this user" });
	}
};
