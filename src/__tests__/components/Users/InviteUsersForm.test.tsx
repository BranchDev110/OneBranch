import InviteUsersForm from "@/components/Users/InviteUsersForm";
import { useSendInvitationToUsersMutation } from "@/services/projects";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/services/projects", () => ({
  useSendInvitationToUsersMutation: jest.fn(),
}));

describe("InviteUsersForm component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly", async () => {
    const defaultProps = {
      projectId: "project-id",
      invitedBy: "admin",
      projectName: "Project Name",
      adminName: "Admin Name",
      taskId: "task-id",
      onSuccessCallback: jest.fn(),
    };
    const user = userEvent.setup();

    const mockSend = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue({}),
    }));

    (useSendInvitationToUsersMutation as jest.Mock).mockReturnValue([
      mockSend,
      { isLoading: false },
    ]);

    render(<InviteUsersForm {...defaultProps} />);

    expect(screen.getByText("Invite Users")).toBeInTheDocument();

    const emailInp1 = await screen.getByPlaceholderText(/Email 1/i);

    expect(emailInp1).toBeInTheDocument();

    await user.click(emailInp1);
    await user.keyboard("sam@email.com");

    const addBtn = screen.getByRole("button", { name: "Add email" });

    await user.click(addBtn);

    const emailInp = await screen.findByPlaceholderText(/Email 2/i);

    expect(emailInp).toBeInTheDocument();

    await user.click(emailInp);
    await user.keyboard("sam1@email.com");

    const button = screen.getByRole("button", { name: "Submit" });

    await user.click(button);

    expect(mockSend).toHaveBeenCalledTimes(1);
  }, 10_000);
});
