import { fireEvent, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import SchemaEditor from ".";
import renderWithProviders from "../../../test/renderWithProviders";

// Monaco does not render in jsdom; stand it in with a controlled <textarea>.
// useMonaco returns null so the faker-completions hook no-ops.
vi.mock("@monaco-editor/react", () => ({
  useMonaco: () => null,
  default: ({
    value,
    onChange,
    options,
  }: {
    value?: string;
    onChange?: (value: string | undefined) => void;
    options?: { ariaLabel?: string };
  }) => (
    <textarea
      aria-label={options?.ariaLabel}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  ),
}));

const user = userEvent.setup();

describe("SchemaEditor", () => {
  it("shows the tree view by default", () => {
    renderWithProviders(
      <SchemaEditor value={{ greeting: "hello" }} onChange={vi.fn()} />,
    );

    expect(screen.getByText("greeting")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tree/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.queryByRole("textbox", { name: /responseSchemaEditor/i }),
    ).not.toBeInTheDocument();
  });

  it("switches to the Monaco JSON editor and reports parsed edits", async () => {
    const onChange = vi.fn();
    renderWithProviders(<SchemaEditor value={{}} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /edit json/i }));

    const jsonEditor = screen.getByRole("textbox", {
      name: /responseSchemaEditor/i,
    });
    fireEvent.change(jsonEditor, { target: { value: '{ "a": 1 }' } });

    expect(onChange).toHaveBeenCalledWith({ a: 1 });
  });
});
