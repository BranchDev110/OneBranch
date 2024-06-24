import { render, screen, fireEvent } from "@testing-library/react";
import SprintsContainer from "@/components/Sprints/SprintsContainer";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

jest.mock("@/hooks/useLoggedInUser", () => ({
  useLoggedInUser: jest.fn(),
}));

jest.mock("@/components/Sprints/SprintCard", () => ({ sprint }: any) => (
  <div data-testid="sprint-card">{sprint.name}</div>
));

const generateFakeSprints = (numSprints: number) => {
  const fakeSprints = [];
  for (let i = 1; i <= numSprints; i++) {
    fakeSprints.push({
      id: `sprint-${i}`,
      name: `Sprint ${i}`,
      description: `Description for Sprint ${i}`,
      projectId: `project-${i}`,
    });
  }
  return fakeSprints;
};

describe("SprintsContainer", () => {
  beforeEach(() => {
    (useLoggedInUser as jest.Mock).mockReturnValue({
      user: {
        name: "Test User",
        id: "user-id",
        role: "user",
        avatarUrl: "https://placehold.co/400",
        email: "testuser@email.com",
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders sprints passed as props", () => {
    const sprints = generateFakeSprints(3);

    render(<SprintsContainer sprints={sprints as any[]} />);

    sprints.forEach((sprint) => {
      expect(screen.getByText(sprint.name)).toBeInTheDocument();
    });
  });

  test('displays "No sprints found" when no sprints are passed', () => {
    render(<SprintsContainer sprints={[]} />);

    expect(screen.getByText("No sprints found")).toBeInTheDocument();
  });

  test("filters sprints based on search query", () => {
    const sprints = generateFakeSprints(5);

    render(<SprintsContainer sprints={sprints as any[]} />);

    const searchInput = screen.getByPlaceholderText("Search sprints....");
    fireEvent.change(searchInput, { target: { value: "Sprint 2" } });

    expect(screen.getByText("Sprint 2")).toBeInTheDocument();
    expect(screen.queryByText("Sprint 1")).not.toBeInTheDocument();
  });

  test('displays "No sprints found" when search query has no matches', () => {
    const sprints = generateFakeSprints(5);

    render(<SprintsContainer sprints={sprints as any[]} />);

    const searchInput = screen.getByPlaceholderText("Search sprints....");
    fireEvent.change(searchInput, { target: { value: "Nonexistent Sprint" } });

    expect(screen.getByText("No sprints found")).toBeInTheDocument();
  });
});
