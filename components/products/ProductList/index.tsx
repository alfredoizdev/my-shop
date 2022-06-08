import { FC } from "react";
import { Grid } from "@mui/material";
import { IProduct } from "interfaces/products";
import ProductCart from "../ProductCart";

interface ProductListProps {
	products: IProduct[];
}

const ProductList: FC<ProductListProps> = ({ products }) => {
	return (
		<Grid container spacing={4}>
			{products.map((product) => (
				<ProductCart product={product} key={product.slug} />
			))}
		</Grid>
	);
};

export default ProductList;
