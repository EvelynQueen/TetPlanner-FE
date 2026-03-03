import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import { ThemeProvider } from "./contexts/ThemeProvider.jsx";
import TaskProvider from "./contexts/TaskProvider.jsx";
import { ShoppingItemProvider } from "./contexts/ShoppingItemProvider.jsx";
import { ShoppingCategoryProvider } from "./contexts/ShoppingCategoryProvider.jsx";
import { TaskCategoryProvider } from "./contexts/TaskCategoryProvider.jsx";
import { BudgetProvider } from "./contexts/BudgetProvider.jsx";
import { OccasionProvider } from "./contexts/OccasionProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <OccasionProvider>
        <BudgetProvider>
          <ShoppingCategoryProvider>
            <ShoppingItemProvider>
              <TaskCategoryProvider>
                <TaskProvider>
                  <ThemeProvider>
                    <AuthProvider>
                      <App />
                    </AuthProvider>
                  </ThemeProvider>
                </TaskProvider>
              </TaskCategoryProvider>
            </ShoppingItemProvider>
          </ShoppingCategoryProvider>
        </BudgetProvider>
      </OccasionProvider>
    </BrowserRouter>
  </StrictMode>,
);
