import { FunctionComponent, useReducer } from "react";
import { UiContext, uiReducer } from "./";

export interface UiState {
	isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
	isMenuOpen: false,
};

interface Props {}

export const UiProvider: FunctionComponent<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

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
