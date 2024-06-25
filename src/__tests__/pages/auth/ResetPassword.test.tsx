import ResetPassword from "@/pages/auth/ResetPassword";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useResetUserPasswordMutation } from "@/services/auth";

jest.mock("@/services/auth", () => ({
  useResetUserPasswordMutation: jest.fn(),
}));

describe("ResetPassword Component", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders the ResetPassword form and submits correctly", async () => {
    const user = userEvent.setup();

    const mockReset = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue({}),
    }));

    (useResetUserPasswordMutation as jest.Mock).mockReturnValue([
      mockReset,
      { isLoading: false },
    ]);

    const body = {
      password: "password",
      confirm: "password",
    };

    render(
      <MemoryRouter initialEntries={[`/reset?oobCode=fakeoobCode`]}>
        <Routes>
          <Route path="/reset" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

    const pwdInput = screen.getByLabelText(/password/i);
    const confirmPwdInput = screen.getByLabelText(/confirm/i);
    const button = screen.getByRole("button", { name: "Submit" });

    await user.click(pwdInput);
    await user.keyboard(body.password);

    await user.click(confirmPwdInput);
    await user.keyboard(body.confirm);

    await user.click(button);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
