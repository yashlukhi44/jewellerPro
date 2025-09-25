import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import logoImage from "./madhavlogo.png";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";   // Material
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";       // Category
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined"; // Sub-Category
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  // Responsive sidebar: collapse on medium screens and below
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <Box
            sx={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "space-between",
              px: isCollapsed ? 0 : 2,
            }}
          >
            {isCollapsed ? (
              <IconButton onClick={() => setIsCollapsed(false)}>
                <MenuOutlinedIcon />
              </IconButton>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
              >
                <img
                  src={logoImage}
                  alt="Madhav Logo"
                  width="40px"
                  height="40px"
                  style={{ marginLeft: "10px" }}
                />
                <IconButton onClick={() => setIsCollapsed(true)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          {!isCollapsed && (
            <Box mb="25px">
              {/* <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box> */}
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Marco
                </Typography>
                {/* <Typography variant="h5" color={colors.greenAccent[500]}>
                  VP Fancy Admin
                </Typography> */}
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>

            <SubMenu
              title={<span style={{ color: "white" }}>Catalogue</span>}
              icon={<ReceiptOutlinedIcon sx={{ color: "white" }} />}
            >
              <Item
                title="Material"
                to="/material"
                icon={<Inventory2OutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Category"
                to="/category"
                icon={<CategoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {/* <Item
                title="Sub-Category"
                to="/sub-category"
                icon={<AccountTreeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              /> */}
              <Item
                title="Product"
                to="/catalog"
                icon={<ShoppingBagOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>


            <Item
              title="Manage Jewelers"
              to="/jewelers"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Contacts Information"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              title="Reqest Management"
              to="/req-manage"
              icon={<AssignmentOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Order Management"
              to="/order-manage"
              icon={<ShoppingCartOutlinedIcon  />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Past Orders"
              to="/past-order"
              icon={<ShoppingCartOutlinedIcon  />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Support"
              to="/support"
              icon={<HelpOutlineOutlinedIcon   />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              title="Analytics"
              to="/analytics"
              icon={<InsightsOutlinedIcon   />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Inactivity"
              to="/inactivity"
              icon={<AccessTimeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            {/* <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile Form"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
