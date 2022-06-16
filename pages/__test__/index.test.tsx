import { render, screen } from "@testing-library/react";
import HomePage from "..";

test("renders a header text", () => {
	const { container, getByText } = render(<HomePage />);
	expect(getByText("My Shop")).toBeInTheDocument();
	expect(container.firstChild).toMatchSnapshot(`
		<h1>My Shop</h1>
	`);
});
