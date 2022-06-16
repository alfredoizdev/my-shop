import { render, screen } from "@testing-library/react";
import HomePage from "pages";

describe("Home page", () => {
	it("sould render the h1 My shop", () => {
		const { container, getByText } = render(<HomePage />);
		expect(getByText("My Shop")).toBeInTheDocument();
		expect(container.firstChild).toMatchSnapshot(`
			<h1>My Shop</h1>
		`);
	});
});
