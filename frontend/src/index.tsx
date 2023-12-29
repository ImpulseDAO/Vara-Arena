import ReactDOM from "react-dom/client";
import "./index.css";
import "./app/variables.scss";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./app/AppRouter";
import { Providers } from "./app/providers/providers";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function App() {
  console.warn("ATTENTION: I will mark all places needed to be changed throughout the app with FIXME flag");
  console.log("ATTENTION: I will mark all places needed to be changed throughout the app with FIXME flag");
  console.warn("ATTENTION: I will mark all places needed to be changed throughout the app with FIXME flag");

  return (
    <Providers>
      <RouterProvider router={appRouter} />
    </Providers>
  );
}

root.render(<App />);
