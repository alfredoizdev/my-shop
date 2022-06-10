import { FunctionComponent, useEffect, useReducer } from "react";
import { ICartProduct, IShippingAddress } from "interfaces";
import { CartContext, cartReducer } from "./";
import Cookies from "js-cookie";

export interface CartState {
	isLoaded: boolean;
	cart: ICartProduct[];
	numberOfItems: number;
	subTotal: number;
	tax: number;
	total: number;
	shippingAddress?: IShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
	isLoaded: false,
	cart: [],
	numberOfItems: 0,
	subTotal: 0,
	tax: 0,
	total: 0,

	shippingAddress: undefined,
};

interface Props {}

export const CartProvider: FunctionComponent<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

	useEffect(() => {
		try {
			const cookieProducts = Cookies.get("cart")
				? JSON.parse(Cookies.get("cart")!)
				: [];

			dispatch({
				type: "[Cart] - Load cart from cookies | storage",
				payload: cookieProducts,
			});
		} catch (error) {
			dispatch({
				type: "[Cart] - Load cart from cookies | storage",
				payload: [],
			});
		}
	}, []);

	useEffect(() => {
		if (Cookies.get("firstname")) {
			const address: IShippingAddress = {
				firstname: Cookies.get("firtsname") || "",
				lastname: Cookies.get("lastname") || "",
				address: Cookies.get("address") || "",
				address2: Cookies.get("address2") || "",
				zip: Cookies.get("zip") || "",
				city: Cookies.get("city") || "",
				country: Cookies.get("country") || "",
				phone: Cookies.get("phone") || "",
			};

			dispatch({
				type: "[Cart] - Load address from cookies",
				payload: address,
			});
		}
	}, []);

	useEffect(() => {
		Cookies.set("cart", JSON.stringify(state.cart));
	}, [state.cart]);

	useEffect(() => {
		// sumamos lo que tenemos en el cart current quantity + prev
		const numberOfItems = state.cart.reduce(
			(prev, current) => current.quantity + prev,
			0
		);

		const subTotal = state.cart.reduce(
			(prev, current) => current.quantity * current.price + prev,
			0
		);

		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

		const orderSumary = {
			numberOfItems,
			subTotal,
			tax: subTotal * taxRate,
			total: subTotal * (taxRate + 1),
		};
		dispatch({ type: "[Cart] - Update order summary", payload: orderSumary });
	}, [state.cart]);

	const addProductToCart = (product: ICartProduct) => {
		// existe producto con ese Id devuelve true con some
		const productInCart = state.cart.some((p) => p._id === product._id);
		// si no existe agrego el producto
		if (!productInCart)
			return dispatch({
				type: "[Cart] - Updated product in cart",
				payload: [...state.cart, product],
			});

		// si existe el producto con la misma talla que se manda
		const productInCartButDifferentSize = state.cart.some(
			(p) => p._id === product._id && p.size === product.size
		);
		// si no existe el producto con la misma talla agregamos el producto
		if (!productInCartButDifferentSize)
			return dispatch({
				type: "[Cart] - Updated product in cart",
				payload: [...state.cart, product],
			});

		// si el producto existe

		const updatedProducts = state.cart.map((p) => {
			if (p._id !== product._id) return p;
			if (p.size !== product.size) return p;

			// updated the quantity

			p.quantity += product.quantity;
			return p;
		});

		dispatch({
			type: "[Cart] - Updated product in cart",
			payload: updatedProducts,
		});
	};

	const removedCartProduct = (product: ICartProduct) => {
		dispatch({ type: "[Cart] - Removed product in cart", payload: product });
	};

	const updateCartQuantity = (product: ICartProduct) => {
		dispatch({ type: "[Cart] - Change quantity product", payload: product });
	};

	const updateAddress = (data: IShippingAddress) => {
		Cookies.set("firtsname", data.firstname);
		Cookies.set("lastname", data.lastname);
		Cookies.set("address", data.address);
		Cookies.set("address2", data.address2 || "");
		Cookies.set("zip", data.zip);
		Cookies.set("city", data.city);
		Cookies.set("country", data.country);
		Cookies.set("phone", data.phone);
		dispatch({ type: "[Cart] - Update address", payload: data });
	};

	return (
		<CartContext.Provider
			value={{
				...state,
				addProductToCart,
				updateCartQuantity,
				removedCartProduct,
				updateAddress,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
