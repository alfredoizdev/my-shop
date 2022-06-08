import { createContext } from "react";

interface contextProps {
	isMenuOpen: boolean;
	toggleSideMenu: () => void;
}

export const UiContext = createContext({} as contextProps);
