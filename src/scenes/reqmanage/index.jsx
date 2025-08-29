import { useState } from "react";
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

// Mock data for requests
const mockRequests = [
  { id: 1, business: "Golden Jewelers", mobile: "9876543210", email: "golden@example.com", status: "pending" },
  { id: 2, business: "Diamond Co", mobile: "9123456780", email: "diamond@example.com", status: "pending" },
  { id: 3, business: "Silver Line", mobile: "9988776655", email: "silver@example.com", status: "rejected" },
];

const RequestManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [filter, setFilter] = useState("pending");
  const [requests, setRequests] = useState(mockRequests);

  const handleStatusChange = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filteredRequests = requests.filter((r) => r.status === filter);

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
            onClick={() => handleStatusChange(params.row.id, "approved")}
          >
            <Check />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleStatusChange(params.row.id, "rejected")}
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
          label="Filter Status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </TextField>
      </Box>

      <Box mt={3} height="70vh" sx={{ "& .MuiDataGrid-root": { border: "none" } }}>
        <DataGrid rows={filteredRequests} columns={columns} pageSize={10} />
      </Box>
    </Box>
  );
};

export default RequestManagement;
