import { useContext, useEffect } from "react";
import { NextPage } from "next";
import { UiContext, ShippingContext } from "context";
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
	formValue: {
		firstname: string;
		lastname: string;
		address: string;
		address2: string;
		zip: string;
		city: string;
		country: string;
		phone: string;
	};
};

const Address: NextPage<Props> = ({}) => {
	const { countries } = useContext(UiContext);
	const { updateAddress, shippingAddress } = useContext(ShippingContext);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormDate>({
		defaultValues: {
			formValue: {
				firstname: "",
				lastname: "",
				address: "",
				address2: "",
				zip: "",
				city: "",
				country: "",
				phone: "",
			},
		},
	});

	useEffect(() => {
		if (shippingAddress) {
			setValue("formValue", {
				firstname: shippingAddress?.firstname,
				lastname: shippingAddress?.lastname,
				address: shippingAddress?.address,
				address2: shippingAddress?.address2,
				city: shippingAddress?.city,
				phone: shippingAddress?.phone,
				country: shippingAddress?.country,
				zip: shippingAddress?.zip,
			});
		}
	}, [shippingAddress, setValue]);

	const onAddressChange = ({ formValue }: FormDate) => {
		updateAddress(formValue);
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
							{...register("formValue.firstname", {
								required: "The field is required",
								minLength: {
									value: 3,
									message: "Name must has more them 3 characters",
								},
							})}
							error={!!errors.formValue?.firstname}
							helperText={errors.formValue?.firstname?.message || ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Last Name"
							type="text"
							variant="filled"
							fullWidth
							{...register("formValue.lastname", {
								required: "The field is required",
								minLength: {
									value: 3,
									message: "Last Name must has more them 3 characters",
								},
							})}
							error={!!errors.formValue?.lastname}
							helperText={errors.formValue?.lastname?.message || ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Address"
							variant="filled"
							fullWidth
							{...register("formValue.address", {
								required: "The field is required",
							})}
							error={!!errors.formValue?.address}
							helperText={errors.formValue?.address?.message || ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Address 2 (optional)"
							variant="filled"
							fullWidth
							{...register("formValue.address2")}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth {...register("formValue.country")}>
							{countries.length > 0 && (
								<>
									<TextField
										select
										variant="filled"
										label="country"
										defaultValue={
											shippingAddress?.country || countries[0].code
										}
										{...register("formValue.country", {
											required: "This field is required",
										})}
										error={!!errors.formValue?.country}
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
							{...register("formValue.city", {
								required: "The field is required",
							})}
							error={!!errors.formValue?.city}
							helperText={errors.formValue?.city?.message || ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Zipcode"
							variant="filled"
							fullWidth
							{...register("formValue.zip", {
								required: "The field is required",
							})}
							error={!!errors.formValue?.zip}
							helperText={errors.formValue?.zip?.message || ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Phone Number"
							variant="filled"
							fullWidth
							{...register("formValue.phone", {
								required: "The field is required",
							})}
							error={!!errors.formValue?.phone}
							helperText={errors.formValue?.phone?.message || ""}
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
