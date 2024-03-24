import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./routes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => {
          const Component = route.component;

          return (
            <Route path={route.path} element={<Component />} key={route.path} />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}
