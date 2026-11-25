import { fireEvent, screen } from "@testing-library/react";
import JsonCodeEditor from ".";
import renderWithProviders from "../../../test/renderWithProviders";

// Monaco does not render a working editor in jsdom, so stand it in with a
// controlled <textarea> that forwards edits through the same `onChange` prop.
vi.mock("@monaco-editor/react", () => ({
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

describe("JsonCodeEditor", () => {
  it("renders the value as formatted JSON", () => {
    renderWithProviders(
      <JsonCodeEditor
        value={{ name: "Ada" }}
        onChange={vi.fn()}
        label="json editor"
      />,
    );

    expect(screen.getByLabelText("json editor")).toHaveValue(
      '{\n  "name": "Ada"\n}',
    );
  });

  it("reports the parsed object when the edited JSON is valid", () => {
    const onChange = vi.fn();
    renderWithProviders(
      <JsonCodeEditor value={{}} onChange={onChange} label="json editor" />,
    );

    fireEvent.change(screen.getByLabelText("json editor"), {
      target: { value: '{ "age": 42 }' },
    });

    expect(onChange).toHaveBeenCalledWith({ age: 42 });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("surfaces an error and does not report invalid JSON", () => {
    const onChange = vi.fn();
    renderWithProviders(
      <JsonCodeEditor value={{}} onChange={onChange} label="json editor" />,
    );

    fireEvent.change(screen.getByLabelText("json editor"), {
      target: { value: "{ not json" },
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid JSON");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("clears the error once the JSON becomes valid again", () => {
    const onChange = vi.fn();
    renderWithProviders(
      <JsonCodeEditor value={{}} onChange={onChange} label="json editor" />,
    );
    const editor = screen.getByLabelText("json editor");

    fireEvent.change(editor, { target: { value: "oops" } });
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(editor, { target: { value: '{ "ok": true }' } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith({ ok: true });
  });
});
