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
  MenuItem,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const baseUrl = "https://nobita.imontechnologies.in";

const SubCategory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
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

  // Fetch subcategories
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/api/subcategories`);
        setSubCategories(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategories();
  }, []);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/categories`);
        setCategories(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Open/Close modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
    setCategoryId("");
    setEditId(null);
  };

  // Add subcategory
  const handleAdd = async () => {
    if (!name.trim() || !categoryId) return;
    try {
      const res = await axios.post(`${baseUrl}/api/subcategories`, {
        name,
        categoryId,
      });
      setSubCategories((prev) => [...prev, res.data.data]);
      setSnackbar({
        open: true,
        message: "Sub-Category added!",
        severity: "success",
      });
      handleClose();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to add sub-category!",
        severity: "error",
      });
    }
  };

  // Update subcategory
  const handleUpdate = async () => {
    if (!name.trim() || !categoryId || !editId) return;
    try {
      const res = await axios.put(`${baseUrl}/api/subcategories/${editId}`, {
        name,
        categoryId,
      });
      setSubCategories((prev) =>
        prev.map((s) => (s._id === editId ? res.data.data : s))
      );
      setSnackbar({
        open: true,
        message: "Sub-Category updated!",
        severity: "success",
      });
      handleClose();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to update sub-category!",
        severity: "error",
      });
    }
  };

  // Delete subcategory
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/subcategories/${id}`);
      setSubCategories((prev) => prev.filter((s) => s._id !== id));
      setSnackbar({
        open: true,
        message: "Sub-Category deleted!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to delete sub-category!",
        severity: "error",
      });
    }
  };

  // Columns for DataGrid
  const columns = [
    { field: "name", headerName: "Sub-Category Name", flex: 1 },
    {
      field: "categoryId",
      headerName: "Category",
      flex: 1,
      renderCell: (params) => {
        const cat = categories.find((c) => c._id === params.value);
        return cat ? cat.name : "N/A";
      },
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
              setCategoryId(params.row.categoryId);
              setOpen(true);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row._id)}
          >
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
        <Header title="Sub-Category" subtitle="Manage Sub-Categories" />
        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Add Sub-Category
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
            {editId ? "Edit Sub-Category" : "Add Sub-Category"}
          </Typography>
          <TextField
            select
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            fullWidth
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Sub-Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined"
                sx={{
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.divider,
                  "&:hover": { bgcolor: theme.palette.action.hover },
                }}
                onClick={handleClose}>Cancel</Button>
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
      <Box mt={3} height="70vh" sx={{ "& .MuiDataGrid-root": { border: "none" } }}>
        <DataGrid
          rows={subCategories}
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

export default SubCategory;
