import { FunctionComponent, useEffect, useReducer } from "react";
import { AuthContext, authReducer } from "./";
import { IUser } from "interfaces";
import { shopApi } from "api";
import Cookies from "js-cookie";
import { IUserToken } from "../../interfaces/user";
import axios from "axios";

export interface AuthState {
	isLoggedIn: boolean;
	user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
	isLoggedIn: false,
	user: undefined,
};

interface Props {}

export const AuthProvider: FunctionComponent<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

	useEffect(() => {
		const checkToken = async () => {
			try {
				const { data } = await shopApi.get<IUserToken>(
					"user/validate-token"
				);
				const { token, user } = data;
				Cookies.set("token", token!);
				dispatch({ type: "[Auth] - login", payload: user });
				return;
			} catch (error) {
				Cookies.remove("token");
				dispatch({ type: "[Auth] - logout" });
			}
		};

		checkToken();
	}, []);

	const loginUser = async (
		email: string,
		password: string
	): Promise<boolean> => {
		try {
			const { data } = await shopApi.post<IUserToken>("user/login", {
				email,
				password,
			});
			const { token, user } = data;
			Cookies.set("token", token!);
			dispatch({ type: "[Auth] - login", payload: user });
			return true;
		} catch (error) {
			return false;
		}
	};

	const registerUser = async (
		name: string,
		email: string,
		password: string
	): Promise<{ hasError: boolean; message?: string }> => {
		try {
			const { data } = await shopApi.post<IUserToken>("user/register", {
				name,
				email,
				password,
			});
			const { token, user } = data;
			Cookies.set("token", token!);
			dispatch({ type: "[Auth] - login", payload: user });
			return {
				hasError: false,
				message: "",
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const { message } = error.response?.data as { message: string };
				return {
					hasError: true,
					message,
				};
			}

			return {
				hasError: true,
				message: "Error on create user try one more time",
			};
		}
	};

	return (
		<AuthContext.Provider
			value={{
				...state,
				//method
				loginUser,
				registerUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
