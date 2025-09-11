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

const baseUrl = process.env.REACT_APP_SERVER_PORT || "http://localhost:5000";

const Category = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/api/categories`);
        setCategories(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Open/Close modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
    setEditId(null);
  };

  // Add category
  const handleAdd = async () => {
    if (!name.trim()) return;
    try {
      const res = await axios.post(`${baseUrl}/api/categories`, { name });
      setCategories((prev) => [...prev, res.data.data]);
      setSnackbar({ open: true, message: "Category added!", severity: "success" });
      handleClose();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to add category!", severity: "error" });
    }
  };

  // Update category
  const handleUpdate = async () => {
    if (!name.trim() || !editId) return;
    try {
      const res = await axios.put(`${baseUrl}/api/categories/${editId}`, { name });
      setCategories((prev) =>
        prev.map((c) => (c._id === editId ? res.data.data : c))
      );
      setSnackbar({ open: true, message: "Category updated!", severity: "success" });
      handleClose();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to update category!", severity: "error" });
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      setSnackbar({ open: true, message: "Category deleted!", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to delete category!", severity: "error" });
    }
  };

  // Columns for DataGrid
  const columns = [
    { field: "name", headerName: "Category Name", flex: 1 },
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
        <Header title="Category" subtitle="Manage Categories" />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Add Category
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
            {editId ? "Edit Category" : "Add Category"}
          </Typography>
          <TextField
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={editId ? handleUpdate : handleAdd}
            >
              {editId ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* DataGrid */}
      <Box mt={3} height="70vh" sx={{ "& .MuiDataGrid-root": { border: "none" } }}>
        <DataGrid
          rows={categories}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
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

export default Category;
