import { createContext } from "react";
import { IShippingAddress } from "interfaces";

interface contextProps {
	hasError: boolean;
	shippingAddress?: IShippingAddress;
	messageError?: string | null;
	updateAddress: (data: IShippingAddress) => void;
}

export const ShippingContext = createContext({} as contextProps);
