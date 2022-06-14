import { FC, useContext, useState } from "react";
import { UiContext, AuthContext } from "context";
import {
	Box,
	Divider,
	Drawer,
	IconButton,
	Input,
	InputAdornment,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
} from "@mui/material";
import {
	AccountCircleOutlined,
	AdminPanelSettings,
	CategoryOutlined,
	ConfirmationNumberOutlined,
	DashboardOutlined,
	EscalatorWarningOutlined,
	FemaleOutlined,
	LoginOutlined,
	MaleOutlined,
	SearchOutlined,
	VpnKeyOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/router";

const SideMenu: FC = () => {
	const router = useRouter();
	const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
	const { isLoggedIn, user, logout } = useContext(AuthContext);
	const [searchTerm, setSearchTerm] = useState("");

	const onSearchTerm = () => {
		if (searchTerm.trim().length === 0) {
			return;
		}
		navigationTo(`/search/${searchTerm}`);
	};

	const navigationTo = (url: string) => {
		router.push(url);
		toggleSideMenu();
	};

	return (
		<Drawer
			open={isMenuOpen}
			onClose={toggleSideMenu}
			anchor="right"
			sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
		>
			<Box sx={{ width: 250, paddingTop: 5 }}>
				<List>
					<ListItem>
						<Input
							autoFocus
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							type="text"
							placeholder="Search..."
							onKeyPress={(e) =>
								e.key === "Enter" ? onSearchTerm() : null
							}
							endAdornment={
								<InputAdornment position="end">
									<IconButton onClick={onSearchTerm}>
										<SearchOutlined />
									</IconButton>
								</InputAdornment>
							}
						/>
					</ListItem>

					{isLoggedIn && (
						<>
							<ListItem button>
								<ListItemIcon>
									<AccountCircleOutlined />
								</ListItemIcon>
								<ListItemText primary={"Profile"} />
							</ListItem>

							<ListItem button>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText
									primary={"My Ordenes"}
									onClick={() => navigationTo("/orders/history")}
								/>
							</ListItem>
						</>
					)}

					<ListItem button sx={{ display: { xs: "", sm: "none" } }}>
						<ListItemIcon>
							<MaleOutlined />
						</ListItemIcon>
						<ListItemText
							primary={"Man"}
							onClick={() => navigationTo("/category/man")}
						/>
					</ListItem>

					<ListItem button sx={{ display: { xs: "", sm: "none" } }}>
						<ListItemIcon>
							<FemaleOutlined />
						</ListItemIcon>
						<ListItemText
							primary={"Women"}
							onClick={() => navigationTo("/category/woman")}
						/>
					</ListItem>

					<ListItem button sx={{ display: { xs: "", sm: "none" } }}>
						<ListItemIcon>
							<EscalatorWarningOutlined />
						</ListItemIcon>
						<ListItemText
							primary={"Kids"}
							onClick={() => navigationTo("/category/kids")}
						/>
					</ListItem>

					{!isLoggedIn ? (
						<ListItem button>
							<ListItemIcon>
								<VpnKeyOutlined />
							</ListItemIcon>
							<ListItemText
								primary={"Login"}
								onClick={() =>
									navigationTo(`/auth/login?p=${router.asPath}`)
								}
							/>
						</ListItem>
					) : (
						<ListItem button>
							<ListItemIcon>
								<LoginOutlined />
							</ListItemIcon>
							<ListItemText primary={"Logout"} onClick={logout} />
						</ListItem>
					)}

					{/* Admin */}

					{user?.role === "admin" && (
						<>
							<Divider />
							<ListSubheader>Admin Panel</ListSubheader>
							<ListItem button>
								<ListItemIcon>
									<DashboardOutlined />
								</ListItemIcon>
								<ListItemText
									primary={"Dashboard"}
									onClick={() => navigationTo(`/admin/`)}
								/>
							</ListItem>

							<ListItem button>
								<ListItemIcon>
									<CategoryOutlined />
								</ListItemIcon>
								<ListItemText primary={"Product"} />
							</ListItem>
							<ListItem button>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={"Ordens"} />
							</ListItem>

							<ListItem button>
								<ListItemIcon>
									<AdminPanelSettings />
								</ListItemIcon>
								<ListItemText primary={"Users"} />
							</ListItem>
						</>
					)}
				</List>
			</Box>
		</Drawer>
	);
};

export default SideMenu;
