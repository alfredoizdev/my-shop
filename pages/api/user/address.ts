import type { NextApiRequest, NextApiResponse } from "next";
import { jwt } from "utils";
import { IShippingAddress } from "interfaces/shippingAddress";
import { User } from "models";
import { db } from "database";
import Address from "models/Address";
import { getSession } from "next-auth/react";

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
	const session: any = await getSession({ req });

	if (!session) {
		return res.status(401).json({ message: "User not found is not login" });
	}

	const {
		address = "",
		address2 = "",
		firstname = "",
		lastname = "",
		zip = "",
		phone = "",
		country = "",
		city = "",
	} = req.body as {
		address: string;
		address2: string;
		firstname: string;
		lastname: string;
		zip: string;
		phone: string;
		country: string;
		city: string;
	};

	if (address.trim() === "") {
		return res.status(400).json({ message: "the address must no be empty" });
	}
	if (firstname.trim() === "") {
		return res
			.status(400)
			.json({ message: "the Firstname must no be empty" });
	}
	if (firstname.length <= 2) {
		return res
			.status(400)
			.json({ message: "the firstname should has more the 2 characters" });
	}
	if (lastname.trim() === "") {
		return res.status(400).json({ message: "the lastname must no be empty" });
	}
	if (lastname.length <= 2) {
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
	if (city.trim() === "") {
		return res.status(400).json({ message: "the City must no be empty" });
	}

	try {
		await db.connect();

		const addressOnFile = await Address.findOne({
			userId: session.user._id,
		}).limit(1);
		if (addressOnFile) {
			addressOnFile.address = address;
			addressOnFile.address2 = address2;
			addressOnFile.firstname = firstname;
			addressOnFile.lastname = lastname;
			addressOnFile.city = city;
			addressOnFile.country = country;
			addressOnFile.phone = phone;

			await addressOnFile.save();
			await db.disconnect();
			return res.status(201).json({ address: addressOnFile });
		} else {
			const shippingAddress = new Address({
				address,
				address2,
				zip,
				firstname,
				lastname,
				country,
				phone,
				city,
				userId: session.user._id,
			});
			await shippingAddress.save();
			const userById = await User.findById(session.user._id);

			if (userById) {
				userById.address = shippingAddress;
				await userById.save();
			}
			await db.disconnect();
			return res.status(201).json({ address: shippingAddress });
		}
	} catch (error) {
		await db.disconnect();
		console.log(error);
		return res.status(500).json({ message: "Error on create address" });
	}
};

const getAddress = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const session: any = await getSession({ req });

	if (!session) {
		return res.status(401).json({ message: "User not found is not login" });
	}

	await db.connect();
	const shippingAddress = await User.findById(session.user._id).populate(
		"address"
	);
	await db.disconnect();

	console.log("HERE", shippingAddress);

	if (shippingAddress?.address) {
		const { address } = shippingAddress;
		return res.status(200).json({ address });
	} else {
		return res
			.status(404)
			.json({ message: "Address not found for this user" });
	}
};
