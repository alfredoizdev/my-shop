import { createContext } from "react";
import { ICartProduct, IShippingAddress } from "interfaces";

interface contextProps {
	isLoaded: boolean;
	cart: ICartProduct[];
	numberOfItems: number;
	subTotal: number;
	tax: number;
	total: number;
	shippingAddress?: IShippingAddress;
	// total
	addProductToCart: (product: ICartProduct) => void;
	updateCartQuantity: (product: ICartProduct) => void;
	removedCartProduct: (product: ICartProduct) => void;
	createOrder: () => Promise<void>;
}

export const CartContext = createContext({} as contextProps);
