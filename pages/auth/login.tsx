import { useEffect, useState } from "react";
import { NextPage } from "next";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import {
	getSession,
	signIn,
	getProviders,
	ClientSafeProvider,
} from "next-auth/react";
import AuthLayout from "components/layouts/AuthLayout";
import {
	Box,
	Button,
	Grid,
	TextField,
	Typography,
	Link,
	Chip,
	Divider,
} from "@mui/material";
import { LiteralUnion, useForm } from "react-hook-form";
import { validation } from "utils";
import { ErrorOutline } from "@mui/icons-material";
//import { AuthContext } from "context/Auth/AuthContext";
import { useRouter } from "next/router";
import { BuiltInProviderType } from "next-auth/providers";

type FormDate = {
	email: string;
	password: string;
};

const LoginPage: NextPage = ({}) => {
	const router = useRouter();
	const [showError, setShowError] = useState(false);
	const [providers, setProviders] = useState<Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null>(null);
	// const { loginUser } = useContext(AuthContext);

	useEffect(() => {
		const gettingProvider = async () => {
			const prov = await getProviders();
			setProviders(prov);
		};

		gettingProvider();
	}, []);

	console.log(providers);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormDate>();

	const onLoginUser = async ({ email, password }: FormDate) => {
		setShowError(false);

		await signIn("credentials", {
			email,
			password,
		});

		// const isValidLogin = await loginUser(email, password);

		// if (!isValidLogin) {
		// 	setShowError(true);
		// 	setTimeout(() => setShowError(false), 3000);
		// 	return;
		// }
		// const destination = router.query.p?.toString() || "/";
		// router.replace(destination);
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
							<NextLink
								href={
									router.query.p
										? `/auth/register?p=${router.query.p?.toString()}`
										: `/auth/register`
								}
								passHref
							>
								<Link underline="always">I dont have an account</Link>
							</NextLink>
						</Grid>
						<Grid
							item
							xs={12}
							display="flex"
							justifyContent="end"
							flexDirection="column"
						>
							<Divider sx={{ width: "100%", mb: 2 }} />
							{Object.values(providers as any)
								.filter((p: any) => p.id !== "credentials")
								.map((provider: any) => (
									<Button
										key={provider.id}
										variant="outlined"
										fullWidth
										color="primary"
										sx={{ mb: 1 }}
										onClick={() => signIn(provider.id)}
									>
										{provider.name}
									</Button>
								))}
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const session = await getSession({ req });

	const { p = "/" } = query;

	if (session) {
		return {
			redirect: {
				destination: p.toString(),
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
};

export default LoginPage;
