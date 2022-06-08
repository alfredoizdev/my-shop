import { NextPage } from "next";
import NextLink from "next/link";
import AuthLayout from "components/layouts/AuthLayout";
import { Box, Button, Grid, TextField, Typography, Link } from "@mui/material";

const LoginPage: NextPage = ({}) => {
	return (
		<AuthLayout title="Login">
			<Box sx={{ width: 350, padding: "10px 20px" }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h1" component="h1">
							Login
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField label="email" variant="filled" fullWidth />
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
		</AuthLayout>
	);
};

export default LoginPage;
