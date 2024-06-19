import ForgotPassword from "@/pages/auth/ForgotPassword";
import { MemoryRouter } from "react-router-dom";

import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useSendForgotPassordEmailMutation } from "@/services/auth";

jest.mock("@/services/auth", () => ({
  useSendForgotPassordEmailMutation: jest.fn(),
}));

describe("Forgot Password component", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders the Forgot Password form and submits correctly ", async () => {
    const user = userEvent.setup();

    const mockSend = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue({}),
    }));

    (useSendForgotPassordEmailMutation as jest.Mock).mockReturnValue([
      mockSend,
      { isLoading: false },
    ]);

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
    const button = screen.getByRole("button", { name: "Submit" });

    const emailInput = screen.getByLabelText(/email/i);
    await user.click(emailInput);

    await user.keyboard("sample@gmail.com");
    await user.click(button);

    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
