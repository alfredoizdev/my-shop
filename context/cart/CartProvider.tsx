import { FunctionComponent, useEffect, useReducer } from "react";
import { ICartProduct, IShippingAddress, IOrder } from "interfaces";
import { CartContext, cartReducer } from "./";
import Cookies from "js-cookie";
import { shopApi } from "api";
import axios, { AxiosError } from "axios";

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

	const createOrder = async (): Promise<{
		hasError: boolean;
		message: string;
	}> => {
		console.log(state.numberOfItems);
		try {
			const { data: shipping } = await shopApi.get("user/address");

			if (!shipping) throw Error("Is not a shipping address");

			const body: IOrder = {
				orderItems: state.cart.map((product) => ({
					...product,
					size: product.size!,
				})),
				shippingAddress: shipping.address,
				numberOfItems: state?.numberOfItems,
				subTotal: state.subTotal,
				tax: state.tax,
				total: state.total,
				isPaid: false,
			};

			const { data } = await shopApi.post<IOrder>("/orders", body);

			dispatch({ type: "[Cart] - Order completed" });

			return {
				hasError: false,
				message: data._id!,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					hasError: true,
					// @ts-ignore
					message: error.response?.data.message,
				};
			}

			return {
				hasError: true,
				message: "unhandle error please contatc with the admin",
			};
		}
	};

	return (
		<CartContext.Provider
			value={{
				...state,
				addProductToCart,
				updateCartQuantity,
				removedCartProduct,
				createOrder,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
