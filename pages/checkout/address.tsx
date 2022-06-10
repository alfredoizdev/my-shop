import { useContext } from "react";
import { NextPage } from "next";
import { CartContext, UiContext } from "context";
import ShopLayout from "components/layouts/ShopLayout";
import {
	Box,
	Button,
	FormControl,
	Grid,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

interface Props {}

type FormDate = {
	firstname: string;
	lastname: string;
	address: string;
	address2: string;
	zip: string;
	city: string;
	country: string;
	phone: string;
};

const getAddressFromCookies = (): FormDate => {
	return {
		firstname: Cookies.get("firtsname") || "",
		lastname: Cookies.get("lastname") || "",
		address: Cookies.get("address") || "",
		address2: Cookies.get("address2") || "",
		zip: Cookies.get("zip") || "",
		city: Cookies.get("city") || "",
		country: Cookies.get("country") || "",
		phone: Cookies.get("phone") || "",
	};
};

const Address: NextPage<Props> = ({}) => {
	const { countries } = useContext(UiContext);
	const { updateAddress } = useContext(CartContext);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormDate>({
		defaultValues: getAddressFromCookies(),
	});

	const onAddressChange = (data: FormDate) => {
		updateAddress(data);
		router.push("/checkout/summary");
	};

	return (
		<form onSubmit={handleSubmit(onAddressChange)}>
			<ShopLayout
				title="Address"
				pageDescription="Confirm address of the shiping"
			>
				<Typography variant="h1" component="h1">
					Address
				</Typography>
				<Grid container spacing={2} sx={{ mt: 2 }}>
					<Grid item xs={12} sm={6}>
						<TextField
							label="First Name"
							type="text"
							variant="filled"
							fullWidth
							{...register("firstname", {
								required: "The field is required",
								minLength: {
									value: 3,
									message: "Name must has more them 3 characters",
								},
							})}
							error={!!errors.firstname}
							helperText={errors.firstname?.message || ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Last Name"
							type="text"
							variant="filled"
							fullWidth
							{...register("lastname", {
								required: "The field is required",
								minLength: {
									value: 3,
									message: "Last Name must has more them 3 characters",
								},
							})}
							error={!!errors.lastname}
							helperText={errors.lastname?.message || ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Address"
							variant="filled"
							fullWidth
							{...register("address", {
								required: "The field is required",
							})}
							error={!!errors.address}
							helperText={errors.address?.message || ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Address 2 (optional)"
							variant="filled"
							fullWidth
							{...register("address2")}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth {...register("country")}>
							{countries.length > 0 && (
								<>
									<TextField
										select
										variant="filled"
										label="country"
										defaultValue={
											Cookies.get("country") || countries[0].code
										}
										{...register("country", {
											required: "This field is required",
										})}
										error={!!errors.country}
									>
										{countries.map((country) => (
											<MenuItem
												key={country.code}
												value={country.code}
											>
												{country?.name}
											</MenuItem>
										))}
									</TextField>
								</>
							)}
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="City"
							variant="filled"
							fullWidth
							{...register("city", {
								required: "The field is required",
							})}
							error={!!errors.city}
							helperText={errors.city?.message || ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Zipcode"
							variant="filled"
							fullWidth
							{...register("zip", {
								required: "The field is required",
							})}
							error={!!errors.zip}
							helperText={errors.zip?.message || ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Phone Number"
							variant="filled"
							fullWidth
							{...register("phone", {
								required: "The field is required",
							})}
							error={!!errors.phone}
							helperText={errors.phone?.message || ""}
						/>
					</Grid>
				</Grid>
				<Box sx={{ mt: 5 }} display="flex" justifyContent="center">
					<Button
						type="submit"
						color="secondary"
						className="circular-btn"
						size="large"
					>
						Save Address
					</Button>
				</Box>
			</ShopLayout>
		</form>
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
