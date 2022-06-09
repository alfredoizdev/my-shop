import { db } from "database";
import { ICountry } from "interfaces/country";
import { Country } from "models";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = { message: string } | ICountry[];

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "GET":
			return getCountrieList(req, res);

		default:
			return res.status(400).json({ message: "Bad Request" });
	}
}

const getCountrieList = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	await db.connect();

	const countries = await Country.find({}).select("name code -_id");
	await db.disconnect();

	if (!countries) {
		return res.status(404).json({
			message: "Country not found",
		});
	}

	return res.status(200).json(countries);
};
