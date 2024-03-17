import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import FallbackPage from "./pages/FallbackPage.tsx";

function App() {
  return <RouterProvider router={router} fallbackElement={<FallbackPage />} />;
}

export default App;
