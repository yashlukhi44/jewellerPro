import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Drawer,
  useTheme,
  Paper,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import axios from "axios";
import ImagePicker from "../../components/ImagePicker";

const baseUrl = "https://nobita.imontechnologies.in";

const ProductFormDrawer = ({ open, onClose, onSave, editData, fetchProducts }) => {
  const theme = useTheme();

  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [formData, setFormData] = useState({
    materialId: "",
    categoryId: "",
    subCategoryId: "",
    name: "",
    description: "",
    imageUrls: [],
    availableColors: [],
    netWeight: "",
    grossWeight: "",
    price: "",
    discountPrice: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch dropdowns
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
        console.error(err);
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch subcategories
  const fetchSubCategories = async (categoryId) => {
    try {
      const res = await axios.get(`${baseUrl}/api/subcategories/${categoryId}`);
      const data = res.data.data;
      setSubCategories(Array.isArray(data) ? data : data ? [data] : []);
    } catch {
      setSubCategories([]);
    }
  };

  // Set form data for edit
  useEffect(() => {
    if (editData) {
      setFormData({
        materialId: editData.materialId || "",
        categoryId: editData.categoryId || "",
        subCategoryId: editData.subCategoryId || "",
        name: editData.name || "",
        price: editData.price || "",
        discountPrice: editData.discountPrice || "",
        description: editData.description || "",
        netWeight: editData.netWeight || "",
        grossWeight: editData.grossWeight || "",
        imageUrls: editData.imageUrls || [],
        availableColors: editData.availableColors || [],
      });
      if (editData.categoryId) fetchSubCategories(editData.categoryId);
    } else {
      setFormData({
        materialId: "",
        categoryId: "",
        subCategoryId: "",
        name: "",
        description: "",
        discountPrice: "",
        price: "",
        netWeight: "",
        grossWeight: "",
        imageUrls: [],
        availableColors: [],
      });
      setSubCategories([]);
    }
    setErrors({});
  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...Array.from(files)],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "categoryId") {
      setFormData((prev) => ({ ...prev, subCategoryId: "" }));
      fetchSubCategories(value);
    }
  };

  const handleColorChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      availableColors: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleRemoveImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
    }));
  };

  // Validation
  const validateForm = () => {
    let tempErrors = {};

    if (!formData.materialId) tempErrors.materialId = "Material is required";
    if (!formData.categoryId) tempErrors.categoryId = "Category is required";
    if (!formData.subCategoryId) tempErrors.subCategoryId = "SubCategory is required";
    if (!formData.name.trim()) tempErrors.name = "Product name is required";
    if (!formData.description.trim()) tempErrors.description = "Description is required";
    if (!formData.netWeight) tempErrors.netWeight = "Net weight is required";
    if (!formData.grossWeight) tempErrors.grossWeight = "Gross weight is required";
    if (!formData.price) tempErrors.price = "Price is required";
    if (!formData.discountPrice) tempErrors.discountPrice = "Discount price is required";
    if (formData.availableColors.length === 0) tempErrors.availableColors = "Select at least one color";
    if (formData.imageUrls.length === 0) tempErrors.imageUrls = "At least one product image is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "imageUrls") {
          value.forEach((file) => formDataToSend.append("images", file));
        } else if (key === "availableColors") {
          value.forEach((color) => formDataToSend.append("availableColors", color));
        } else {
          formDataToSend.append(key, value);
        }
      });

      let savedProduct;

      if (editData && editData._id) {
        const res = await axios.put(
          `${baseUrl}/api/products/${editData._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        savedProduct = res.data?.data || res.data;
        onSave(savedProduct, true);
      } else {
        const res = await axios.post(`${baseUrl}/api/products`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        savedProduct = res.data?.data || res.data;
        onSave(savedProduct, false);
      }

      fetchProducts && fetchProducts();
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Paper
        elevation={6}
        sx={{
          width: 880,
          display: "flex",
          bgcolor: theme.palette.background.default,
        }}
      >
        {/* Form Side */}
        <Box
          component="form"
          onSubmit={handleSave}
          sx={{
            flex: 1.6,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#141b2d",
            borderRight: `1px solid ${theme.palette.divider}`,
            minWidth: 0,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              px: 3,
              py: 2,
              mb: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              {editData ? "Edit Product" : "Add Product"}
            </Typography>
          </Box>

          {/* Form Fields */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Material */}
            <TextField
              select
              label="Material"
              name="materialId"
              value={formData.materialId}
              onChange={handleChange}
              fullWidth
              error={!!errors.materialId}
              helperText={errors.materialId}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff", borderWidth: "2px" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
              }}
            >
              {materials.map((m) => (
                <MenuItem key={m._id} value={m._id}>
                  {m.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Category */}
            <TextField
              select
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              fullWidth
              error={!!errors.categoryId}
              helperText={errors.categoryId}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff", borderWidth: "2px" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
              }}
            >
              {categories.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            {/* SubCategory */}
            <TextField
              select
              label="SubCategory"
              name="subCategoryId"
              value={formData.subCategoryId}
              onChange={handleChange}
              fullWidth
              disabled={!formData.categoryId}
              error={!!errors.subCategoryId}
              helperText={errors.subCategoryId}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff", borderWidth: "2px" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
              }}
            >
              {subCategories.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Name */}
            <TextField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff", borderWidth: "2px" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
              }}
            />

            {/* Description */}
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={3}
              error={!!errors.description}
              helperText={errors.description}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff", borderWidth: "2px" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
              }}
            />

            {/* Net Weight */}
            <TextField
              label="Net Weight"
              name="netWeight"
              value={formData.netWeight}
              onChange={handleChange}
              fullWidth
              error={!!errors.netWeight}
              helperText={errors.netWeight}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff", borderWidth: "2px" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
              }}
            />

            {/* Gross Weight */}
            <TextField
              label="Gross Weight"
              name="grossWeight"
              value={formData.grossWeight}
              onChange={handleChange}
              fullWidth
              error={!!errors.grossWeight}
              helperText={errors.grossWeight}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff", borderWidth: "2px" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
              }}
            />

            {/* Price */}
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              error={!!errors.price}
              helperText={errors.price}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff", borderWidth: "2px" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
              }}
            />

            {/* Discount Price */}
            <TextField
              label="Discount Price"
              name="discountPrice"
              type="number"
              value={formData.discountPrice}
              onChange={handleChange}
              fullWidth
              error={!!errors.discountPrice}
              helperText={errors.discountPrice}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff", borderWidth: "2px" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
              }}
            />

            {/* Available Colors */}
            <FormControl fullWidth error={!!errors.availableColors}>
              <InputLabel sx={{ color: "#fff" }}>Available Colors</InputLabel>
              <Select
                multiple
                name="availableColors"
                value={formData.availableColors}
                onChange={handleColorChange}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fff",
                    borderWidth: "2px",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: { bgcolor: "#1e1e2f", color: "#fff" },
                  },
                }}
              >
                <MenuItem value="rose_gold">Rose Gold</MenuItem>
                <MenuItem value="yellow_gold">Yellow Gold</MenuItem>
              </Select>
              {errors.availableColors && (
                <Typography variant="caption" color="error">
                  {errors.availableColors}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.default,
            }}
          >
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: theme.palette.success.main, color: theme.palette.success.contrastText }}
              disabled={loading}
            >
              {editData ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>

        {/* Image Upload */}
        <Box sx={{ flex: 1, p: 2, bgcolor: "#0f1626" }}>
          <Typography variant="subtitle1" gutterBottom color="#fff">
            Product Images
          </Typography>
          <ImagePicker images={formData.imageUrls} onChange={handleChange} onRemove={handleRemoveImage} />
          {errors.imageUrls && (
            <Typography variant="caption" color="error">
              {errors.imageUrls}
            </Typography>
          )}
        </Box>
      </Paper>
    </Drawer>
  );
};

export default ProductFormDrawer;
