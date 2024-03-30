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
    path: path.login,
    component: Pages.Login,
  },
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
  {
    path: path.users,
    component: Pages.User,
    layout: MainLayout,
  },
  {
    path: path.blogs,
    component: Pages.Blog,
    layout: MainLayout,
  },
  {
    path: path.blogDetail,
    component: Pages.BlogDetail,
    layout: MainLayout,
  },
];
