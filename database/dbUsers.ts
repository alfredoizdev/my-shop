import { db } from "database";
import { User } from "models";
import bcryptjs from "bcryptjs";

export const checkUserEmailPassword = async (
	email: string,
	password: string
) => {
	await db.connect();

	const user = await User.findOne({ email });
	await db.disconnect();

	if (!user) {
		return null;
	}

	if (!bcryptjs.compareSync(password, user.password)) {
		return null;
	}

	const { role, name, _id } = user;

	return {
		_id,
		email: email.toLocaleLowerCase(),
		role,
		name,
	};
};

export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
	await db.connect();

	const user = await User.findOne({ email: oAuthEmail });

	if (user) {
		await db.disconnect();
		const { _id, name, email, role } = user;
		return { _id, name, email, role };
	}

	const newUser = new User({
		email: oAuthEmail,
		name: oAuthEmail,
		password: "@",
		role: "client",
	});
	await newUser.save();
	await db.disconnect();

	const { _id, name, email, role } = await newUser.save();
	return { _id, name, email, role };
};
