import { path } from "@/routes/path";
import { Navigate } from "react-router-dom";

function Home() {
  return <Navigate to={path.banners} />;
}

export default Home;
