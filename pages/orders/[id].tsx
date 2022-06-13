import { useEffect, useState } from "react";
import { NextPage } from "next";
import { GetServerSideProps } from "next";
import { PayPalButtons } from "@paypal/react-paypal-js";

import {
	Box,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Divider,
	Grid,
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
import { IOrder, IPaypal } from "interfaces";
import { shopApi } from "api";
import { useRouter } from "next/router";
import FullScreenLoading from "components/ui/FullScreenLoading";

interface Props {
	order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
	const [isPayAlredy, setIsPayAlreday] = useState(false);
	const [isPaying, setIspaying] = useState(false);
	const [showLoading, setShowLoading] = useState(false);
	const { shippingAddress } = order;

	useEffect(() => {
		if (order) {
			setIsPayAlreday(order.isPaid);
			setShowLoading(true);
		} else {
			setShowLoading(false);
		}
	}, [order]);

	const onOrderCompleted = async (details: IPaypal.OrderResponseBody) => {
		if (details.status !== "COMPLETED") {
			return alert("Is not pay in paypal");
		}
		setIspaying(true);

		try {
			const { data } = await shopApi.post(`/orders/pay`, {
				transactionId: details.id,
				orderId: order._id,
			});
			setIspaying(false);
			setIsPayAlreday(true);
		} catch (error) {
			setIspaying(false);
			console.log(error);
		}
	};

	if (showLoading) {
		<FullScreenLoading />;
	}

	return (
		<ShopLayout
			title="Resume of order 1234567"
			pageDescription="Resume of the order"
		>
			<Typography variant="h1" component="h1" sx={{ my: 2 }}>
				Order: {order._id}
			</Typography>
			{isPayAlredy ? (
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

			<Grid container className="fadeIn">
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
								{isPaying && (
									<Box
										display="flex"
										justifyContent="center"
										className="fadeIn"
									>
										<CircularProgress />
									</Box>
								)}

								{isPayAlredy ? (
									<Chip
										sx={{ my: 2 }}
										label="Payoff"
										variant="outlined"
										color="success"
										icon={<CreditScoreOutlined />}
									/>
								) : (
									<>
										{!isPaying && (
											<PayPalButtons
												createOrder={(data, actions) => {
													return actions.order.create({
														purchase_units: [
															{
																amount: {
																	value: `${order.total}`,
																},
															},
														],
													});
												}}
												onApprove={(data, actions) => {
													return actions
														.order!.capture()
														.then((details) => {
															onOrderCompleted(details);
														});
												}}
											/>
										)}
									</>
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
