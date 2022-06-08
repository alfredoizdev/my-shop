import { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Box, Typography } from "@mui/material";
import ShopLayout from "components/layouts/ShopLayout";
import ProductList from "components/products/ProductList";
import { dbProducts } from "database";
import { IProduct } from "interfaces/products";

interface Props {
	products: IProduct[];
	foundProduct: boolean;
	query: string;
}

const SearchPage: NextPage<Props> = ({ products, query, foundProduct }) => {
	return (
		<>
			<ShopLayout
				title="My shop - home"
				pageDescription="Found better products of tesla here"
			>
				<Typography variant="h1" component="h1">
					Search Products
				</Typography>
				{foundProduct ? (
					<Typography variant="h2" sx={{ mb: 1 }}>
						By term {query}
					</Typography>
				) : (
					<>
						<Box display="flex">
							<Typography variant="h2" sx={{ mb: 1 }}>
								Product was not found
							</Typography>
							<Typography
								variant="h2"
								sx={{ ml: 1 }}
								color="secondary"
								textTransform="capitalize"
							>
								{query}
							</Typography>
						</Box>
					</>
				)}

				<ProductList products={products} />
			</ShopLayout>
		</>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const { query = "" } = params as { query: string };
	let products = await dbProducts.getProductByTerm(query);
	let foundProduct = products.length > 0;

	if (!foundProduct) {
		products = await dbProducts.getProductByTerm("shirt");
	}

	if (!query) {
		return {
			redirect: {
				destination: "/",
				permanent: true,
			},
		};
	}

	// TODO Retornar otros productos

	return {
		props: {
			products,
			foundProduct,
			query,
		},
	};
};

export default SearchPage;
