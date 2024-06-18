import CompassGuage from "@/components/Dashboard/CompassGuage";
import { render, screen } from "@testing-library/react";

describe("CompassGuage", () => {
  test("renders correctly", () => {
    const props = {
      label: "Project Progress",
      amount: 75,
      total: 100,
      completed: 50,
      delayed: 30,
      ongoing: 20,
    };
    render(<CompassGuage {...props} />);

    expect(screen.getByText(props.label)).toBeInTheDocument();
    expect(screen.getByText(`${props.amount}%`)).toBeInTheDocument();

    expect(screen.getByText(`${props.total}`)).toBeInTheDocument();
    expect(screen.getByText(`${props.completed}`)).toBeInTheDocument();
    expect(screen.getByText(`${props.delayed}`)).toBeInTheDocument();
    expect(screen.getByText(`${props.ongoing}`)).toBeInTheDocument();
  });
});
