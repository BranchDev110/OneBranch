import SignUp from "@/pages/auth/Signup";
import { MemoryRouter } from "react-router-dom";
import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useSignUpMutation } from "@/services/auth";
import { useCreateUserMutation } from "@/services/users";

import * as router from "react-router";

jest.mock("@/services/auth", () => ({
  useSignUpMutation: jest.fn(),
}));

jest.mock("@/services/users", () => ({
  useCreateUserMutation: jest.fn(),
}));

const mockNavigate = jest.fn();

describe("Signup Component", () => {
  beforeEach(() => {
    jest.spyOn(router, "useNavigate").mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders the signup form and submits correctly", async () => {
    const user = userEvent.setup();
    const mockSignUp = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue({}),
    }));

    const mockCreate = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue({}),
    }));

    (useSignUpMutation as jest.Mock).mockReturnValue([
      mockSignUp,
      { isLoading: false },
    ]);

    (useCreateUserMutation as jest.Mock).mockReturnValue([
      mockCreate,
      { isLoading: false },
    ]);

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const body = {
      name: "gojo",
      email: "gojo@mailinator.com",
      password: "password",
      confirm: "password",
    };

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);

    const pwdInput = screen.getByLabelText(/password/i);
    const confirmPwdInput = screen.getByLabelText(/confirm/i);

    const button = screen.getByRole("button", { name: "Submit" });

    await user.click(nameInput);
    await user.keyboard(body.name);

    await user.click(emailInput);
    await user.keyboard(body.email);

    await user.click(pwdInput);
    await user.keyboard(body.password);

    await user.click(confirmPwdInput);
    await user.keyboard(body.confirm);

    await user.click(button);

    expect(mockSignUp).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenNthCalledWith(1, "/signin");
    });
  }, 10_000);
});
