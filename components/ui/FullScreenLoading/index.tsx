import { FunctionComponent } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface Props {}

const FullScreenLoading: FunctionComponent<Props> = ({}) => {
	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="center"
			height="calc(100vh - 200px)"
			flexDirection="column"
		>
			<CircularProgress thickness={4} />
		</Box>
	);
};

export default FullScreenLoading;
