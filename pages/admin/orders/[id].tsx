import { useEffect, useState } from "react";
import { NextPage } from "next";
import { GetServerSideProps } from "next";

import {
	Box,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	Typography,
} from "@mui/material";

import CartList from "components/cart/CartList";
import OrderSummary from "components/cart/OrderSummary";
import ShopLayout from "components/layouts/ShopLayout";
import {
	AirplaneTicketOutlined,
	CreditCardOffOutlined,
	CreditScoreOutlined,
} from "@mui/icons-material";
import { dbOrders } from "database";
import { IOrder } from "interfaces";
import FullScreenLoading from "components/ui/FullScreenLoading";
import AdminLayout from "components/layouts/AdminLayout";

interface Props {
	order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
	const [showLoading, setShowLoading] = useState(false);
	const { shippingAddress } = order;

	useEffect(() => {
		if (order) {
			setShowLoading(true);
		} else {
			setShowLoading(false);
		}
	}, [order]);

	if (showLoading) {
		<FullScreenLoading />;
	}

	return (
		<AdminLayout
			title="Resume of order 1234567"
			subTitle={`OrderId: ${order._id}`}
			icon={<AirplaneTicketOutlined />}
		>
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
										label="Pedding"
										variant="outlined"
										color="error"
										icon={<CreditScoreOutlined />}
									/>
								)}
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { id = "" } = query;

	const order = await dbOrders.getOrderById(id.toString());

	if (!order) {
		return {
			redirect: {
				destination: "/admin/orders",
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
