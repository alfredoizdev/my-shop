import { NextPage } from "next";
import { GetServerSideProps } from "next";
import NextLink from "next/link";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Chip, Grid, Link, Typography } from "@mui/material";
import ShopLayout from "components/layouts/ShopLayout";
import { getSession } from "next-auth/react";
import { dbOrders } from "database";
import { IOrder } from "interfaces";

const columns: GridColDef[] = [
	{ field: "id", headerName: "ID", width: 100 },
	{ field: "fullname", headerName: "Nombre Completo", width: 300 },

	{
		field: "paid",
		headerName: "Pagada",
		description: "Muestra información si está pagada la orden o no",
		width: 200,
		renderCell: (params: GridValueGetterParams) => {
			return params.row.paid ? (
				<Chip color="success" label="Pay off" variant="outlined" />
			) : (
				<Chip color="error" label="Pedding to pay" variant="outlined" />
			);
		},
	},
	{
		field: "orden",
		headerName: "Ver orden",
		width: 200,
		sortable: false,
		renderCell: (params: GridValueGetterParams) => {
			return (
				<NextLink href={`/orders/${params.row.orderId}`} passHref>
					<Link underline="always">Ver orden</Link>
				</NextLink>
			);
		},
	},
];
interface Props {
	orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
	const rows = orders.map((order, idx) => ({
		id: idx + 1,
		paid: order.isPaid,
		fullname: `${order.shippingAddress.firstname} ${order.shippingAddress.lastname}`,
		orderId: order._id,
	}));
	return (
		<ShopLayout
			title="History of Orders"
			pageDescription="list of history all orders"
		>
			<Typography variant="h1" component="h1">
				History of orders
			</Typography>

			<Grid container className="fadeIn">
				<Grid item xs={12} sx={{ height: 650, width: "100%" }}>
					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={10}
						rowsPerPageOptions={[10]}
					/>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session: any = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: "/auth/login?p=/orders/history",
				permanent: false,
			},
		};
	}

	const orders = await dbOrders.dbGetOrdersByUser(session.user._id);

	return {
		props: {
			orders,
		},
	};
};

export default HistoryPage;
