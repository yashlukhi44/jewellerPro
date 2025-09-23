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

      {/* Image previews */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(90px, 1fr))"
        gap={2}
        width="100%"
        justifyItems="center"
      >
        {imageUrls.map((img, idx) => (
          <Box
            key={idx}
            position="relative"
            sx={{
              width: 90,
              height: 90,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
              border: `2px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
              alt={`preview-${idx}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {onRemove && (
              <Tooltip title="Remove">
                <IconButton
                  size="small"
                  onClick={() => onRemove(idx)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
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
