import React from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import { Delete } from "@mui/icons-material";

const ImagePicker = ({ images = [], onChange, multiple = true, onRemove }) => {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" gap={1} alignItems="center">
      {/* Upload button */}
      <Button
        variant="contained"
        component="label"
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          mb: 2,
          "&:hover": {
            bgcolor: theme.palette.primary.dark,
          },
          borderRadius: 2,
          boxShadow: 2,
          fontWeight: 700,
          px: 3,
          py: 1.2,
          letterSpacing: 1,
        }}
      >
        UPLOAD IMAGES
        <input
          type="file"
          accept="image/*"
          hidden
          multiple={multiple}
          onChange={onChange}
        />
      </Button>

      {/* Preview images */}
      <Box display="flex" flexWrap="wrap" gap={2} mt={1} justifyContent="center">
        {images.map((img, idx) => (
          <Box
            key={idx}
            position="relative"
            sx={{
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
              p: 1.2,
              boxShadow: 3,
              border: `2px solid ${theme.palette.divider}`,
              minWidth: 80,
              minHeight: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={img}
              alt={`preview-${idx}`}
              style={{
                width: 64,
                height: 64,
                objectFit: "cover",
                borderRadius: 8,
                border: `2px solid ${theme.palette.primary.main}`,
                background: theme.palette.background.default,
                boxShadow: theme.shadows[2],
              }}
            />
            {onRemove && (
              <IconButton
                size="small"
                onClick={() => onRemove(idx)}
                sx={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: theme.palette.error.main,
                  color: theme.palette.error.contrastText,
                  zIndex: 1,
                  boxShadow: 2,
                  "&:hover": { background: theme.palette.error.dark },
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
};

export default ImagePicker;
