import React from "react";
import { Box, Button, IconButton, useTheme, Tooltip } from "@mui/material";
import { Delete, AddPhotoAlternate } from "@mui/icons-material";

const ImagePicker = ({ imageUrls = [], onChange, multiple = true, onRemove }) => {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      {/* Upload button */}
      <Button
        variant="contained"
        component="label"
        startIcon={<AddPhotoAlternate />}
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontWeight: 600,
          px: 3,
          py: 1,
          borderRadius: 2,
          boxShadow: 3,
          "&:hover": {
            bgcolor: theme.palette.primary.dark,
          },
        }}
      >
        Upload Images
        <input
          type="file"
          accept="image/*"
          hidden
          multiple={multiple}
          onChange={onChange}
        />
      </Button>

      {/* Masonry-like grid with CSS only */}
      <Box
        sx={{
          columnCount: { xs: 2, sm: 3, md: 4 }, // responsive columns
          columnGap: "16px",
          width: "100%",
        }}
      >
        {imageUrls.map((img, idx) => (
          <Box
            key={idx}
            sx={{
              position: "relative",
              mb: 2,
              breakInside: "avoid", // important for masonry
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
              border: `2px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <img
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
              alt={`preview-${idx}`}
              style={{
                width: "100%",
                display: "block",
                borderRadius: "8px",
              }}
            />
            {onRemove && (
              <Tooltip title="Remove">
                <IconButton
                  size="small"
                  onClick={() => onRemove(idx)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: theme.palette.error.main,
                    color: theme.palette.error.contrastText,
                    boxShadow: 2,
                    "&:hover": {
                      background: theme.palette.error.dark,
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ImagePicker;
