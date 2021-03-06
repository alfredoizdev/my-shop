import { FC, useMemo, useState } from "react";
import NextLink from "next/link";
import {
	Box,
	Card,
	CardActionArea,
	CardMedia,
	Chip,
	Grid,
	Link,
	Typography,
} from "@mui/material";
import { IProduct } from "interfaces/products";

interface ProducCardProps {
	product: IProduct;
}

const ProductCart: FC<ProducCardProps> = ({ product }) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isImageLoading, seIsImagenLoading] = useState(false);
	const productImage = useMemo(() => {
		return isHovered ? product.images[1] : product.images[0];
	}, [isHovered, product.images]);

	return (
		<Grid
			item
			xs={6}
			sm={4}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Card>
				<NextLink
					href={`/product/${product.slug}`}
					passHref
					prefetch={false}
				>
					<Link>
						<CardActionArea>
							{product.inStock === 0 && (
								<Chip
									color="primary"
									label="out stock"
									sx={{
										position: "absolute",
										zIndex: 99,
										top: "10px",
										left: "10px",
									}}
								/>
							)}
							<CardMedia
								className="fadeIn"
								component="img"
								image={productImage}
								alt="Product cart title"
								onLoad={() => seIsImagenLoading(true)}
							/>
						</CardActionArea>
					</Link>
				</NextLink>
			</Card>

			<Box
				sx={{ mt: 1, display: isImageLoading ? "block" : "none" }}
				className="fadeIn"
			>
				<Typography fontWeight={700}>{product.title}</Typography>
				<Typography fontWeight={500}>{`$${product.price}`}</Typography>
			</Box>
		</Grid>
	);
};

export default ProductCart;
