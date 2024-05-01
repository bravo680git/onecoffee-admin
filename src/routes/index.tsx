import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import ProtectedRoute from "./ProtectedRoute";

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

          return (
            <Route
              path={route.path}
              element={
                <ProtectedRoute isPublic={route.public}>
                  {Element}
                </ProtectedRoute>
              }
              key={route.path}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}
