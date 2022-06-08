import { NextPage } from "next";
import NextLink from "next/link";
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	Link,
	Typography,
} from "@mui/material";
import CartList from "components/cart/CartList";
import OrderSummary from "components/cart/OrderSummary";
import ShopLayout from "components/layouts/ShopLayout";
import {
	CreditCardOffOutlined,
	CreditScoreOutlined,
} from "@mui/icons-material";

interface Props {}

const OrderPage: NextPage<Props> = ({}) => {
	return (
		<ShopLayout
			title="Resume of order 1234567"
			pageDescription="Resume of the order"
		>
			<Typography variant="h1" component="h1" sx={{ my: 2 }}>
				Order: Abc1234
			</Typography>
			{/* <Chip
				sx={{ my: 2 }}
				label="Pedding to Pay"
				variant="outlined"
				color="error"
				icon={<CreditCardOffOutlined />}
			/> */}
			<Chip
				sx={{ my: 2 }}
				label="Payoff"
				variant="outlined"
				color="success"
				icon={<CreditScoreOutlined />}
			/>
			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">Summary (3 products)</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display="flex" justifyContent="flex-end">
								<NextLink href="/checkout/address" passHref>
									<Link underline="always">Edit</Link>
								</NextLink>
							</Box>

							<Typography variant="subtitle1">
								Address of the Shipping
							</Typography>

							<Typography>Alfredo Izquierdo</Typography>
							<Typography>9411 w mcnab</Typography>
							<Typography>Tamarac, Fl 33321</Typography>
							<Typography>Usa</Typography>
							<Typography>+14536778990</Typography>
							<Divider sx={{ my: 1 }} />
							<Box display="flex" justifyContent="flex-end">
								<NextLink href="/cart" passHref>
									<Link underline="always">Edit</Link>
								</NextLink>
							</Box>

							<OrderSummary />
							<Box sx={{ mt: 3 }}>
								{/* TODO */}
								<h2>Pay</h2>
								<Chip
									sx={{ my: 2 }}
									label="Payoff"
									variant="outlined"
									color="success"
									icon={<CreditScoreOutlined />}
								/>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default OrderPage;
