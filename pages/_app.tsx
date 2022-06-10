import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "themes";
import { SWRConfig } from "swr";
import { AuthProvider, CartProvider, UiProvider } from "context";
import { ShippingProvider } from "context/shipping";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SWRConfig
			value={{
				fetcher: (resource, init) =>
					fetch(resource, init).then((res) => res.json()),
			}}
		>
			<AuthProvider>
				<ShippingProvider>
					<CartProvider>
						<UiProvider>
							<ThemeProvider theme={lightTheme}>
								<CssBaseline />
								<Component {...pageProps} />
							</ThemeProvider>
						</UiProvider>
					</CartProvider>
				</ShippingProvider>
			</AuthProvider>
		</SWRConfig>
	);
}

export default MyApp;
