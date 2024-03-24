import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./routes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => {
          const Element = route.layout ? (
            <route.layout>
              <route.component></route.component>
            </route.layout>
          ) : (
            <route.component></route.component>
          );

          return <Route path={route.path} element={Element} key={route.path} />;
        })}
      </Routes>
    </BrowserRouter>
  );
}
