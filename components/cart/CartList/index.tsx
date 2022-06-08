import { FunctionComponent, useContext } from "react";
import NextLink from "next/link";
import { initialData } from "database/products";
import {
	Box,
	Button,
	CardActionArea,
	CardMedia,
	Grid,
	Link,
	Typography,
} from "@mui/material";
import ItemCounter from "components/ui/ItemCounter";
import { CartContext } from "context/cart/CartContext";
import { ICartProduct } from "interfaces/cart";

interface Props {
	editabled?: boolean;
}

const CartList: FunctionComponent<Props> = ({ editabled = false }) => {
	const { cart, updateCartQuantity, removedCartProduct } =
		useContext(CartContext);

	const onNewProductQuantityValue = (
		product: ICartProduct,
		newQuantityValue: number
	) => {
		product.quantity = newQuantityValue;
		updateCartQuantity(product);
	};

	return (
		<>
			{cart.map((product) => (
				<Grid
					container
					spacing={2}
					sx={{ mb: 1 }}
					key={product.slug + product.size}
				>
					<Grid item xs={3}>
						{/* llevar a la paguina del producto */}
						<NextLink href={`/product/${product.slug}`} passHref>
							<Link>
								<CardActionArea>
									<CardMedia
										image={`/products/${product.image}`}
										component="img"
										sx={{ borderRadius: "5px" }}
									/>
								</CardActionArea>
							</Link>
						</NextLink>
					</Grid>
					<Grid item xs={7}>
						<Box display="flex" flexDirection="column">
							<Typography variant="body1">{product.title}</Typography>
							<Typography variant="body1">
								Size: <strong>{product.size}</strong>
							</Typography>

							{editabled ? (
								<ItemCounter
									currentValue={product.quantity}
									maxValue={10}
									updatedQuantity={(newQty) =>
										onNewProductQuantityValue(product, newQty)
									}
								/>
							) : (
								<Typography variant="subtitle1">
									{product.quantity}{" "}
									{product.quantity > 1 ? "products" : "product"}
								</Typography>
							)}
						</Box>
					</Grid>
					<Grid
						item
						xs={2}
						display="flex"
						flexDirection="column"
						alignItems="center"
					>
						<Typography variant="subtitle1">{`$${product.price}`}</Typography>

						{editabled && (
							<Button
								variant="text"
								color="secondary"
								onClick={() => removedCartProduct(product)}
							>
								Remove
							</Button>
						)}
					</Grid>
				</Grid>
			))}
		</>
	);
};

export default CartList;
