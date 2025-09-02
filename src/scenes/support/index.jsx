import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatIcon from "@mui/icons-material/Chat";
import { tokens } from "../../theme";

const Support = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" mb={3} color={colors.grey[100]}>
        Support Center
      </Typography>

      {/* Main Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 3,
        }}
      >
        {/* Contact Form / Chat */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundColor: colors.primary[400],
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" fontWeight="600" mb={2}>
            24/7 Support – Chat With Us
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Your Name"
              variant="outlined"
              sx={{ input: { color: colors.grey[100] } }}
            />
            <TextField
              fullWidth
              label="Your Email"
              type="email"
              variant="outlined"
              sx={{ input: { color: colors.grey[100] } }}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              variant="outlined"
              sx={{ textarea: { color: colors.grey[100] } }}
            />
            <Button
              variant="contained"
              startIcon={<ChatIcon />}
              sx={{
                backgroundColor: colors.greenAccent[600],
                "&:hover": { backgroundColor: colors.greenAccent[700] },
              }}
            >
              Start Chat / Send Message
            </Button>
          </Box>
        </Paper>

        {/* Contact Info */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundColor: colors.primary[400],
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" fontWeight="600" mb={2}>
            Contact Information
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <EmailIcon sx={{ color: colors.greenAccent[500] }} />
            <Typography color={colors.grey[100]}>
              support@yourcompany.com
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PhoneIcon sx={{ color: colors.greenAccent[500] }} />
            <Typography color={colors.grey[100]}>+91 98765 43210</Typography>
          </Box>
        </Paper>
      </Box>

      {/* FAQs */}
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 3,
          backgroundColor: colors.primary[400],
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" fontWeight="600" mb={2}>
          Frequently Asked Questions
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How can I reset my password?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Go to settings → account → reset password. You’ll receive an email
              with reset instructions.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Where can I check my order status?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              You can track your order in the “My Orders” section of your
              dashboard.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How do I contact customer care?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              You can email us at{" "}
              <strong>support@yourcompany.com</strong> or call{" "}
              <strong>+91 98765 43210</strong>.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
};

export default Support;
