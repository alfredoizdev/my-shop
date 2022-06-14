import { IUser } from "./user";
import { IShippingAddress } from "./shippingAddress";
import { IValidSizes } from "./products";

export interface IOrder {
	_id?: string;
	user?: IUser | string;
	orderItems: IOrderItem[];
	shippingAddress: IShippingAddress;
	paymentResult?: string;
	numberOfItems: number;
	subTotal: number;
	total: number;
	tax: number;
	isPaid: boolean;
	paidAt?: string;

	transactionId?: string;
	createdAt?: string;
}

export interface IOrderItem {
	_id: string;
	title: string;
	size: IValidSizes;
	quantity: number;
	slug: string;
	image: string;
	price: number;
}
