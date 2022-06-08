import { ICartProduct } from "interfaces/cart";
import { createContext } from "react";

interface contextProps {
	cart: ICartProduct[];
	numbeOfItems: number;
	subTotal: number;
	tax: number;
	total: number;
	// total
	addProductToCart: (product: ICartProduct) => void;
	updateCartQuantity: (product: ICartProduct) => void;
	removedCartProduct: (product: ICartProduct) => void;
}

export const CartContext = createContext({} as contextProps);
