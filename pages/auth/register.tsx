import { NextPage } from "next";
import NextLink from "next/link";
import AuthLayout from "components/layouts/AuthLayout";
import { Box, Button, Grid, TextField, Typography, Link } from "@mui/material";

const RegisterPage: NextPage = () => {
	return (
		<AuthLayout title="register account">
			<Box sx={{ width: 350, padding: "10px 20px" }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h1" component="h1">
							Create Account
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField label="Name" variant="filled" fullWidth />
					</Grid>
					<Grid item xs={12}>
						<TextField label="Lastname" variant="filled" fullWidth />
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="email"
							type="email"
							variant="filled"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="password"
							type="password"
							variant="filled"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<Button
							color="secondary"
							className="circular-btn"
							size="large"
							fullWidth
						>
							Create account
						</Button>
					</Grid>
					<Grid item xs={12} display="flex" justifyContent="center">
						<NextLink href="/auth/login" passHref>
							<Link underline="always">I have account</Link>
						</NextLink>
					</Grid>
				</Grid>
			</Box>
		</AuthLayout>
	);
};

export default RegisterPage;
