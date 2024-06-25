import DeleteSprintModal from "@/components/Sprints/DeleteSprintModal";

import userEvent from "@testing-library/user-event";

import { screen, render } from "@testing-library/react";

import { useDeleteSprintMutation } from "@/services/sprints";

jest.mock("@/services/sprints", () => ({
  useDeleteSprintMutation: jest.fn(),
}));

const mockSprint = {
  id: "sprint-id",
  name: "Sprint One",
  createdBy: "user-id",
};

const mockUser = {
  id: "user-id",
  name: "Test User",
  role: "ADMIN",
  avatarUrl: "https://placehold.co/400",
  email: "user@example.com",
};

describe("DeleteSprintModal", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders correctly", async () => {
    const user = userEvent.setup();

    const mockDel = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue({}),
    }));

    (useDeleteSprintMutation as jest.Mock).mockReturnValue([
      mockDel,
      { isLoading: false },
    ]);

    render(<DeleteSprintModal sprint={mockSprint as any} user={mockUser} />);

    const button = screen.getByRole("button", {
      name: /Delete Sprint/i,
    });

    await user.click(button);

    const input = await screen.findByTestId("Type Title");

    await user.click(input);
    await user.keyboard(mockSprint.name);

    const submitBtn = await screen.findByRole("button", {
      name: /submit/i,
    });

    await user.click(submitBtn);

    expect(mockDel).toHaveBeenCalledTimes(1);
  });
});
