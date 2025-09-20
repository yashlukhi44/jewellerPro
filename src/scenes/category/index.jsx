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

const baseUrl = "https://nobita.imontechnologies.in";

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

  // Open/Close category modal
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

  // ===============================
  // SUBCATEGORY MANAGEMENT
  // ===============================
  const [subcategories, setSubcategories] = useState([]);
  const [subOpen, setSubOpen] = useState(false);
  const [subName, setSubName] = useState("");
  const [subEditId, setSubEditId] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // Fetch subcategories by categoryId
  const fetchSubcategories = async (categoryId) => {
    try {
      const res = await axios.get(`${baseUrl}/api/subcategories/${categoryId}`);
      const data = res.data.data;

      // Normalize response to always be an array
      setSubcategories(Array.isArray(data) ? data : data ? [data] : []);

      setActiveCategoryId(categoryId);
      setSubOpen(true);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  // Add subcategory
  const handleAddSub = async () => {
    if (!subName.trim() || !activeCategoryId) return;
    try {
      const res = await axios.post(`${baseUrl}/api/subcategories`, {
        name: subName,
        categoryId: activeCategoryId,
      });

      const data = res.data.data;
      setSubcategories((prev) => [...prev, ...(Array.isArray(data) ? data : [data])]);

      setSnackbar({ open: true, message: "Subcategory added!", severity: "success" });
      handleCloseSub();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to add subcategory!", severity: "error" });
    }
  };

  // Update subcategory
  const handleUpdateSub = async () => {
    if (!subName.trim() || !subEditId) return;
    try {
      const res = await axios.put(`${baseUrl}/api/subcategories/${subEditId}`, {
        name: subName,
      });

      const data = res.data.data;
      setSubcategories((prev) =>
        prev.map((s) => (s._id === subEditId ? data : s))
      );

      setSnackbar({ open: true, message: "Subcategory updated!", severity: "success" });
      handleCloseSub();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to update subcategory!", severity: "error" });
    }
  };

  // Delete subcategory
  const handleDeleteSub = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/subcategories/${id}`);
      setSubcategories((prev) => prev.filter((s) => s._id !== id));
      setSnackbar({ open: true, message: "Subcategory deleted!", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to delete subcategory!", severity: "error" });
    }
  };

  // Close subcategory modal
  const handleCloseSub = () => {
    setSubOpen(false);
    setSubName("");
    setSubEditId(null);
  };

  // Columns for categories DataGrid
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
          <Button
  variant="outlined"
  size="small"
  onClick={() => fetchSubcategories(params.row._id)}
  sx={{
    borderColor: "#2e7d32",        // custom green border
    color: "#2e7d32",              // text color
    fontWeight: "bold",
    textTransform: "none",         // keep normal text (not uppercase)
    borderRadius: "8px",
    px: 2,
    "&:hover": {
      borderColor: "#1b5e20",
      backgroundColor: "rgba(46,125,50,0.1)", // subtle hover
    },
  }}
>
  Manage Subcategories
</Button>

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
        <Header title="Category" subtitle="Manage Categories & Subcategories" />
        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Add Category
        </Button>
      </Box>

      {/* Category Modal */}
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
            <Button onClick={handleClose} variant="outlined"
                sx={{
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.divider,
                  "&:hover": { bgcolor: theme.palette.action.hover },
                }}>Cancel</Button>
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

      {/* Category DataGrid */}
      <Box mt={3} height="70vh" sx={{ "& .MuiDataGrid-root": { border: "none" } }}>
        <DataGrid
          rows={categories}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
        />
      </Box>

      {/* Subcategory Modal */}
      <Modal open={subOpen} onClose={handleCloseSub}>
        <Box
          p={4}
          m="auto"
          mt={10}
          bgcolor={colors.primary[400]}
          borderRadius="12px"
          width="500px"
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="h6">Subcategories</Typography>

          {/* Add/Edit Subcategory */}
          <TextField
            label="Subcategory Name"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            fullWidth
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleCloseSub}>Close</Button>
            <Button
              variant="contained"
              onClick={subEditId ? handleUpdateSub : handleAddSub}
            >
              {subEditId ? "Update" : "Add"}
            </Button>
          </Box>

          {/* Subcategory DataGrid */}
          <Box mt={2} height="50vh">
            <DataGrid
              rows={subcategories}
              columns={[
                { field: "name", headerName: "Subcategory Name", flex: 1 },
                {
                  field: "actions",
                  headerName: "Actions",
                  flex: 1,
                  renderCell: (params) => (
                    <Box>
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          setSubEditId(params.row._id);
                          setSubName(params.row.name);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteSub(params.row._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ),
                },
              ]}
              getRowId={(row) => row._id}
            />
          </Box>
        </Box>
      </Modal>

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
