import useSWR from "swr";
import {
	CreditCardOffOutlined,
	DashboardOutlined,
	AttachMoneyOutlined,
	GroupOutlined,
	CategoryOutlined,
	CancelPresentationOutlined,
	ProductionQuantityLimits,
	AccessTimeOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import SummaryTile from "components/admin/SummaryTile";
import AdminLayout from "components/layouts/AdminLayout";
import { NextPage } from "next";
import { IDashboardSummaryResponse } from "interfaces";
import FullScreenLoading from "components/ui/FullScreenLoading";

interface Props {}

const DashboadrPage: NextPage<Props> = () => {
	const { data, error } = useSWR<IDashboardSummaryResponse>(
		`/api/admin/dashboard`,
		{
			refreshInterval: 30 * 1000, // 30 seconds,
		}
	);

	const [refreshIn, setRefreshIn] = useState(30);

	useEffect(() => {
		let interval: any = null;
		if (data) {
			interval = setInterval(() => {
				setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
			}, 1000);
		}

		return () => clearInterval(interval);
	}, [data]);

	if (!error && !data) {
		return <FullScreenLoading />;
	}

	if (error) {
		console.log(error);
		return <Typography>Error on load data</Typography>;
	}

	const {
		numberOfClient,
		numberOfProduct,
		productsWithNoInventory,
		numberOfOrders,
		paidOrders,
		lowInventory,
		notPaidOrders,
	} = data!;

	return (
		<AdminLayout
			title="Dashboard"
			subTitle="Genaral stadistic"
			icon={<DashboardOutlined />}
		>
			<Grid container spacing={2}>
				<SummaryTile
					title={numberOfOrders}
					subTitle="Total orden"
					icon={
						<CreditCardOffOutlined
							color="success"
							sx={{ fontSize: 40 }}
						/>
					}
				/>

				<SummaryTile
					title={paidOrders}
					subTitle="Pay Ordes"
					icon={
						<AttachMoneyOutlined
							color="secondary"
							sx={{ fontSize: 40 }}
						/>
					}
				/>

				<SummaryTile
					title={notPaidOrders}
					subTitle="Pedding Orders"
					icon={
						<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />
					}
				/>
				<SummaryTile
					title={numberOfClient}
					subTitle="Clientes"
					icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={numberOfProduct}
					subTitle="Products"
					icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={productsWithNoInventory}
					subTitle="Out Stock"
					icon={
						<CancelPresentationOutlined
							color="error"
							sx={{ fontSize: 40 }}
						/>
					}
				/>
				<SummaryTile
					title={lowInventory}
					subTitle="Low Inventory"
					icon={
						<ProductionQuantityLimits
							color="warning"
							sx={{ fontSize: 40 }}
						/>
					}
				/>
				<SummaryTile
					title={refreshIn}
					subTitle="Refreshing in:"
					icon={
						<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />
					}
				/>
			</Grid>
		</AdminLayout>
	);
};

export default DashboadrPage;
