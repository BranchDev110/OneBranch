import AllProjects from "@/pages/dashboard/projects/AllProjects";

import { MemoryRouter } from "react-router-dom";
import { screen, render, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";

import { useGetUsersProjectsQuery } from "@/services/projects";
import * as router from "react-router";

const mockNavigate = jest.fn();

jest.mock("@/services/projects", () => ({
  useSignUpMutation: jest.fn(),
}));

const generateFakeProjects = (numProjects: number) => {
  const fakeProjects: any[] = [];

  for (let i = 1; i <= numProjects; i++) {
    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    );

    const fakeProject = {
      id: `project-${i}`,
      name: `Project ${i}`,
      description: `Description for Project ${i}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      admin: `id`,
      members: [],
      currentPoints: Math.floor(Math.random() * 100),
      totalPoints: Math.floor(Math.random() * 200) + 100,
      columns: [`Column 1`, `Column 2`, `Column 3`],
      activeSprintId: `sprint-${i}`,
      imageUrl: `https://placehold.co/400x200`,
    };

    fakeProjects.push(fakeProject);
  }

  return fakeProjects;
};

describe("Allprojects", () => {
  beforeEach(() => {
    jest.spyOn(router, "useNavigate").mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should render projects of logged in user", async () => {
    // const user = userEvent.setup();

    const mockProjects = generateFakeProjects(5);

    (useGetUsersProjectsQuery as jest.Mock).mockReturnValue({
      data: mockProjects,
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter>
        <AllProjects />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(`${mockProjects.length} projects`, { exact: true })
      ).toBeInTheDocument();
    });
  });
});
