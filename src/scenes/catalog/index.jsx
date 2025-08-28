import { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Modal,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { mockDataInvoices } from "../../data/mockData";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";

const Catalog = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(mockDataInvoices); // replace with catalog data
  const [formData, setFormData] = useState({
    material: "",
    category: "",
    subCategory: "",
    name: "",
    description: "",
    image: null,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddItem = () => {
    const newItem = {
      id: rows.length + 1,
      name: formData.name,
      description: formData.description,
      material: formData.material,
      category: formData.category,
      subCategory: formData.subCategory,
      image: formData.image ? URL.createObjectURL(formData.image) : "",
    };
    setRows([...rows, newItem]);
    handleClose();
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) =>
        params.row.image ? (
          <img
            src={params.row.image}
            alt={params.row.name}
            style={{ width: 50, height: 50, borderRadius: 8 }}
          />
        ) : (
          "No Image"
        ),
    },
    { field: "name", headerName: "Item Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary">
            <Visibility />
          </IconButton>
          <IconButton color="secondary">
            <Edit />
          </IconButton>
          <IconButton color="error">
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" m="20px">
  <Header title="CATALOG" subtitle="Catalog Management Screen" />

  <Button
    variant="contained"
    color="secondary"
    startIcon={<Add />}
    onClick={handleOpen}
  >
    Add New Item
  </Button>
</Box>


      {/* Modal for Add Item */}
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
          <Typography variant="h6">Add New Item</Typography>

          <TextField
            select
            label="Material"
            name="material"
            value={formData.material}
            onChange={handleChange}
          >
            {["Silver", "Gold", "Platinum"].map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {["Kids", "Men", "Women"].map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Sub-Category"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
          >
            {formData.category === "Men" &&
              ["Rings", "Bracelet", "Chain", "Pendant", "Stones"].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            {formData.category === "Women" &&
              [
                "Ring",
                "Bracelet",
                "Earrings",
                "Chain",
                "Haar",
                "Chudi",
              ].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            label="Item Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />

          <Button variant="outlined" component="label">
            Upload Image
            <input type="file" hidden name="image" onChange={handleChange} />
          </Button>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleAddItem}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Items Grid */}
      <Box mt={3} height="70vh" sx={{ "& .MuiDataGrid-root": { border: "none" } }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Catalog;
