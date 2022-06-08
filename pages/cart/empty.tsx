import { NextPage } from "next";
import NextLink from "next/link";
import { Box, Link, Typography } from "@mui/material";
import ShopLayout from "components/layouts/ShopLayout";
import { RemoveShoppingCartOutlined } from "@mui/icons-material";

interface Props {}

const EmptyPage: NextPage<Props> = ({}) => {
	return (
		<ShopLayout title="Empty cart" pageDescription="Is any product on cart">
			<Box
				display="flex"
				alignItems="center"
				justifyContent="center"
				height="calc(100vh - 200px)"
				sx={{ flexDirection: { xs: "column", sm: "row" } }}
			>
				<RemoveShoppingCartOutlined sx={{ fontSize: 70 }} />
				<Box display="flex" flexDirection="column" alignItems="center">
					<Typography>Your cart is empty</Typography>
					<NextLink href="/" passHref>
						<Link typography="h4" color="secondary">
							Go Back
						</Link>
					</NextLink>
				</Box>
			</Box>
		</ShopLayout>
	);
};

export default EmptyPage;
