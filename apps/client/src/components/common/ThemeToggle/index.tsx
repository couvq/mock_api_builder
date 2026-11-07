import { styled, Switch, useColorScheme } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeSwitch = styled(Switch)(() => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 1,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(28px)",
      color: "#1e293b",
      "& + .MuiSwitch-track": {
        backgroundColor: "#475569",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-switchBase:not(.Mui-checked)": {
    color: "#f59e0b",
  },
  "& .MuiSwitch-switchBase svg": {
    width: 32,
    height: 32,
    padding: 7,
    borderRadius: "50%",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },
  "& .MuiSwitch-track": {
    borderRadius: 17,
    backgroundColor: "#bae6fd",
    opacity: 1,
  },
  "& .MuiSwitch-switchBase.Mui-focusVisible": {
    outline: "2px solid currentColor",
    outlineOffset: 2,
  },
}));

const ThemeToggle = () => {
  const { mode, setMode } = useColorScheme();
  const darkMode = mode === "dark";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: darkMode ? "#f8fafc" : "#334155",
        transition: "color 300ms ease",
      }}
    >
      <ThemeSwitch
        checked={darkMode}
        onChange={() => setMode(darkMode ? "light" : "dark")}
        icon={<LightModeIcon />}
        checkedIcon={<DarkModeIcon />}
        slotProps={{
          input: {
            "aria-label": darkMode ? "Turn light mode on" : "Turn dark mode on",
          },
        }}
      />
    </div>
  );
};

export default ThemeToggle;
