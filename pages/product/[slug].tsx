import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { GetStaticPaths } from "next";
import ShopLayout from "components/layouts/ShopLayout";
import { GetStaticProps } from "next";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import ProductSlideshow from "components/products/ProductSlideshow/index";
import ItemCounter from "components/ui/ItemCounter";
import SizeSelector from "components/products/SizeSelector";
import { IProduct, ICartProduct, IValidSizes } from "interfaces";
import { dbProducts } from "database";
import { CartContext } from "context/cart/CartContext";

interface Props {
	product: IProduct;
}

const Slug: NextPage<Props> = ({ product }) => {
	const router = useRouter();
	const { addProductToCart } = useContext(CartContext);
	const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
		_id: product._id,
		image: product.images[0],
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1,
	});

	const selectedSize = (size: IValidSizes) => {
		setTempCartProduct((currentProduct) => ({ ...currentProduct, size }));
	};

	const onUpdateQuantity = (quantity: number) => {
		setTempCartProduct((currentProduct) => ({ ...currentProduct, quantity }));
	};

	const onAddProduct = () => {
		if (!tempCartProduct.size) return;
		//console.log(tempCartProduct);
		addProductToCart(tempCartProduct);
		router.replace("/cart");
	};

	return (
		<ShopLayout title={product.title} pageDescription={product.description}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={7}>
					<ProductSlideshow images={product.images} />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Box display="flex" flexDirection="column">
						<Typography variant="h1" component="h1">
							{product.title}
						</Typography>
						<Typography variant="subtitle1" component="h2">
							{`$${product.price}`}
						</Typography>
					</Box>
					{/* Cantida */}
					<Box sx={{ my: 2 }}>
						<Typography variant="subtitle2" component="p">
							Mount
						</Typography>
						<ItemCounter
							currentValue={tempCartProduct.quantity}
							updatedQuantity={(value) => onUpdateQuantity(value)}
							maxValue={product.inStock > 10 ? 10 : product.inStock}
						/>
						<SizeSelector
							selectedSize={tempCartProduct.size}
							sizes={product.sizes}
							onSelectedSize={selectedSize}
						/>
					</Box>
					{/* Add to cart */}
					{product.inStock > 0 ? (
						<Button
							fullWidth
							color="secondary"
							className="circular-btn"
							disabled={!tempCartProduct.size}
							onClick={onAddProduct}
						>
							{tempCartProduct.size ? "Add to cart" : "Select a size"}
						</Button>
					) : (
						<Chip
							sx={{ width: "100%" }}
							label="Out of stock"
							color="error"
							variant="filled"
						/>
					)}

					{/* description */}
					<Box sx={{ mt: 3 }}>
						<Typography variant="subtitle2">Description</Typography>
						<Typography variant="body2">
							Lorem ipsum, dolor sit amet consectetur adipisicing elit.
							Quo ex, aliquid doloremque officia exercitationem illo
							laborum commodi in inventore, id maiores blanditiis
							corporis eaque fuga alias unde magni dolore quaerat!
						</Typography>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async () => {
	const productSlugs = await dbProducts.getAllProductSlugs();

	return {
		paths: productSlugs.map(({ slug }) => ({
			params: {
				slug,
			},
		})),
		fallback: "blocking",
	};
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug = "" } = params as { slug: string };
	const product = await dbProducts.getProductBySlug(slug);

	if (!product) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return {
		props: {
			product,
		},
		revalidate: 60 * 60 * 24,
	};
};

export default Slug;
