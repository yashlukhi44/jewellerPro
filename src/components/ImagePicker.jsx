import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

const ImagePicker = ({ images = [], onChange, multiple = true, onRemove }) => (
  <Box display="flex" flexDirection="column" gap={1}>
    <Button variant="outlined" component="label">
      Upload Images
      <input
        type="file"
        accept="image/*"
        hidden
        multiple={multiple}
        onChange={onChange}
      />
    </Button>
    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
      {images.map((img, idx) => (
        <Box key={idx} position="relative">
          <img
            src={img}
            alt={`preview-${idx}`}
            style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 4, border: "1px solid #ccc" }}
          />
          {onRemove && (
            <IconButton
              size="small"
              onClick={() => onRemove(idx)}
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                background: "#fff",
                zIndex: 1,
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  </Box>
);

export default ImagePicker;
