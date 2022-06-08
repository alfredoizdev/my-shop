import { FC } from "react";
import { Slide } from "react-slideshow-image";
import styles from "./ProductSlideshow.module.css";

interface ProductSlideshowProps {
	images: string[];
}

const ProductSlideshow: FC<ProductSlideshowProps> = ({ images }) => {
	return (
		<Slide easing="ease" duration={7000} indicators>
			{images.map((img) => {
				const url = `/products/${img}`;
				return (
					<div className={styles.eachSlide} key={img}>
						<div
							style={{
								backgroundImage: `url(${url})`,
								backgroundSize: "cover",
							}}
						></div>
					</div>
				);
			})}
		</Slide>
	);
};

export default ProductSlideshow;
