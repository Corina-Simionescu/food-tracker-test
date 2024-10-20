import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import FoodTracker from "./pages/FoodTracker.jsx";
import AddFood from "./pages/AddFood.jsx";
import { Box } from "@chakra-ui/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/food-tracker",
    element: <FoodTracker />,
  },
  {
    path: "/food-tracker/add-food",
    element: <AddFood />,
  },
]);

function App() {
  return (
    <Box backgroundColor="#464646" minHeight="100vh">
      <RouterProvider router={router} />
    </Box>
  );
}

export default App;
