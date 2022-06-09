import { ICountry } from "interfaces";
import { UiState } from "./";

type UiActionType =
	| { type: "[UI] - toggleMenu" }
	| { type: "[UI] - Sett Cuntries list"; payload: ICountry[] };

export const uiReducer = (state: UiState, action: UiActionType): UiState => {
	switch (action.type) {
		case "[UI] - toggleMenu":
			return {
				...state,
				isMenuOpen: !state.isMenuOpen,
			};
		case "[UI] - Sett Cuntries list":
			return {
				...state,
				countries: action.payload,
			};

		default:
			return state;
	}
};
