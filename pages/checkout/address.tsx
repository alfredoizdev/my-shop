import { NextPage, GetServerSideProps } from "next";
import ShopLayout from "components/layouts/ShopLayout";
import {
	Box,
	Button,
	FormControl,
	Grid,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { jwt } from "utils";

interface Props {}

const Address: NextPage<Props> = ({}) => {
	return (
		<ShopLayout
			title="Address"
			pageDescription="Confirm address of the shiping"
		>
			<Typography variant="h1" component="h1">
				Address
			</Typography>
			<Grid container spacing={2} sx={{ mt: 2 }}>
				<Grid item xs={12} sm={6}>
					<TextField label="Name" variant="filled" fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label="Lastname" variant="filled" fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label="Address" variant="filled" fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						label="Address 2 (optional)"
						variant="filled"
						fullWidth
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl fullWidth>
						<Select variant="filled" label="country" value={1}>
							<MenuItem value={1}>Cuba</MenuItem>
							<MenuItem value={2}>Mexico</MenuItem>
							<MenuItem value={3}>Hondura</MenuItem>
							<MenuItem value={4}>Usa</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label="City" variant="filled" fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label="Zipcode" variant="filled" fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label="Phone Number" variant="filled" fullWidth />
				</Grid>
			</Grid>
			<Box sx={{ mt: 5 }} display="flex" justifyContent="center">
				<Button color="secondary" className="circular-btn" size="large">
					Save Address
				</Button>
			</Box>
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
// 	const { token = "" } = req.cookies;
// 	let isValidToken = false;

// 	try {
// 		await jwt.isValidToken(token);
// 		isValidToken = true;
// 	} catch (error) {
// 		isValidToken = false;
// 	}

// 	if (!isValidToken) {
// 		return {
// 			redirect: {
// 				destination: "/auth/login?p=/checkout/address",
// 				permanent: false,
// 			},
// 		};
// 	}
// 	return {
// 		props: {},
// 	};
// };

export default Address;
