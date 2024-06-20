import CreateProject from "@/pages/dashboard/projects/CreateProject";
import userEvent from "@testing-library/user-event";

import { MemoryRouter } from "react-router-dom";
import { screen, render } from "@testing-library/react";
import * as router from "react-router";

import { useCreateProjectMutation } from "@/services/projects";
import { ROLES } from "@/constants/roles";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

const mockNavigate = jest.fn();

jest.mock("@/services/projects", () => ({
  useCreateProjectMutation: jest.fn(),
}));

jest.mock("@/hooks/useLoggedInUser", () => ({
  useLoggedInUser: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  uploadBytes: jest.fn().mockResolvedValue({ ref: "" }),
  getDownloadURL: jest.fn().mockResolvedValue({ ref: "/url" }),
  ref: jest.fn(),
}));

jest.mock("@/firebase/BaseConfig", () => ({
  storage: jest.fn(),
}));

describe("CreateProject", () => {
  beforeEach(() => {
    jest.spyOn(router, "useNavigate").mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should create project successfully", async () => {
    const user = userEvent.setup();

    const mockCreateProject = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue({}),
    }));

    (useLoggedInUser as jest.Mock).mockReturnValue({
      user: {
        name: "name",
        id: "id",
        role: ROLES.USER,
        avatarUrl: "https://placehold.co/400",
        email: "fake@email.com",
      },
      isLoading: false,
      isError: false,
      error: undefined,
      isSuccess: true,
      refetch: jest.fn(),
    });

    (useCreateProjectMutation as jest.Mock).mockReturnValue([
      mockCreateProject,
      { isLoading: false },
    ]);

    const body = {
      name: "project name",
      description: "project desc",
      columns: ["A"],
    };

    render(
      <MemoryRouter>
        <CreateProject />
      </MemoryRouter>
    );

    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const nameInput = screen.getByLabelText(/Project Name/i);
    const descInput = screen.getByLabelText(/Project Description/i);
    const imgInput = screen.getByTestId("upload-image");
    const addBtn = screen.getByRole("button", { name: "Add column" });

    await user.click(nameInput);
    await user.keyboard(body.name);

    await user.upload(imgInput, file);

    await user.click(addBtn);

    const colInput = await screen.findByTestId(/Column 1/i);
    await user.click(colInput);
    await user.keyboard(body.columns[0]);

    await user.click(descInput);
    await user.keyboard(body.description);

    const button = screen.getByRole("button", { name: "Submit" });

    await user.click(button);

    expect(mockCreateProject).toHaveBeenCalledTimes(1);
  });
});
