import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from "axios";

// Icons
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

// Components
import Header from "../../components/Header";

const baseUrl = "https://nobita.imontechnologies.in";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // ✅ State
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // ✅ Fetch Jewelers API
  const fetchJewelers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/api/trader/jewelers`, {
        params: {
          page: paginationModel.page + 1, // API is usually 1-based
          limit: paginationModel.pageSize,
        },
      });

      const data = Array.isArray(res.data.data.data) ? res.data.data.data : [];
      setRows(data);
      setRowCount(res.data.total || data.length);
    } catch (err) {
      console.error("Error fetching jewelers:", err);
      setSnackbar({
        open: true,
        message: "Failed to load jewelers!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Call API on mount & pagination change
  useEffect(() => {
    fetchJewelers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel]);

  // ✅ Columns
  // ✅ Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "businessName",
      headerName: "Business Name",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      renderCell: ({ value }) => {
        const color =
          value === "active"
            ? "#4caf50" // success
            : value === "initial"
            ? "#ff9800" // warning
            : "#f44336"; // error
        return (
          <div
            style={{
              width: "100%",
              fontWeight: "bold",
              textTransform: "capitalize",
              color: color,
            }}
          >
            {value}
          </div>
        );
      },
    },
    {
      field: "isVerified",
      headerName: "Verified",
      flex: 0.6,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: ({ value }) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            fontWeight: "bold",
            color: value ? "#4caf50" : "#f44336", // green for yes, red for no
          }}
        >
          {value ? "Yes" : "No"}
        </div>
      ),
    },
    {
      field: "isAdmin",
      headerName: "Admin",
      flex: 0.5,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: ({ value }) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            fontWeight: "bold",
            color: value ? "#4caf50" : "#f44336", // green for yes, red for no
          }}
        >
          {value ? "Yes" : "No"}
        </div>
      ),
    },
  ];

  return (
    <Box m="20px">
      {/* Header with Refresh */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Jewelers" subtitle="Manage Jewelers" />
        <IconButton color="primary" onClick={fetchJewelers}>
          <RefreshIcon />
        </IconButton>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          rowCount={rowCount}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Team;
