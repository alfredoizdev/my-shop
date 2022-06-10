import { IShippingAddress } from "interfaces";
import { ShippingState } from "./";

type ShippingActionType =
	| {
			type: "[Shipping] - update address";
			payload: IShippingAddress | undefined;
	  }
	| {
			type: "[Shipping] - address error";
			payload: string;
	  }
	| {
			type: "[Shipping] - address clear error";
	  };

export const shippingReducer = (
	state: ShippingState,
	action: ShippingActionType
): ShippingState => {
	switch (action.type) {
		case "[Shipping] - update address":
			return {
				...state,
				shippingAddress: action.payload,
			};
		case "[Shipping] - address error":
			return {
				...state,
				hasError: true,
				messageError: action.payload,
			};
		case "[Shipping] - address clear error":
			return {
				...state,
				hasError: false,
				messageError: null,
			};
		default:
			return state;
	}
};
