import { useColorScheme } from "@mui/material";

const ThemeToggle = () => {
  const { mode, setMode } = useColorScheme();

  return (
    <div>
      <button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </div>
  );
};

export default ThemeToggle;
