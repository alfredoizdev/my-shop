import { createContext } from "react";
import { ICountry } from "interfaces";

interface contextProps {
	isMenuOpen: boolean;
	countries: ICountry[];
	// method
	toggleSideMenu: () => void;
}

export const UiContext = createContext({} as contextProps);
