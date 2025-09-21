import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Modal,
  useTheme,
  Paper,
} from "@mui/material";
import axios from "axios";
import ImagePicker from "../../components/ImagePicker";

const baseUrl = "https://nobita.imontechnologies.in";

const ProductFormModal = ({
  open,
  onClose,
  onSave,
  editData,
  fetchProducts,
}) => {
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
    images: [],
    availableColors: [], // new
    netWeight: "",
    grossWeight: "",
    price: "",          // new
    discountPrice: "",  // new
  });
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
      } catch (err) {}
    };
    fetchDropdowns();
  }, []);

  // Fetch subcategories by category
  const fetchSubCategories = async (categoryId) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/subcategories/${categoryId}`
      );
      const data = res.data.data;
      setSubCategories(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
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
        description: editData.description || "",
        netWeight: editData.netWeight || "",
        grossWeight: editData.grossWeight || "",
        images: editData.images || [],
      });
      if (editData.categoryId) fetchSubCategories(editData.categoryId);
    } else {
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
    }
  }, [editData, open]);

  // File helper
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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

  // Remove image
  const handleRemoveImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // Save or update
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...formData };
      let savedProduct;

      if (editData && editData._id) {
        const res = await axios.put(
          `${baseUrl}/api/products/${editData._id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        savedProduct = res.data?.data || res.data;
        onSave(savedProduct, true);
      } else {
        const res = await axios.post(`${baseUrl}/api/products`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        savedProduct = res.data?.data || res.data;
        onSave(savedProduct, false);
      }
      fetchProducts && fetchProducts();
    } catch (err) {}
    finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="rgba(0,0,0,0.5)"
      >
        <Paper
          elevation={6}
          sx={{
            width: 880,
            borderRadius: 3,
            overflow: "hidden",
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
              {/** Material Select **/}
              <TextField
                select
                label="Material"
                name="materialId"
                value={formData.materialId}
                onChange={handleChange}
                fullWidth
                size="medium"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff", // ✅ input text color white
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.3)", // subtle white border
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255,255,255,0.7)", // ✅ label color white (slightly dimmed)
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff", // ✅ label stays white when focused
                  },
                }}
              >
                {materials.map((m) => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.name}
                  </MenuItem>
                ))}
              </TextField>

              {/** Category Select **/}
              <TextField
                select
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                fullWidth
                size="medium"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff", // ✅ input text color white
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.3)", // subtle white border
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255,255,255,0.7)", // ✅ label color white (slightly dimmed)
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff", // ✅ label stays white when focused
                  },
                }}
              >
                {categories.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>

              {/** SubCategory Select **/}
              <TextField
                select
                label="SubCategory"
                name="subCategoryId"
                value={formData.subCategoryId}
                onChange={handleChange}
                fullWidth
                size="medium"
                variant="outlined"
                disabled={!formData.categoryId}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff", // ✅ input text color white
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.3)", // subtle white border
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255,255,255,0.7)", // ✅ label color white (slightly dimmed)
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff", // ✅ label stays white when focused
                  },
                }}
              >
                {subCategories.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>

              {/** Text Fields **/}
              <TextField
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                size="medium"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff", // ✅ input text color white
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.3)", // subtle white border
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255,255,255,0.7)", // ✅ label color white (slightly dimmed)
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff", // ✅ label stays white when focused
                  },
                }}
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={3}
                size="medium"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff", // ✅ input text color white
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.3)", // subtle white border
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255,255,255,0.7)", // ✅ label color white (slightly dimmed)
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff", // ✅ label stays white when focused
                  },
                }}
              />
              <TextField
                label="Net Weight"
                name="netWeight"
                value={formData.netWeight}
                onChange={handleChange}
                fullWidth
                size="medium"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff", // ✅ input text color white
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.3)", // subtle white border
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255,255,255,0.7)", // ✅ label color white (slightly dimmed)
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff", // ✅ label stays white when focused
                  },
                }}
              />
              <TextField
                label="Gross Weight"
                name="grossWeight"
                value={formData.grossWeight}
                onChange={handleChange}
                fullWidth
                size="medium"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff", // ✅ input text color white
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.3)", // subtle white border
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255,255,255,0.7)", // ✅ label color white (slightly dimmed)
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff", // ✅ label stays white when focused
                  },
                }}
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                size="medium"
                variant="outlined"
              />

              <TextField
                label="Discount Price"
                name="discountPrice"
                type="number"
                value={formData.discountPrice}
                onChange={handleChange}
                fullWidth
                size="medium"
                variant="outlined"
              />
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
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.divider,
                  "&:hover": { bgcolor: theme.palette.action.hover },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: theme.palette.success.main,
                  color: theme.palette.success.contrastText,
                  "&:hover": { bgcolor: theme.palette.success.dark },
                }}
                disabled={loading}
              >
                {editData ? "Update" : "Save"}
              </Button>
            </Box>
          </Box>

          {/* Image Picker Side */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              py: 4,
              px: 2,
              minWidth: 240,
              bgcolor: theme.palette.background.default,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              mb={2}
              color={theme.palette.primary.main}
            >
              Product Images
            </Typography>
            <ImagePicker
              images={formData.images}
              onChange={handleChange}
              onRemove={handleRemoveImage}
              multiple
            />
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default ProductFormModal;
