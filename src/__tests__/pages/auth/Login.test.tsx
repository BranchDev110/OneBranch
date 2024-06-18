import Login from "@/pages/auth/Login";
import { MemoryRouter } from "react-router-dom";

import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useLoginMutation } from "@/services/auth";

import * as router from "react-router";

jest.mock("@/services/auth", () => ({
  useLoginMutation: jest.fn(),
}));

const mockNavigate = jest.fn();

describe("Login Component", () => {
  beforeEach(() => {
    jest.spyOn(router, "useNavigate").mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders the login form and submits correctly", async () => {
    const user = userEvent.setup();

    const mockLogin = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue({}),
    }));

    (useLoginMutation as jest.Mock).mockReturnValue([
      mockLogin,
      { isLoading: false },
    ]);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const pwdInput = screen.getByLabelText(/password/i);

    await user.click(emailInput);
    await user.keyboard("test@test.com");

    await user.click(pwdInput);
    await user.keyboard("testpassword");

    const button = screen.getByRole("button", { name: "Submit" });

    await user.click(button);

    expect(mockLogin).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenNthCalledWith(1, "/projects");
    });
  });
});
