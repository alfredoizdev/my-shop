import { useContext, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import NextLink from "next/link";
import AuthLayout from "components/layouts/AuthLayout";
import {
	Box,
	Button,
	Grid,
	TextField,
	Typography,
	Link,
	Chip,
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { validation } from "utils";
import { shopApi } from "api";
import { AuthContext } from "context";

type FormDate = {
	email: string;
	name: string;
	password: string;
};

const RegisterPage: NextPage = () => {
	const router = useRouter();
	const { registerUser } = useContext(AuthContext);
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormDate>();

	const onRegisterForm = async ({ email, password, name }: FormDate) => {
		setShowError(false);
		const response = await registerUser(name, email, password);
		const { hasError, message } = response;

		if (hasError) {
			setShowError(true);
			setErrorMessage(message!);
			setTimeout(() => setShowError(false), 3000);
			return;
		}
		const destination = router.query.p?.toString() || "/";
		router.replace(destination);
	};

	return (
		<AuthLayout title="register account">
			<form onSubmit={handleSubmit(onRegisterForm)} noValidate>
				<Box sx={{ width: 350, padding: "10px 20px" }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h1" component="h1">
								Create Account
							</Typography>
							<Chip
								label={errorMessage}
								color="error"
								icon={<ErrorOutline />}
								sx={{ display: showError ? "flex" : "none" }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								type="text"
								label="Name"
								variant="filled"
								fullWidth
								{...register("name", {
									required: "Field name are required",
									minLength: {
										value: 2,
										message: "The name min 2 characters",
									},
								})}
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="email"
								type="email"
								variant="filled"
								fullWidth
								{...register("email", {
									required: "Email email are required",
									validate: validation.isEmail,
								})}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="password"
								type="password"
								variant="filled"
								fullWidth
								{...register("password", {
									required: "Password password are required",
									minLength: {
										value: 6,
										message: "The password min 6 characters",
									},
								})}
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								type="submit"
								color="secondary"
								className="circular-btn"
								size="large"
								fullWidth
							>
								Create account
							</Button>
						</Grid>
						<Grid item xs={12} display="flex" justifyContent="center">
							<NextLink
								href={
									router.query.p
										? `/auth/login?p=${router.query.p?.toString()}`
										: `/auth/login`
								}
								passHref
							>
								<Link underline="always">I have account</Link>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

export default RegisterPage;
