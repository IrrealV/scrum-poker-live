import { render, screen, fireEvent } from "@testing-library/react";
import Landing from "../components/Landing";

describe("Landing Component", () => {
  const mockOnCreate = jest.fn();
  const mockOnJoin = jest.fn();

  beforeEach(() => {
    mockOnCreate.mockClear();
    mockOnJoin.mockClear();
  });

  it("renders correctly", () => {
    render(<Landing onCreate={mockOnCreate} onJoin={mockOnJoin} />);
    expect(screen.getByText("Scrum Poker")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ej: María García")).toBeInTheDocument();
  });

  it("allows typing a name", () => {
    render(<Landing onCreate={mockOnCreate} onJoin={mockOnJoin} />);
    const input = screen.getByPlaceholderText("Ej: María García");
    fireEvent.change(input, { target: { value: "Test User" } });
    expect(input).toHaveValue("Test User");
  });

  it('calls onCreate when "Crear nueva sala" is clicked with valid name', () => {
    render(<Landing onCreate={mockOnCreate} onJoin={mockOnJoin} />);

    // Type name
    const nameInput = screen.getByPlaceholderText("Ej: María García");
    fireEvent.change(nameInput, { target: { value: "Product Owner" } });

    // Click Create button
    const createBtn = screen.getByRole("button", { name: /crear nueva sala/i });
    expect(createBtn).not.toBeDisabled();

    fireEvent.click(createBtn);

    expect(mockOnCreate).toHaveBeenCalledWith("Product Owner", "fibonacci");
  });

  it("switches to Join mode and validates 4-char code", () => {
    render(<Landing onCreate={mockOnCreate} onJoin={mockOnJoin} />);

    // Switch to Join tab
    fireEvent.click(screen.getByText("Unirse"));

    // Check UI changes
    expect(screen.getByPlaceholderText("ABCD")).toBeInTheDocument();
    const joinBtn = screen.getByRole("button", { name: /unirse a la sala/i });

    // Button disabled initially
    expect(joinBtn).toBeDisabled();

    // Type name
    const nameInput = screen.getByPlaceholderText("Ej: María García");
    fireEvent.change(nameInput, { target: { value: "Developer" } });

    // Type invalid code (3 chars)
    const codeInput = screen.getByPlaceholderText("ABCD");
    fireEvent.change(codeInput, { target: { value: "ABC" } });
    expect(joinBtn).toBeDisabled();

    // Type valid code (4 chars)
    fireEvent.change(codeInput, { target: { value: "ABCD" } });
    expect(joinBtn).not.toBeDisabled();

    fireEvent.click(joinBtn);
    expect(mockOnJoin).toHaveBeenCalledWith("Developer", "ABCD");
  });
});
