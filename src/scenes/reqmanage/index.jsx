import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Check, Close } from "@mui/icons-material";
import axios from "axios";

const baseUrl = "https://nobita.imontechnologies.in";

const RequestManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [filter, setFilter] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/api/trader/requests?status=${filter}&type=relogin&accountId=68ba3dae284ca3c359e5420b`
      );
      setRequests(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  // ✅ Handle Accept / Reject
  const handleStatusChange = async (id, action) => {
    try {
      await axios.post(`${baseUrl}/api/trader/update-request-status`, {
        requestId: id,
        action,
        reason: action === "rejected" ? "Rejected by admin" : "",
      });
      fetchRequests(); // refresh after update
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const columns = [
    { field: "business", headerName: "Business Name", flex: 1 },
    { field: "mobile", headerName: "Mobile", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="success"
            onClick={() => handleStatusChange(params.row._id, "approved")}
          >
            <Check />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleStatusChange(params.row._id, "rejected")}
          >
            <Close />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Header title="REQUESTS" subtitle="Manage Jeweler Requests" />

        <TextField
          select
          label="Status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
          sx={{
            minWidth: 180,
            "& .MuiOutlinedInput-root": {
              backgroundColor: colors.primary[400], // field background
              borderRadius: "8px",
              "& fieldset": {
                borderColor: colors.grey[400],
              },
              "&:hover fieldset": {
                borderColor: colors.greenAccent[400],
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.greenAccent[500],
              },
            },
            "& .MuiInputLabel-root": {
              color: "#fff !important", // ✅ always white
            },
            "& .Mui-focused .MuiInputLabel-root": {
              color: "#fff !important", // ✅ keep white when focused
            },
            "& .MuiSvgIcon-root": {
              color: colors.grey[100],
            },
          }}
        >
          <MenuItem value="pending" sx={{ color: colors.blueAccent[300] }}>
            Pending
          </MenuItem>
          <MenuItem value="approved" sx={{ color: colors.greenAccent[400] }}>
            Approved
          </MenuItem>
          <MenuItem value="rejected" sx={{ color: colors.redAccent[400] }}>
            Rejected
          </MenuItem>
        </TextField>


      </Box>

      <Box mt={3} height="70vh" sx={{ "& .MuiDataGrid-root": { border: "none" } }}>
        <DataGrid
          rows={requests}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
    </Box>
  );
};

export default RequestManagement;
