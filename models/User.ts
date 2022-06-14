import mongoose, { Schema, model, Model } from "mongoose";
import { IUser } from "interfaces";

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
		role: {
			type: String,
			enum: {
				values: ["admin", "client", "super-user", "SEO"],
				message: "{VALUE} is not a role allowed",
				default: "client",
				required: true,
			},
		},
	},
	{
		timestamps: true,
	}
);

const User: Model<IUser> = mongoose.models.User || model("User", userSchema);

export default User;
