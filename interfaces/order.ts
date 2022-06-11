import { IUser } from "./user";
import { IShippingAddress } from "./shippingAddress";
export interface IOrder {
	_id?: string;
	user?: IUser | string;
	orderItems: IOrderItem[];
	shippingAddress: IShippingAddress;
	paymentResult?: string;
	numberOfIttem: number;
	subTotal: number;
	total: number;
	taxt: number;
	isPaid: boolean;
	paidAt: string;
}

export interface IOrderItem {
	_id: string;
	title: string;
	size: string;
	quantity: number;
	slug: string;
	image: string;
	price: number;
}
