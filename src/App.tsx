import AppRouter from "./routes";
import { ConfigProvider } from "antd";
import { themeConfig } from "./theme/config";

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <AppRouter />
    </ConfigProvider>
  );
}

export default App;
