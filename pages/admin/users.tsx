import { useEffect, useState } from "react";

import { NextPage } from "next";
import { GetServerSideProps } from "next";
import AdminLayout from "components/layouts/AdminLayout";
import { PeopleOutline } from "@mui/icons-material";

import useSWR from "swr";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Grid, MenuItem, Select } from "@mui/material";
import { IUser } from "interfaces";
import FullScreenLoading from "components/ui/FullScreenLoading";
import { handleText } from "utils";
import { shopApi } from "api";
import { getSession } from "next-auth/react";

interface Props {
	currentUserId: string | null;
}

const UsersPage: NextPage<Props> = ({ currentUserId }) => {
	const { data, error } = useSWR<IUser[]>("/api/admin/users");
	const [users, setUsers] = useState<IUser[]>([]);

	useEffect(() => {
		if (data) {
			setUsers(data);
		}
	}, [data]);

	if (!data && !error) {
		return <FullScreenLoading />;
	}

	const onRoleUpdated = async (userId: string, newRole: string) => {
		const previusUsers = users.map((user) => ({ ...user }));
		const updateUsers = users.map((user) => ({
			...user,
			role: userId === user._id ? newRole : user.role,
		}));

		setUsers(updateUsers);

		try {
			await shopApi.put("/admin/users", { userId, role: newRole });
		} catch (error) {
			setUsers(previusUsers);
			console.log(error);
			alert("Cant be update the user rol");
		}
	};

	const columns: GridColDef[] = [
		{ field: "email", headerName: "Email", width: 250 },
		{ field: "name", headerName: "Name", width: 300 },
		{
			field: "role",
			headerName: "Rol",
			width: 300,
			renderCell: ({ row }: GridValueGetterParams) => {
				return (
					<Select
						value={row.role}
						label="Rol"
						sx={{ width: 300 }}
						onChange={({ target }) => onRoleUpdated(row.id, target.value)}
					>
						{["admin", "client", "super-user", "SEO"].map((rol) => (
							<MenuItem value={rol} key={rol}>
								{handleText.capitalize(rol)}
							</MenuItem>
						))}
					</Select>
				);
			},
		},
	];

	const rows = users
		.filter((user) => user._id !== currentUserId)
		.map((user) => ({
			id: user._id,
			email: user.email,
			name: user.name,
			role: user.role,
		}));

	return (
		<AdminLayout
			title="Users"
			subTitle="Handle users"
			icon={<PeopleOutline />}
		>
			<Grid container className="fadeIn">
				<Grid item xs={12} sx={{ height: 650, width: "100%" }}>
					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={10}
						rowsPerPageOptions={[10]}
					/>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session: any = await getSession({ req });

	return {
		props: {
			currentUserId: session.user._id,
		},
	};
};

export default UsersPage;
