import AppRouter from "./routes";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider>
      <AppRouter />
    </ConfigProvider>
  );
}

export default App;
