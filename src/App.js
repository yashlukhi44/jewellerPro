import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/catalog";
import Material from "./scenes/material/index";
import Category from "./scenes/category/index";
import Register from "./scenes/auth/Register";
import Support from "./scenes/support/index";
import Analytics from "./scenes/analytics/index";
import Inactivity from "./scenes/inactivity";
import { CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ReqManage from "./scenes/reqmanage/index";
import OrderManage from "./scenes/ordermanage/index";
import PastOrder from "./scenes/pastorder/index";
import { Box } from "@mui/system";

// 404 Page Component
// 404 Page Component
const NotFound = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "#1a2236",
      zIndex: 2000,
    }}
  >
    <Box>
      <Typography variant="h1" sx={{ fontSize: { xs: 80, md: 150 }, fontWeight: 700 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, display:'flex', justifyContent:"center" }}>
        Page Not Found
      </Typography>
    </Box>
  </Box>
);

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <div className="main-body-scroll">
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Register />} />

                {/* Private Routes */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/jewelers"
                  element={
                    <PrivateRoute>
                      <Team />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/catalog"
                  element={
                    <PrivateRoute>
                      <Invoices />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/material"
                  element={
                    <PrivateRoute>
                      <Material />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/category"
                  element={
                    <PrivateRoute>
                      <Category />
                    </PrivateRoute>
                  }
                />
                {/* <Route
                  path="/support"
                  element={
                    <PrivateRoute>
                      <Support />
                    </PrivateRoute>
                  }
                /> */}
                <Route
                  path="/analytics"
                  element={
                    <PrivateRoute>
                      <Analytics />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/inactivity"
                  element={
                    <PrivateRoute>
                      <Inactivity />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/req-manage"
                  element={
                    <PrivateRoute>
                      <ReqManage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/order-manage"
                  element={
                    <PrivateRoute>
                      <OrderManage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/past-order"
                  element={
                    <PrivateRoute>
                      <PastOrder />
                    </PrivateRoute>
                  }
                />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
