import { FC, useContext, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { CartContext, UiContext } from "context";
import {
	AppBar,
	Badge,
	Box,
	Button,
	IconButton,
	Input,
	InputAdornment,
	Link,
	Toolbar,
	Typography,
} from "@mui/material";
import {
	ClearOutlined,
	SearchOutlined,
	ShoppingCartOutlined,
} from "@mui/icons-material";

const Navbar: FC = () => {
	const { asPath, push } = useRouter();
	const { toggleSideMenu } = useContext(UiContext);
	const { numbeOfItems } = useContext(CartContext);
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearchVisible, setIsSearchVisible] = useState(false);

	const onSearchTerm = () => {
		if (searchTerm.trim().length === 0) {
			return;
		}
		push(`/search/${searchTerm}`);
		setIsSearchVisible(false);
	};

	return (
		<AppBar>
			<Toolbar>
				<NextLink href="/" passHref>
					<Link display="flex" alignItems="center">
						<Typography variant="h6">My Shop | </Typography>
						<Typography sx={{ marginLeft: "0.5px" }}>Tesla</Typography>
					</Link>
				</NextLink>
				<Box flex={1} />
				<Box
					sx={{
						display: isSearchVisible
							? "none"
							: { xs: "none", sm: "block" },
					}}
					className="fadeIn"
				>
					<NextLink href="/category/man" passHref>
						<Link>
							<Button
								color={asPath === "/category/man" ? "primary" : "info"}
							>
								Man
							</Button>
						</Link>
					</NextLink>
					<NextLink href="/category/woman" passHref>
						<Link>
							<Button
								color={
									asPath === "/category/woman" ? "primary" : "info"
								}
							>
								Woman
							</Button>
						</Link>
					</NextLink>
					<NextLink href="/category/kids" passHref>
						<Link>
							<Button
								color={asPath === "/category/kids" ? "primary" : "info"}
							>
								kids
							</Button>
						</Link>
					</NextLink>
				</Box>
				<Box flex={1} />

				{isSearchVisible ? (
					<Input
						sx={{ display: { xs: "none", sm: "flex" } }}
						className="fadeIn"
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
								<IconButton onClick={() => setIsSearchVisible(false)}>
									<ClearOutlined />
								</IconButton>
							</InputAdornment>
						}
					/>
				) : (
					<IconButton
						onClick={() => setIsSearchVisible(true)}
						className="fadeIn"
						sx={{
							display: { xs: "none", sm: "flex" },
						}}
					>
						<SearchOutlined />
					</IconButton>
				)}

				<IconButton
					sx={{
						display: { xs: "flex", sm: "none" },
					}}
					onClick={toggleSideMenu}
				>
					<SearchOutlined />
				</IconButton>

				<NextLink href="/cart" passHref>
					<IconButton>
						<Badge
							badgeContent={numbeOfItems > 9 ? "+9" : numbeOfItems}
							color="secondary"
						>
							<ShoppingCartOutlined />
						</Badge>
					</IconButton>
				</NextLink>
				<Button onClick={toggleSideMenu} disabled={isSearchVisible}>
					Menu
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
