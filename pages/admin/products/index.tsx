import NextLink from "next/link";
import { CategoryOutlined } from "@mui/icons-material";
import { CardMedia, Grid, Link } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import AdminLayout from "components/layouts/AdminLayout";
import FullScreenLoading from "components/ui/FullScreenLoading";
import { IProduct } from "interfaces";
import { NextPage } from "next";
import useSWR from "swr";

const columns: GridColDef[] = [
	{
		field: "img",
		headerName: "Thumbnail",
		renderCell: ({ row }: GridValueGetterParams) => {
			return (
				<a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
					<CardMedia
						alt={row.title}
						component="img"
						className="fadeIn"
						image={`/products/${row.img}`}
					/>
				</a>
			);
		},
	},
	{
		field: "title",
		headerName: "Title",
		width: 300,
		renderCell: ({ row }: GridValueGetterParams) => {
			return (
				<NextLink href={`/admin/products/${row.slug}`} passHref>
					<Link underline="always" variant="button">
						{row.title}
					</Link>
				</NextLink>
			);
		},
	},
	{ field: "gender", headerName: "Gender", width: 150 },
	{ field: "type", headerName: "Type", width: 150 },
	{ field: "inStock", headerName: "Stock", width: 150 },
	{ field: "price", headerName: "Price", width: 150 },
	{ field: "sizes", headerName: "Sizes", width: 250 },
];

interface Props {}

const ProductsPage: NextPage<Props> = () => {
	const { data, error } = useSWR<IProduct[]>("/api/admin/products");

	if (!data && !error) {
		return <FullScreenLoading />;
	}

	const rows = data!.map((product) => ({
		id: product._id,
		img: product.images[0],
		title: product.title,
		gender: product.gender,
		type: product.type,
		inStock: product.inStock,
		price: product.price,
		sizes: product.sizes.join(", "),
		slug: product.slug,
	}));

	return (
		<AdminLayout
			title={`Products (${data?.length})`}
			subTitle="Handle Products"
			icon={<CategoryOutlined />}
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

export default ProductsPage;
