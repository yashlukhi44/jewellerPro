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
import ImagePicker from "../../components/ImagePicker";

const baseUrl = process.env.REACT_APP_SERVER_PORT || "http://localhost:5000";

const Product = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    materialId: "",
    categoryId: "",
    subCategoryId: "",
    name: "",
    description: "",
    netWeight: "",
    grossWeight: "",
    images: [], // base64 array
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Fetch materials & categories
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [mats, cats] = await Promise.all([
          axios.get(`${baseUrl}/api/materials`),
          axios.get(`${baseUrl}/api/categories`),
        ]);
        setMaterials(mats.data.data || []);
        setCategories(cats.data.data || []);
      } catch (err) {
        console.error("Error loading dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/api/products`);
        const items =
          res.data?.data?.items || res.data?.data || res.data || [];
        setRows(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch subcategories by categoryId
  const fetchSubCategories = async (categoryId) => {
    try {
      const res = await axios.get(`${baseUrl}/api/subcategories/${categoryId}`);
      const data = res.data.data;
      setSubCategories(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setSubCategories([]);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Remove image by index
  const handleRemoveImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // Handle input change
  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const base64Files = await Promise.all(
        Array.from(files).map((file) => fileToBase64(file))
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Files],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "categoryId") {
      setFormData((prev) => ({ ...prev, subCategoryId: "" }));
      fetchSubCategories(value);
    }
  };

  // Open/Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setFormData({
      materialId: "",
      categoryId: "",
      subCategoryId: "",
      name: "",
      description: "",
      netWeight: "",
      grossWeight: "",
      images: [],
    });
    setSubCategories([]);
  };

  // Add or Update Product
  const handleSaveItem = async () => {
    try {
      const payload = { ...formData };

      if (editId) {
        const res = await axios.put(
          `${baseUrl}/api/products/${editId}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const updated = res.data?.data || res.data;
        setRows((prev) =>
          prev.map((row) => (row._id === editId ? updated : row))
        );
        setSnackbar({
          open: true,
          message: "Product updated!",
          severity: "success",
        });
      } else {
        const res = await axios.post(`${baseUrl}/api/products`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const created = res.data?.data || res.data;
        setRows((prev) => [...prev, created]);
        setSnackbar({
          open: true,
          message: "Product added!",
          severity: "success",
        });
      }
      handleClose();
    } catch (err) {
      console.error("Error saving product:", err);
      setSnackbar({
        open: true,
        message: "Failed to save product!",
        severity: "error",
      });
    }
  };

  // Delete Product
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRows((prev) => prev.filter((row) => row._id !== id));
      setSnackbar({
        open: true,
        message: "Product deleted!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error deleting product:", err);
      setSnackbar({
        open: true,
        message: "Failed to delete product!",
        severity: "error",
      });
    }
  };

  // Edit Product
  const handleEditItem = (product) => {
    setFormData({
      materialId: product.materialId || "",
      categoryId: product.categoryId || "",
      subCategoryId: product.subCategoryId || "",
      name: product.name || "",
      description: product.description || "",
      netWeight: product.netWeight || "",
      grossWeight: product.grossWeight || "",
      images: product.images || [],
    });
    setEditId(product._id);
    if (product.categoryId) {
      fetchSubCategories(product.categoryId);
    }
    setOpen(true);
  };

  // DataGrid columns
  const columns = [
    { field: "name", headerName: "Product Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "netWeight", headerName: "Net Wt.", flex: 1 },
    { field: "grossWeight", headerName: "Gross Wt.", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="secondary"
            onClick={() => handleEditItem(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteItem(params.row._id)}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Products" subtitle="Manage Products" />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Add Product
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
          width="500px"
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="h6">
            {editId ? "Edit Product" : "Add Product"}
          </Typography>

          {/* Dropdowns */}
          <TextField
            select
            label="Material"
            name="materialId"
            value={formData.materialId}
            onChange={handleChange}
            fullWidth
          >
            {materials.map((m) => (
              <MenuItem key={m._id} value={m._id}>
                {m.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Category"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            fullWidth
          >
            {categories.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="SubCategory"
            name="subCategoryId"
            value={formData.subCategoryId}
            onChange={handleChange}
            fullWidth
            disabled={!formData.categoryId}
          >
            {subCategories.map((s) => (
              <MenuItem key={s._id} value={s._id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Text inputs */}
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
          />
          <TextField
            label="Net Weight"
            name="netWeight"
            value={formData.netWeight}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Gross Weight"
            name="grossWeight"
            value={formData.grossWeight}
            onChange={handleChange}
            fullWidth
          />

          {/* Image Picker */}
          <ImagePicker
            images={formData.images}
            onChange={handleChange}
            onRemove={handleRemoveImage}
            multiple
          />

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveItem}>
              {editId ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* DataGrid */}
      <Box mt={3} height="70vh">
        <DataGrid
          rows={rows}
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

export default Product;
