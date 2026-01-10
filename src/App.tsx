import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { ConfigProvider } from "antd";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { AppRoutes } from "./routes";
import { queryClient } from "./services/queryClient";
import { store } from "./store/store";
import { antTheme } from "./theme";

export default function App() {
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={antTheme}>
            <Router>
              <Layout>
                <AppRoutes />
              </Layout>
            </Router>
          </ConfigProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
}
