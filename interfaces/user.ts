import { IShippingAddress } from "./shippingAddress";
export interface IUser {
	_id: string;
	name: string;
	email: string;
	password: string;
	role: string;
	createdAt: string;
	updatedAt: string;
	address?: IShippingAddress | null;
}

export interface IUserToken {
	token?: string;
	user: IUser;
}
