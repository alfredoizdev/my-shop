import { FunctionComponent, useContext } from "react";
import { Grid, Typography } from "@mui/material";
import { CartContext } from "context/cart/CartContext";
import { utilCurrency } from "utils";
import { IOrder } from "interfaces";

interface Props {
	ordersSummary?: {
		numberOfItems: number;
		subTotal: number;
		total: number;
		tax: number;
	};
}

const OrderSummary: FunctionComponent<Props> = ({ ordersSummary }) => {
	const { numberOfItems, subTotal, total, tax } = useContext(CartContext);

	const sumaryValues = ordersSummary
		? ordersSummary
		: { numberOfItems, subTotal, total, tax };

	return (
		<Grid container className="fadeIn">
			<Grid item xs={6}>
				<Typography>
					Number of{" "}
					{sumaryValues.numberOfItems > 1 ? "products" : "product"}{" "}
				</Typography>
			</Grid>
			<Grid item xs={6} display="flex" justifyContent="flex-end">
				<Typography>{sumaryValues.numberOfItems}</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography>Sub Total</Typography>
			</Grid>
			<Grid item xs={6} display="flex" justifyContent="flex-end">
				<Typography>
					{utilCurrency.format(sumaryValues.subTotal)}
				</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography>
					Taxes ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 || 7}%)
				</Typography>
			</Grid>
			<Grid item xs={6} display="flex" justifyContent="flex-end">
				<Typography>{utilCurrency.format(sumaryValues.tax)}</Typography>
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
					{utilCurrency.format(sumaryValues.total)}
				</Typography>
			</Grid>
		</Grid>
	);
};

export default OrderSummary;
