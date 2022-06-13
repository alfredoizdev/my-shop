import { NextPage } from "next";
import { GetServerSideProps } from "next";
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
import { getSession } from "next-auth/react";
import { dbOrders } from "database";
import { IOrder } from "interfaces";

interface Props {
	order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
	const { shippingAddress } = order;
	return (
		<ShopLayout
			title="Resume of order 1234567"
			pageDescription="Resume of the order"
		>
			<Typography variant="h1" component="h1" sx={{ my: 2 }}>
				Order: {order._id}
			</Typography>
			{order.isPaid ? (
				<Chip
					sx={{ my: 2 }}
					label="Payoff"
					variant="outlined"
					color="success"
					icon={<CreditScoreOutlined />}
				/>
			) : (
				<Chip
					sx={{ my: 2 }}
					label="Pedding to Pay"
					variant="outlined"
					color="error"
					icon={<CreditCardOffOutlined />}
				/>
			)}

			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList products={order.orderItems} />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">
								Summary ({order.numberOfItems}{" "}
								{order.numberOfItems > 1 ? "products" : "product"})
							</Typography>
							<Divider sx={{ my: 1 }} />

							<Typography variant="subtitle1">
								Address of the Shipping
							</Typography>

							<Typography>
								{shippingAddress.firstname} {shippingAddress.lastname}
							</Typography>
							<Typography>
								{shippingAddress.address}{" "}
								{shippingAddress.address2
									? `, ${shippingAddress.address2}`
									: ""}
							</Typography>
							<Typography>
								{shippingAddress.city}, {shippingAddress.zip}
							</Typography>
							<Typography>{shippingAddress.country}</Typography>
							<Typography>{shippingAddress.phone}</Typography>
							<Divider sx={{ my: 1 }} />

							<OrderSummary
								ordersSummary={{
									numberOfItems: order.numberOfItems,
									subTotal: order.subTotal,
									total: order.total,
									tax: order.tax,
								}}
							/>

							<Box sx={{ mt: 3 }} display="flex" flexDirection="column">
								{/* TODO */}

								{order.isPaid ? (
									<Chip
										sx={{ my: 2 }}
										label="Payoff"
										variant="outlined"
										color="success"
										icon={<CreditScoreOutlined />}
									/>
								) : (
									<h2>Pay</h2>
								)}
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const { id = "" } = query;
	const session: any = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: `/auth/login?p=/orders/${id}`,
				permanent: false,
			},
		};
	}

	const order = await dbOrders.getOrderById(id.toString());

	if (!order) {
		return {
			redirect: {
				destination: "/orders/history",
				permanent: false,
			},
		};
	}

	if (order.user !== session.user._id) {
		return {
			redirect: {
				destination: "/orders/history",
				permanent: false,
			},
		};
	}

	return {
		props: {
			order,
		},
	};
};

export default OrderPage;
