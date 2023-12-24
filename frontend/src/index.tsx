import ReactDOM from "react-dom/client";
import "./index.css";
import "./app/variables.scss";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./app/AppRouter";
import { Providers } from "./app/providers/providers";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Providers>
    <RouterProvider router={appRouter} />
  </Providers>
);
