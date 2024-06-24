import ImportTaskToSprint from "@/components/Sprints/ImportTaskToSprint";
import { useImportTaskMutation } from "@/services/tasks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/services/tasks", () => ({
  useImportTaskMutation: jest.fn(),
}));

jest.mock("@/ui/select", () => ({
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectGroup: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, ...props }: any) => (
    <option {...props}>{children}</option>
  ),
  SelectValue: () => <></>,
  SelectLabel: () => <></>,
  SelectTrigger: () => <></>,
  Select: ({ children }: any) => (
    <select data-testid={"sel-tasks"}>{children}</select>
  ),
}));

describe("ImportTaskToSprint component", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockTasks = [
    {
      id: "1",
      name: "Task 1",
      description: "Description for Task 1",
      sprintId: "sprint1",
      projectId: "project1",
      assignees: ["user1", "user2"],
      fileUrls: ["https://example.com/file1"],
      createdBy: "user1",
      storyPoint: 3,
      dueDate: "2024-07-01",
      status: "TODO",
      order: 1,
      columnId: "column1",
    },
  ];

  test("render correctly", async () => {
    const user = userEvent.setup();

    const mockImport = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue({}),
    }));

    (useImportTaskMutation as jest.Mock).mockReturnValue([
      mockImport,
      { isLoading: false },
    ]);

    render(
      <ImportTaskToSprint sprintId="sprint1" order={0} tasks={mockTasks} />
    );

    const button = screen.getByRole("button", {
      name: /Import from project/i,
    });

    await user.click(button);

    const valTrigger = await screen.findByTestId("sel-tasks");

    await user.click(valTrigger);

    const opt = await screen.findByTestId(mockTasks[0].id);

    await user.click(opt);

    const submitBtn = screen.getByRole("button", {
      name: /submit/i,
    });

    await user.click(submitBtn);

    expect(mockImport).toHaveBeenCalled();
  });
});
