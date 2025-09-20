import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import ProductFormModal from "./ProductFormModal";

const baseUrl = "https://nobita.imontechnologies.in";

const Product = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Fetch products
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

  useEffect(() => {
    fetchProducts();
  }, []);

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
            onClick={() => {
              setEditData(params.row);
              setModalOpen(true);
            }}
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

  // Handle add
  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  // Handle save (add or edit)
  const handleSave = (savedProduct, isEdit) => {
    if (isEdit) {
      setRows((prev) =>
        prev.map((row) => (row._id === savedProduct._id ? savedProduct : row))
      );
      setSnackbar({
        open: true,
        message: "Product updated!",
        severity: "success",
      });
    } else {
      setRows((prev) => [...prev, savedProduct]);
      setSnackbar({
        open: true,
        message: "Product added!",
        severity: "success",
      });
    }
    setModalOpen(false);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Products" subtitle="Manage Products" />
        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Product
        </Button>
      </Box>

      {/* Modal for Add/Edit */}
      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editData={editData}
        fetchProducts={fetchProducts}
      />

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