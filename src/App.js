import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/catalog";
import Contacts from "./scenes/contacts";
import Material from "./scenes/material/index";
import Category from "./scenes/category/index";
import SubCategory from "./scenes/subCategory/index";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Register from "./scenes/auth/Register";
import Support from "./scenes/support/index";
import Analytics from "./scenes/analytics/index";
import Inactivity from "./scenes/inactivity";
import Test from "./components/test";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import ReqManage from "./scenes/reqmanage/index";
import OrderManage from "./scenes/ordermanage/index";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            {/* hey */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Register />} />
              <Route path="/test" element={<Test />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/catalog" element={<Invoices />} />
              <Route path="/material" element={<Material />} />
              <Route path="/category" element={<Category />} />
              <Route path="/sub-category" element={<SubCategory />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/support" element={<Support />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/inactivity" element={<Inactivity />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/req-manage" element={<ReqManage />} />
              <Route path="/order-manage" element={<OrderManage />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
