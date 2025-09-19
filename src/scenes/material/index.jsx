import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const baseUrl = process.env.REACT_APP_SERVER_PORT || "https://nobita.imontechnologies.in";

const Material = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [materials, setMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Fetch materials
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${baseUrl}/api/materials${search ? `?search=${search}` : ""}`
        );
        setMaterials(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching materials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [search]);

  // Open/Close modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
    setEditId(null);
  };

  // Add material
  const handleAdd = async () => {
    if (!name.trim()) return;
    try {
      const res = await axios.post(`${baseUrl}/api/materials`, { name });
      setMaterials((prev) => [...prev, res.data.data]);
      setSnackbar({
        open: true,
        message: "Material added!",
        severity: "success",
      });
      handleClose();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to add material!",
        severity: "error",
      });
    }
  };

  // Update material
  const handleUpdate = async () => {
    if (!name.trim() || !editId) return;
    try {
      const res = await axios.put(`${baseUrl}/api/materials/${editId}`, { name });
      setMaterials((prev) =>
        prev.map((m) => (m._id === editId ? res.data.data : m))
      );
      setSnackbar({
        open: true,
        message: "Material updated!",
        severity: "success",
      });
      handleClose();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to update material!",
        severity: "error",
      });
    }
  };

  // Delete material
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/materials/${id}`);
      setMaterials((prev) => prev.filter((m) => m._id !== id));
      setSnackbar({
        open: true,
        message: "Material deleted!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to delete material!",
        severity: "error",
      });
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString(); // e.g., 9/10/2025, 9:43:52 PM
  };

  // Columns for DataGrid
  const columns = [
    { field: "name", headerName: "Material Name", flex: 1 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="secondary"
            onClick={() => {
              setEditId(params.row._id);
              setName(params.row.name);
              setOpen(true);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        m="20px"
      >
        <Header title="Material" subtitle="Manage Materials" />
        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Add Material
        </Button>
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          p={4}
          m="auto"
          mt={10}
          bgcolor={colors.primary[400]}
          borderRadius="12px"
          width="400px"
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="h6">
            {editId ? "Edit Material" : "Add Material"}
          </Typography>
          <TextField
            label="Material Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" color="white" onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              color="success"
              onClick={editId ? handleUpdate : handleAdd}
            >
              {editId ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* DataGrid */}
      <Box
        mt={3}
        height="70vh"
        sx={{ "& .MuiDataGrid-root": { border: "none" } }}
      >
        <DataGrid
          rows={materials}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          checkboxSelection={false}   // ✅ disables checkboxes
          disableRowSelectionOnClick  // ✅ prevents row selection when clicking a cell
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

export default Material;
