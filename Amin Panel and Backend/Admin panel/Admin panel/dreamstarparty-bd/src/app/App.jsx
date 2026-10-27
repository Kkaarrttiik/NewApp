import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { Routes } from "./Routes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <Provider store={store}>
      <Toaster richColors position="top-right" />
      <RouterProvider router={Routes} />
    </Provider>
  );
}
