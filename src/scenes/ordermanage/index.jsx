import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { tokens } from "../../theme";
import Header from "../../components/Header";

// Mock data for orders
const mockOrders = [
  {
    id: 1,
    business: "Shree Jewels",
    phone: "9876543210",
    email: "shree@example.com",
    itemName: "Gold Ring",
    itemImage: "",
    status: "Pending",
  },
  {
    id: 2,
    business: "Raj Jewellers",
    phone: "9123456780",
    email: "raj@example.com",
    itemName: "Silver Bracelet",
    itemImage: "",
    status: "Confirmed",
  },
  {
    id: 3,
    business: "Diamond Hub",
    phone: "9988776655",
    email: "diamond@example.com",
    itemName: "Platinum Pendant",
    itemImage: "",
    status: "Rejected",
  },
];

const OrderManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState(mockOrders);

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    const updated = rows.map((row) =>
      row.id === id ? { ...row, status: newStatus } : row
    );
    setRows(updated);
  };

  // Copy contact details to clipboard
  const handleCopy = (phone, email) => {
    navigator.clipboard.writeText(`Phone: ${phone}, Email: ${email}`);
    alert("Contact details copied!");
  };

  const columns = [
    { field: "business", headerName: "Business Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "item",
      flex: 1,
      renderCell: (params) => (
        <Box>
          {params.row.itemName}
        </Box>
      ),
    },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title="Copy Contact Details">
          <IconButton
            color="white"
            onClick={() => handleCopy(params.row.phone, params.row.email)}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Order Management" subtitle="Manage Order Requests" />
      <Box mt={3} height="70vh" sx={{ "& .MuiDataGrid-root": { border: "none" } }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default OrderManagement;
