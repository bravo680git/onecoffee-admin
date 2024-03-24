import { path } from "./path";
import * as Pages from "../pages";

type Route = {
  path: string;
  component: React.FC;
  layout?: boolean;
};

export const routes: Route[] = [
  {
    path: path.home,
    component: Pages.Home,
  },
];
