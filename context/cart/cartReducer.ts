import { ICartProduct } from "interfaces/cart";
import { CartState } from "./";
import { OrderSumary } from "./cartType";

type CartActionType =
	| {
			type: "[Cart] - Load cart from cookies | storage";
			payload: ICartProduct[];
	  }
	| {
			type: "[Cart] - Updated product in cart";
			payload: ICartProduct[];
	  }
	| {
			type: "[Cart] - Change quantity product";
			payload: ICartProduct;
	  }
	| {
			type: "[Cart] - Removed product in cart";
			payload: ICartProduct;
	  }
	| {
			type: "[Cart] - Update order summary";
			payload: OrderSumary;
	  }
	| {
			type: "[Cart] - Order completed";
	  };

export const cartReducer = (
	state: CartState,
	action: CartActionType
): CartState => {
	switch (action.type) {
		case "[Cart] - Load cart from cookies | storage":
			return {
				...state,
				isLoaded: true,
				cart: [...action.payload],
			};
		case "[Cart] - Updated product in cart":
			return {
				...state,
				cart: [...action.payload],
			};
		case "[Cart] - Change quantity product":
			return {
				...state,
				cart: state.cart.map((product) => {
					if (product._id !== action.payload._id) return product;
					if (product.size !== action.payload.size) return product;
					// si llego aqui actualizamos el producto que tiene la nueva cantidad mandada en el dispatch
					return action.payload;
				}),
			};

		case "[Cart] - Removed product in cart":
			return {
				...state,
				cart: state.cart.filter(
					(product) =>
						!(
							product._id === action.payload._id &&
							product.size === action.payload.size
						)
				),
			};

		case "[Cart] - Update order summary":
			return {
				...state,
				...action.payload,
			};
		case "[Cart] - Order completed":
			return {
				...state,
				cart: [],
				numberOfItems: 0,
				subTotal: 0,
				tax: 0,
				total: 0,
			};
		// case "[Cart] - Load address from cookies":
		// case "[Cart] - Update address":
		// 	return { ...state, shippingAddress: action.payload };

		default:
			return state;
	}
};
