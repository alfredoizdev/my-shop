import { FunctionComponent, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import CartList from "components/cart/CartList";
import OrderSummary from "components/cart/OrderSummary";
import ShopLayout from "components/layouts/ShopLayout";
import { CartContext } from "context/cart/CartContext";

import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Grid,
	Typography,
} from "@mui/material";

interface Props {}

const CartPage: FunctionComponent<Props> = ({}) => {
	const { isLoaded, numberOfItems } = useContext(CartContext);
	const router = useRouter();

	useEffect(() => {
		if (isLoaded && numberOfItems === 0) {
			router.replace("/cart/empty");
		}
	}, [isLoaded, numberOfItems, router]);

	if (!isLoaded) {
		return <></>;
	}

	return (
		<ShopLayout title="Shopping Cart" pageDescription="Shopping Cart">
			<Typography variant="h1" component="h1">
				Cart
			</Typography>
			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList editabled />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">Order</Typography>
							<Divider sx={{ my: 1 }} />
							<OrderSummary />
							<Box sx={{ mt: 3 }}>
								<Button
									color="secondary"
									className="circular-btn"
									fullWidth
								>
									Checkout
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default CartPage;
