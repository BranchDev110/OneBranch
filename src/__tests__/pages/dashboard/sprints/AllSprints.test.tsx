import AllSprints from "@/pages/dashboard/sprints/AllSprints";
import { MemoryRouter } from "react-router-dom";

import { screen, render, waitFor } from "@testing-library/react";
import * as router from "react-router";

import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useGetUsersProjectsQuery } from "@/services/projects";
import {
  useCreateSprintMutation,
  useGetAllUserSprintsQuery,
} from "@/services/sprints";
import { ROLES } from "@/constants/roles";

const mockNavigate = jest.fn();

jest.mock("@/hooks/useLoggedInUser", () => ({
  useLoggedInUser: jest.fn(),
}));

jest.mock("@/services/projects", () => ({
  useGetUsersProjectsQuery: jest.fn(),
}));

jest.mock("@/services/sprints", () => ({
  useGetAllUserSprintsQuery: jest.fn(),
  useCreateSprintMutation: jest.fn(),
}));

const mockSprints = [1, 2].map((s) => ({
  id: `sid-${s}`,
  createdBy: "hhh",
  description: "Sssssssssssssssssssssssssss sssssssssssss",
  isRemoved: false,
  endDate: "2024-07-04T18:51:40.791Z",
  startDate: "2024-06-13T18:27:21.661Z",
  name: `name ${s}`,
  totalPoints: 7,
  currentPoints: 5.5,
  projectId: `p-id`,
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

describe("AllSprints component", () => {
  beforeEach(() => {
    jest.spyOn(router, "useNavigate").mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders correctly", async () => {
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

    (useGetUsersProjectsQuery as jest.Mock).mockReturnValue({
      data: generateFakeProjects(1),
      isLoading: false,
      isError: false,
      isSuccess: true,
    });

    (useGetAllUserSprintsQuery as jest.Mock).mockReturnValue({
      data: mockSprints,
      isLoading: false,
      isError: false,
      isSuccess: true,
    });

    const mockCreate = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue({}),
    }));

    (useCreateSprintMutation as jest.Mock).mockReturnValue([
      mockCreate,
      { isLoading: false },
    ]);

    render(
      <MemoryRouter>
        <AllSprints />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(`Total sprints: ${mockSprints.length}`, {
          exact: true,
        })
      ).toBeInTheDocument();
    });
  });
});
