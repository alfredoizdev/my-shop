import { FunctionComponent, useReducer, useEffect } from "react";
import { ShippingContext, shippingReducer } from "./";
import { IShippingAddress } from "interfaces";
import { shopApi } from "api";
import axios from "axios";

export interface ShippingState {
	hasError: boolean;
	shippingAddress?: IShippingAddress;
	messageError?: string | null;
}

const SHIPPING_INITIAL_STATE: ShippingState = {
	hasError: false,
	shippingAddress: undefined,
	messageError: null,
};

interface Props {}

export const ShippingProvider: FunctionComponent<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(
		shippingReducer,
		SHIPPING_INITIAL_STATE
	);

	useEffect(() => {
		const getAddress = async () => {
			try {
				const { data } = await shopApi.get("user/address");
				dispatch({
					type: "[Shipping] - update address",
					payload: data.address,
				});
			} catch (error) {
				dispatch({
					type: "[Shipping] - update address",
					payload: undefined,
				});
			}
		};
		getAddress();
	}, []);

	const updateAddress = async (address: IShippingAddress) => {
		dispatch({ type: "[Shipping] - address clear error" });
		try {
			const { data } = await shopApi.post("user/address", address);

			dispatch({
				type: "[Shipping] - update address",
				payload: data.address,
			});
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const { message } = error.response?.data as { message: string };
				dispatch({ type: "[Shipping] - address error", payload: message });
			}
		}
	};

	return (
		<ShippingContext.Provider
			value={{
				...state,
				updateAddress,
			}}
		>
			{children}
		</ShippingContext.Provider>
	);
};
