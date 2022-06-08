import { NextPage } from "next";
import ShopLayout from "components/layouts/ShopLayout";
import { Box, Typography } from "@mui/material";

const Custom404Page: NextPage = () => {
	return (
		<ShopLayout title="404" pageDescription="Anything to show here is 404">
			<Box
				display="flex"
				alignItems="center"
				justifyContent="center"
				height="calc(100vh - 200px)"
				sx={{ flexDirection: { xs: "column", sm: "row" } }}
			>
				<Typography
					variant="h1"
					component="h1"
					fontSize={70}
					fontWeight={200}
				>
					404 |
				</Typography>
				<Typography marginLeft={2}>Not content found</Typography>
			</Box>
		</ShopLayout>
	);
};

export default Custom404Page;
