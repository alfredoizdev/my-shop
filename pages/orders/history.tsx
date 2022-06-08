import { NextPage } from "next";
import NextLink from "next/link";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Chip, Grid, Link, Typography } from "@mui/material";
import ShopLayout from "components/layouts/ShopLayout";

const colunms: GridColDef[] = [
	{ field: "id", headerName: "ID", width: 100 },
	{ field: "fullName", headerName: "Full Name", width: 300 },
	{
		field: "paid",
		headerName: "payoff",
		description: "Show is the order is payoff",
		width: 200,
		renderCell: (params: GridValueGetterParams) => {
			return params.row.paid ? (
				<Chip color="success" variant="outlined" label="payoff" />
			) : (
				<Chip color="error" variant="outlined" label="pedding" />
			);
		},
	},
	{
		field: "order",
		headerName: "See order",
		width: 200,
		sortable: false,
		renderCell: (params: GridValueGetterParams) => {
			return (
				<NextLink href={`/orders/${params.row.id}`} passHref>
					<Link underline="always">See order</Link>
				</NextLink>
			);
		},
	},
];

const rows = [
	{ id: 1, paid: false, fullName: "Alfredo Izquierdo" },
	{ id: 2, paid: false, fullName: "Melizza Loan" },
	{ id: 3, paid: true, fullName: "Marlon Pazzio" },
	{ id: 4, paid: false, fullName: "Elene Norma" },
	{ id: 5, paid: true, fullName: "Yellena Lazo" },
	{ id: 6, paid: false, fullName: "Mirada Zabo" },
];

const HistoryPage: NextPage = () => {
	return (
		<ShopLayout
			title="History of Orders"
			pageDescription="list of history all orders"
		>
			<Typography variant="h1" component="h1">
				History of orders
			</Typography>

			<Grid container>
				<Grid item xs={12} sx={{ height: 650, width: "100%" }}>
					<DataGrid
						rows={rows}
						columns={colunms}
						pageSize={10}
						rowsPerPageOptions={[10]}
					/>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default HistoryPage;
