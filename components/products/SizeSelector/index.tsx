import { FunctionComponent } from "react";

import { IValidSizes } from "interfaces/products";
import { Box, Button } from "@mui/material";

interface Props {
	selectedSize?: IValidSizes;
	sizes: IValidSizes[];
	onSelectedSize: (size: IValidSizes) => void;
}

const SizeSelector: FunctionComponent<Props> = ({
	sizes,
	selectedSize,
	onSelectedSize,
}) => {
	return (
		<Box>
			{sizes.map((size) => (
				<Button
					key={size}
					size="small"
					color={selectedSize === size ? "primary" : "info"}
					onClick={() => onSelectedSize(size)}
				>
					{size}
				</Button>
			))}
		</Box>
	);
};

export default SizeSelector;
