import { path } from "./path";
import * as Pages from "../pages";
import React from "react";
import MainLayout from "../components/layout/Layout";

type Route = {
  path: string;
  component: React.FC;
  layout?: React.FC<{ children: React.ReactNode }>;
};

export const routes: Route[] = [
  {
    path: path.home,
    component: Pages.Home,
    layout: MainLayout,
  },
  {
    path: path.categories,
    component: Pages.Category,
    layout: MainLayout,
  },
  {
    path: path.products,
    component: Pages.Product,
    layout: MainLayout,
  },
  {
    path: path.productDetail,
    component: Pages.ProductDetail,
    layout: MainLayout,
  },
];
