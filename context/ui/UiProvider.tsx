import { FunctionComponent, useEffect, useReducer } from "react";
import { ICountry } from "interfaces";
import { UiContext, uiReducer } from "./";
import { shopApi } from "api";

export interface UiState {
	isMenuOpen: boolean;
	countries: ICountry[];
}

const UI_INITIAL_STATE: UiState = {
	isMenuOpen: false,
	countries: [],
};

interface Props {}

export const UiProvider: FunctionComponent<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

	useEffect(() => {
		const getAllCountries = async () => {
			try {
				const { data } = await shopApi.get<ICountry[]>("countries");
				dispatch({ type: "[UI] - Sett Cuntries list", payload: data });
			} catch (error) {
				dispatch({ type: "[UI] - Sett Cuntries list", payload: [] });
			}
		};

		getAllCountries();
	}, []);

	const toggleSideMenu = () => {
		dispatch({ type: "[UI] - toggleMenu" });
	};

	return (
		<UiContext.Provider
			value={{
				...state,
				toggleSideMenu,
			}}
		>
			{children}
		</UiContext.Provider>
	);
};
