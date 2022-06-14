import { Box, Typography } from "@mui/material";
import AdminNavbar from "components/admin/AdminNavbar";
import SideMenu from "components/ui/SideMenu";
import Head from "next/head";
import { FC } from "react";

interface ShopLayoutProps {
	title: string;
	subTitle: string;
	icon?: JSX.Element;
}

const AdminLayout: FC<ShopLayoutProps> = ({
	children,
	title,
	subTitle,
	icon,
}) => {
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<nav>
				<AdminNavbar />
			</nav>

			<SideMenu />
			<main
				style={{
					margin: "80px auto",
					maxWidth: "1440px",
					padding: "0px 30px",
				}}
			>
				<Box display="flex" flexDirection="column">
					<Typography variant="h1" component="h1">
						{icon} {title}
					</Typography>
					<Typography variant="h2" component="h2" sx={{ mb: 1 }}>
						{subTitle}
					</Typography>
				</Box>
				<Box className="fadeIn">{children}</Box>
			</main>
		</>
	);
};

export default AdminLayout;
