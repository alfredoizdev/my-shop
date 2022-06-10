import mongoose, { Schema, Model, model } from "mongoose";
import { IShippingAddress } from "interfaces";

const addressSchema = new Schema({
	firstname: { type: String },
	lastname: { type: String, require: true },
	address: { type: String, require: true },
	address2: { type: String },
	zip: { type: String, require: true },
	city: { type: String, require: true },
	country: { type: String, require: true },
	phone: { type: String, require: true },
	userId: { type: String, required: true },
});

const Address: Model<IShippingAddress> =
	mongoose.models.Address || model("Address", addressSchema);

export default Address;
