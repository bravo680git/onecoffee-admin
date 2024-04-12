import AppRouter from "./routes";
import { ConfigProvider } from "antd";
import { themeConfig } from "./theme/config";
import { AntdCtxProvider } from "./context";

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <AntdCtxProvider>
        <AppRouter />
      </AntdCtxProvider>
    </ConfigProvider>
  );
}

export default App;
