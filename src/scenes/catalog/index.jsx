import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  Chip,
  Badge,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import ProductFormModal from "./ProductFormModal";

const baseUrl = "https://nobita.imontechnologies.in";

const Product = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

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
      setProducts(Array.isArray(items) ? items : []);
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
      setProducts((prev) => prev.filter((p) => p._id !== id));
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

  // Handle add
  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  // Handle save (add or edit)
  const handleSave = (savedProduct, isEdit) => {
    if (isEdit) {
      setProducts((prev) =>
        prev.map((p) => (p._id === savedProduct._id ? savedProduct : p))
      );
      setSnackbar({
        open: true,
        message: "Product updated!",
        severity: "success",
      });
    } else {
      setProducts((prev) => [...prev, savedProduct]);
      setSnackbar({
        open: true,
        message: "Product added!",
        severity: "success",
      });
    }
    setModalOpen(false);
  };

  // Calculate discount percentage
  const getDiscountPercentage = (originalPrice, discountPrice) => {
    if (!originalPrice || !discountPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
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
          // sx={{
          //   borderRadius: 2,
          //   textTransform: "none",
          //   fontWeight: 600,
          //   px: 3,
          //   py: 1.5,
          // }}
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

      {/* Card Grid */}
      <Box
        mt={3}
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={3}
      >
        {products.map((product) => (
          <Card
            key={product._id}
            sx={{
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: `0 20px 40px ${colors.primary[900]}20`,
                "& .product-actions": {
                  opacity: 1,
                  transform: "translateY(0)",
                },
                "& .product-image": {
                  transform: "scale(1.05)",
                },
              },
              boxShadow: `0 4px 20px ${colors.primary[900]}10`,
              background: theme.palette.mode === "dark" 
                ? `linear-gradient(135deg, ${colors.primary[800]} 0%, ${colors.primary[700]} 100%)`
                : "#ffffff",
            }}
          >
            {/* Discount Badge */}
            {product.price && product.discountPrice && product.price > product.discountPrice && (
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  zIndex: 2,
                  background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
                  color: "white",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(238, 90, 82, 0.3)",
                }}
              >
                -{getDiscountPercentage(product.price, product.discountPrice)}%
              </Box>
            )}

            {/* Action Buttons */}
            <Box
              className="product-actions"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                opacity: 0,
                transform: "translateY(-10px)",
                transition: "all 0.3s ease",
                zIndex: 2,
              }}
            >
              <Tooltip title="Edit Product" placement="left">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditData(product);
                    setModalOpen(true);
                  }}
                  sx={{
                    bgcolor: "white",
                    color: colors.greenAccent[600],
                    backdropFilter: "blur(10px)",
                    "&:hover": { 
                      bgcolor: colors.greenAccent[500], 
                      color: "white",
                      transform: "scale(1.1)",
                    },
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Product" placement="left">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(product._id);
                  }}
                  sx={{
                    bgcolor: "white",
                    color: "#d32f2f",
                    backdropFilter: "blur(10px)",
                    "&:hover": { 
                      bgcolor: "#d32f2f", 
                      color: "white",
                      transform: "scale(1.1)",
                    },
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Product Image */}
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                height: 220,
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              }}
            >
              {product.imageUrls && product.imageUrls[0] ? (
                <CardMedia
                  className="product-image"
                  component="img"
                  height="220"
                  image={product.imageUrls[0]}
                  alt={product.name}
                  sx={{
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors.grey[500],
                    fontSize: "3rem",
                  }}
                >
                  📦
                </Box>
              )}
            </Box>

            {/* Product Content */}
            <CardContent sx={{ p: 2.5 }}>
              {/* Product Name */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: colors.grey[100],
                  fontSize: "1.1rem",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.name}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: colors.grey[300],
                  mb: 2,
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  height: "2.5rem",
                }}
              >
                {product.description || "No description available"}
              </Typography>

              {/* Weight Info */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === "dark" 
                    ? colors.primary[900] 
                    : colors.grey[900],
                }}
              >
                <Box textAlign="center">
                  <Typography variant="caption" color={colors.grey[400]}>
                    Net Weight
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color={colors.grey[100]}>
                    {product.netWeight}g
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="caption" color={colors.grey[400]}>
                    Gross Weight
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color={colors.grey[100]}>
                    {product.grossWeight}g
                  </Typography>
                </Box>
              </Box>

              {/* Available Colors */}
              {product.availableColors && product.availableColors.length > 0 && (
                <Box mb={2}>
                  <Typography variant="caption" color={colors.grey[400]} mb={1} display="block">
                    Available Colors
                  </Typography>
                  <Box display="flex" gap={0.5} flexWrap="wrap">
                    {product.availableColors.slice(0, 3).map((color) => (
                      <Chip
                        key={color}
                        label={color.replace("_", " ")}
                        size="small"
                        sx={{
                          bgcolor: colors.blueAccent[600],
                          color: "white",
                          fontSize: "0.7rem",
                          height: 24,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    ))}
                    {product.availableColors.length > 3 && (
                      <Chip
                        label={`+${product.availableColors.length - 3}`}
                        size="small"
                        sx={{
                          bgcolor: colors.grey[600],
                          color: "white",
                          fontSize: "0.7rem",
                          height: 24,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              )}

              {/* Price Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: "auto",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: colors.greenAccent[400],
                      fontSize: "1.3rem",
                    }}
                  >
                    ₹{product.discountPrice || product.price}
                  </Typography>
                  {product.price && product.discountPrice && product.price > product.discountPrice && (
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: colors.grey[400],
                        fontSize: "0.9rem",
                      }}
                    >
                      ₹{product.price}
                    </Typography>
                  )}
                </Box>
                
                {/* Stock Status Badge */}
                <Chip
                  label="In Stock"
                  size="small"
                  sx={{
                    bgcolor: colors.greenAccent[700],
                    color: colors.greenAccent[100],
                    fontWeight: 600,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: colors.grey[400],
          }}
        >
          <Typography variant="h4" mb={2}>
            📦
          </Typography>
          <Typography variant="h6" mb={1}>
            No Products Found
          </Typography>
          <Typography variant="body2" mb={3}>
            Start by adding your first product to the inventory
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
            }}
          >
            Add First Product
          </Button>
        </Box>
      )}

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
          sx={{ 
            width: "100%",
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Product;