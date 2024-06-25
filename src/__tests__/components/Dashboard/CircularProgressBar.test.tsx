import CircularProgressBar from "@/components/Dashboard/CircularProgressBar";
import { render, screen } from "@testing-library/react";

describe(" CircularProgressBar Component", () => {
  test("renders correctly", () => {
    render(<CircularProgressBar total={100} value={70} />);

    expect(screen.getByText("70%")).toBeInTheDocument();
  });
});
