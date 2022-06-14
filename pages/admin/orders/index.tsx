import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import AdminLayout from "components/layouts/AdminLayout";
import FullScreenLoading from "components/ui/FullScreenLoading";
import { IOrder, IUser } from "interfaces";
import { NextPage } from "next";
import useSWR from "swr";

const columns: GridColDef[] = [
	{ field: "id", headerName: "Order ID", width: 250 },
	{ field: "email", headerName: "Email", width: 250 },
	{ field: "name", headerName: "Name", width: 300 },
	{ field: "total", headerName: "Total", width: 100 },
	{
		field: "isPaid",
		headerName: "Pay off",
		renderCell: ({ row }: GridValueGetterParams) => {
			return row.isPaid ? (
				<Chip variant="outlined" label="Pay" color="success" />
			) : (
				<Chip variant="outlined" label="Pedding" color="error" />
			);
		},
	},
	{ field: "noProduct", headerName: "Stock", align: "center", width: 150 },
	{
		field: "check",
		headerName: "View Order",
		width: 150,
		renderCell: ({ row }: GridValueGetterParams) => {
			return (
				<a
					href={`/admin/orders/${row.id}`}
					target="_blank"
					rel="noreferrer"
				>
					View order
				</a>
			);
		},
	},
	{ field: "createdAt", headerName: "Create At", width: 200 },
];

interface Props {}

const OrdersPage: NextPage<Props> = () => {
	const { data, error } = useSWR<IOrder[]>("/api/admin/orders");

	if (!data && !error) {
		return <FullScreenLoading />;
	}

	const rows = data!.map((order) => ({
		id: order._id,
		email: (order.user as IUser).email,
		name: (order.user as IUser).name,
		total: order.total,
		isPaid: order.isPaid,
		noProduct: order.numberOfItems,
		createdAt: order.createdAt,
	}));

	return (
		<AdminLayout
			title="Orders"
			subTitle="Handle Orders"
			icon={<ConfirmationNumberOutlined />}
		>
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
		</AdminLayout>
	);
};

export default OrdersPage;
