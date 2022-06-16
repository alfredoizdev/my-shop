import type { NextPage } from "next";
import { Typography } from "@mui/material";
import ShopLayout from "components/layouts/ShopLayout";
import ProductList from "components/products/ProductList";
import { useProduct } from "hooks";
import FullScreenLoading from "components/ui/FullScreenLoading";

const HomePage: NextPage = () => {
	const { products, isLoading } = useProduct("/products");

	return (
		<>
			<ShopLayout
				title="My shop - home"
				pageDescription="Found better products of tesla here"
			>
				<Typography variant="h1" component="h1">
					My Shop
				</Typography>
				<Typography variant="h2" sx={{ mb: 1 }}>
					All products
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

export default HomePage;
