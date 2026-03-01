import React, { useEffect, useState } from "react";

const ThemeList = () => {
  const [theme, setTheme] = useState("default");

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="w-full flex flex-col justify-center items-start p-2 gap-1 bg-(--color-bg-main) rounded-md shadow-lg ">
      <p
        className={`w-full text-left  cursor-pointer p-2 rounded-md transition-colors duration-200 ${
          theme === "default"
            ? "bg-(--color-primary-300)/25 text-(--color-primary-500)"
            : "bg-transparent text-(--color-text-muted) hover:bg-black/5"
        }`}
        onClick={() => handleThemeChange("default")}
      >
        Light-Pink
      </p>

      <p
        className={`w-full text-left  cursor-pointer p-2 rounded-md transition-colors duration-200 ${
          theme === "cherry-pink"
            ? "bg-(--color-primary-300)/25 text-(--color-primary-500)"
            : "bg-transparent text-(--color-text-muted) hover:bg-black/5"
        }`}
        onClick={() => handleThemeChange("cherry-pink")}
      >
        Dark-Pink
      </p>

      <p
        className={`w-full text-left  cursor-pointer p-2 rounded-md transition-colors duration-200 ${
          theme === "apricot-yellow"
            ? "bg-(--color-primary-300)/25 text-(--color-primary-500)"
            : "bg-transparent text-(--color-text-muted) hover:bg-black/5"
        }`}
        onClick={() => handleThemeChange("apricot-yellow")}
      >
        Apricot-yellow
      </p>
    </div>
  );
};

export default ThemeList;
