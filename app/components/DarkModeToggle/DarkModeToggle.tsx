"use client";

import { changeDarkMode } from "./DarkModeActions";

const DarkModeToggle = ({ defaultChecked }: { defaultChecked: boolean }) => {
  const handleToggle = async (enabled: boolean) => {
    try {
      const newTheme = enabled ? "lcup-dark" : "lcup-light";
      document.documentElement.setAttribute("data-theme", newTheme);
      await changeDarkMode(enabled);
    } catch (error) {
      const oldTheme = enabled ? "lcup-light" : "lcup-dark";
      document.documentElement.setAttribute("data-theme", oldTheme);
      console.error("Error changing dark mode:", error);
    }
  };

  return (
    <label>
      <input
        type="checkbox"
        onChange={(e) => handleToggle(e.target.checked)}
        defaultChecked={defaultChecked}
        value="lcup-dark"
        className="toggle theme-controller"
      />
      Dark Mode
    </label>
  );
};

export default DarkModeToggle;
