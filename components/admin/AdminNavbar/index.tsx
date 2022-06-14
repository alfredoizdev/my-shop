import { FC, useContext } from "react";
import NextLink from "next/link";
import { UiContext } from "context";
import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";

const AdminNavbar: FC = () => {
	const { toggleSideMenu } = useContext(UiContext);

	return (
		<AppBar>
			<Toolbar>
				<NextLink href="/" passHref>
					<Link display="flex" alignItems="center">
						<Typography variant="h6">My Shop | </Typography>
						<Typography sx={{ marginLeft: "0.5px" }}>Tesla</Typography>
					</Link>
				</NextLink>
				<Box flex={1} />

				<Button onClick={toggleSideMenu}>Menu</Button>
			</Toolbar>
		</AppBar>
	);
};

export default AdminNavbar;
