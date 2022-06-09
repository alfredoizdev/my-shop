import { useContext, useState } from "react";
import { NextPage } from "next";
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
import { useForm } from "react-hook-form";
import { validation } from "utils";
import { shopApi } from "api";
import { ErrorOutline } from "@mui/icons-material";
import { AuthContext } from "context/Auth/AuthContext";
import { useRouter } from "next/router";

type FormDate = {
	email: string;
	password: string;
};

type UserData = {
	token: string;
	user: {
		email: string;
		_id: string;
	};
};

const LoginPage: NextPage = ({}) => {
	const router = useRouter();
	const [showError, setShowError] = useState(false);
	const { loginUser } = useContext(AuthContext);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormDate>();

	const onLoginUser = async ({ email, password }: FormDate) => {
		setShowError(false);

		const isValidLogin = await loginUser(email, password);

		if (!isValidLogin) {
			setShowError(true);
			setTimeout(() => setShowError(false), 3000);
			return;
		}

		router.replace("/");
	};

	return (
		<AuthLayout title="Login">
			<form onSubmit={handleSubmit(onLoginUser)} noValidate>
				<Box sx={{ width: 350, padding: "10px 20px" }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h1" component="h1">
								Login
							</Typography>

							<Chip
								label="Crendential was introduce are not valid"
								color="error"
								icon={<ErrorOutline />}
								sx={{ display: showError ? "flex" : "none" }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								type="email"
								label="email"
								variant="filled"
								fullWidth
								{...register("email", {
									required: "The email field are required",
									validate: validation.isEmail,
								})}
								error={!!errors.email}
								helperText={errors.email?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="password"
								type="password"
								variant="filled"
								fullWidth
								{...register("password", {
									required: "The password field are required",
									minLength: { value: 6, message: "Min 6 characters" },
								})}
								error={!!errors.password}
								helperText={errors.password?.message}
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
								Login
							</Button>
						</Grid>
						<Grid item xs={12} display="flex" justifyContent="center">
							<NextLink href="/auth/register" passHref>
								<Link underline="always">I dont have an account</Link>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

export default LoginPage;
