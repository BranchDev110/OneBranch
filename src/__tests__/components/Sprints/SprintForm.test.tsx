import SprintForm from "@/components/Sprints/SprintForm";
import userEvent from "@testing-library/user-event";

import { screen, render } from "@testing-library/react";

describe("SprintForm ", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("render correctly", async () => {
    const user = userEvent.setup();

    const submit = jest.fn();

    render(
      <SprintForm
        userId="user-id"
        projectList={[]}
        onSubmit={submit}
        projectId="project-id"
        submitRes={{ isLoading: false } as any}
      />
    );

    const nameInput = screen.getByLabelText(/Sprint Name/i);
    const descInput = screen.getByLabelText(/Sprint Description/i);
    const button = screen.getByRole("button", { name: "Submit" });

    await user.click(nameInput);
    await user.keyboard("sprint name");

    await user.click(descInput);
    await user.keyboard("sprint desc");

    await user.click(button);

    expect(submit).toHaveBeenCalledTimes(1);
  });
});
