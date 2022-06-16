import { render, screen } from "@testing-library/react";
import HomePage from "pages";

describe("Home page", () => {
	it("sould render the h1 My shop", () => {
		const { getByText } = render(<HomePage />);
		expect(getByText("My Shop")).toBeInTheDocument();
	});
});
