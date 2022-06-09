import { FunctionComponent, useContext } from "react";
import { Grid, Typography } from "@mui/material";
import { CartContext } from "context/cart/CartContext";
import { utilCurrency } from "utils";

interface Props {}

const OrderSummary: FunctionComponent<Props> = ({}) => {
	const { numberOfItems, subTotal, total, tax } = useContext(CartContext);
	return (
		<Grid container>
			<Grid item xs={6}>
				<Typography>
					Number of {numberOfItems > 1 ? "products" : "product"}{" "}
				</Typography>
			</Grid>
			<Grid item xs={6} display="flex" justifyContent="flex-end">
				<Typography>{numberOfItems}</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography>Sub Total</Typography>
			</Grid>
			<Grid item xs={6} display="flex" justifyContent="flex-end">
				<Typography>{utilCurrency.format(subTotal)}</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography>
					Taxes ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 || 7}%)
				</Typography>
			</Grid>
			<Grid item xs={6} display="flex" justifyContent="flex-end">
				<Typography>{utilCurrency.format(tax)}</Typography>
			</Grid>
			<Grid item xs={6} sx={{ mt: 2 }}>
				<Typography variant="subtitle1">Total:</Typography>
			</Grid>
			<Grid
				item
				xs={6}
				display="flex"
				justifyContent="flex-end"
				sx={{ mt: 2 }}
			>
				<Typography variant="subtitle1">
					{utilCurrency.format(total)}
				</Typography>
			</Grid>
		</Grid>
	);
};

export default OrderSummary;
