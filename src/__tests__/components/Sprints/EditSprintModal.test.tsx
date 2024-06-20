import EditSprintModal from "@/components/Sprints/EditSprintModal";

import userEvent from "@testing-library/user-event";

import { screen, render } from "@testing-library/react";

import { useUpdateSprintMutation } from "@/services/sprints";

jest.mock("@/services/auth", () => ({
  useUpdateSprintMutation: jest.fn(),
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

describe("EditSprintModal", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should first", async () => {
    const user = userEvent.setup();

    const mockUpdate = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue({}),
    }));

    (useUpdateSprintMutation as jest.Mock).mockReturnValue([
      mockUpdate,
      { isLoading: false },
    ]);

    render(
      <EditSprintModal
        sprint={mockSprint as any}
        user={mockUser as any}
        projects={[]}
      />
    );

    const button = screen.getByRole("button", {
      name: /Edit Sprint/i,
    });

    await user.click(button);

    const submitBtn = await screen.findByRole("button", {
      name: /submit/i,
    });

    await user.click(submitBtn);

    expect(mockUpdate).toHaveBeenCalled();
  });
});
