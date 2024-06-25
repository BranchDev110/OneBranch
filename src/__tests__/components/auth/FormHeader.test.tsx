import FormHeader from "@/components/auth/FormHeader";
import { render, screen } from "@testing-library/react";

describe("FormHeader Component", () => {
  test("renders logo and text correctly", () => {
    render(<FormHeader />);

    const logo = screen.getByAltText("logo");
    expect(logo).toBeInTheDocument();

    expect(screen.getByText("OneBranch")).toBeInTheDocument();
  });
});
