import { Typography } from "@mui/material";
import ShopLayout from "components/layouts/ShopLayout";
import type { NextPage } from "next";
import ProductList from "components/products/ProductList";
import { useProduct } from "hooks";
import FullScreenLoading from "components/ui/FullScreenLoading";

const ManPage: NextPage = () => {
	const { products, isError, isLoading } = useProduct("/products?gender=man");

	return (
		<>
			<ShopLayout
				title="My shop - man"
				pageDescription="Found better products for our man"
			>
				<Typography variant="h1" component="h1">
					My Shop
				</Typography>
				<Typography variant="h2" sx={{ mb: 1 }}>
					Man
				</Typography>

				{isLoading ? (
					<FullScreenLoading />
				) : (
					<ProductList products={products} />
				)}
			</ShopLayout>
		</>
	);
};

export default ManPage;
