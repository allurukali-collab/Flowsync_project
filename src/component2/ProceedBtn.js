import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  IconButton,
  Breadcrumbs, 
  Link as MuiLink 
} from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import Header from "./Header";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PublicIcon from "@mui/icons-material/Public";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from 'react-router-dom';

export default function ProceedBtn() {
  // sample counts; replace with your real data
    const navigate = useNavigate();
  const partA = { pending: 18, uploaded: 0 };
  const partB = { pending: 18, uploaded: 0 };
  const portal = { pending: 0, published: 0 };
  const email  = { pending: 0, emailed: 0 };

  return (
    <>
    <Header/>
     {/* Breadcrumbs */}
                   <Box sx={{ p: 2, bgcolor: 'rgba(10,20,40,0.7)' }}>
                     <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.5)' }}}>
                       <MuiLink component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                         Home
                       </MuiLink>
                       <MuiLink component={RouterLink} to="/updatepayroll" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                         Payroll
                       </MuiLink>
                       <MuiLink component={RouterLink} to="/form16" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                         Form 16
                       </MuiLink>
                       <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            Proceed
                       </Typography>
                     </Breadcrumbs>
                   </Box>
                   
    <Box sx={{ p: { xs: 1, md: 3 }, display: "flex", gap: 3 }}>
      {/* Left Column: Two Action Cards */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Info Banner */}
        <Box
          sx={{
            bgcolor: "#FEF7E0",
            border: "1px solid #F5D6A5",
            borderRadius: 1,
            p: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <InfoOutlinedIcon color="action" />
          <Typography>
            Click on Generate to upload Part A and Part B
          </Typography>
        </Box>

        {/* Card 1: Form 16 Generation */}
        <Box
          sx={{
            display: "flex",
            border: "1px solid #E0E0E0",
            borderRadius: 1,
            overflow: "hidden",
            height: 100
          }}
        >
          {/* Icon side */}
          <Box
            sx={{
              bgcolor: "#4285F4",
              width: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <InsertDriveFileIcon sx={{ fontSize: 40, color: "white" }} />
            <Typography
              sx={{ ml: 1, color: "white", fontWeight: 600 }}
            >
              Form 16<br/>Generation
            </Typography>
          </Box>

          {/* Content side */}
          <Box sx={{ flex: 1, p: 2, position: "relative" }}>
            {/* Part A & Part B counts */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Typography
                  variant="subtitle2"
                  color="grey"
                >
                  Part A&nbsp;
                  <IconButton size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="body2" color="primary">
                  {partA.pending} Pending&nbsp;|&nbsp;
                  {partA.uploaded} Uploaded
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle2"
                  color="grey"
                >
                  Part B&nbsp;
                  <IconButton size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="body2" color="primary">
                  {partB.pending} Pending&nbsp;|&nbsp;
                  {partB.uploaded} Uploaded
                </Typography>
              </Grid>
            </Grid>

            {/* Generate Button */}
            <Button
             onClick={() => navigate('/form16/generateForm')} 
              variant="contained"
              color="primary"
              size="small"
              sx={{
                position: "absolute",
                bottom: 12,
                right: 16,
                textTransform: "none",
                px: 2
              }}
            >
              Generate Form 16
            </Button>
          </Box>
        </Box>

        {/* Card 2: Publish Form 16 */}
        <Box
          sx={{
            display: "flex",
            border: "1px solid #E0E0E0",
            borderRadius: 1,
            overflow: "hidden",
            height: 100
          }}
        >
          {/* Icon side */}
          <Box
            sx={{
              bgcolor: "#34A853",
              width: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <PublicIcon sx={{ fontSize: 40, color: "white" }} />
            <Typography
              sx={{ ml: 1, color: "white", fontWeight: 600 }}
            >
              Publish<br/>Form 16
            </Typography>
          </Box>

          {/* Content side */}
          <Box sx={{ flex: 1, p: 2, position: "relative" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Typography
                  variant="subtitle2"
                  color="grey"
                >
                  To Portal&nbsp;
                  <IconButton size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="body2" color="primary">
                  {portal.pending} Pending&nbsp;|&nbsp;
                  {portal.published} Published
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle2"
                  color="grey"
                >
                  Via Email&nbsp;
                  <IconButton size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="body2" color="primary">
                  {email.pending} Pending&nbsp;|&nbsp;
                  {email.emailed} Emailed
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      {/* Right Column: CURRENT SETTINGS */}
      <Box
        sx={{
          width: 320,
          border: "1px solid #E0E0E0",
          borderRadius: 1,
          p: 2,
          bgcolor: "#fafafa",
          position: "sticky",
          top: 16,
          alignSelf: "flex-start"
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          CURRENT SETTINGS
        </Typography>

        <Typography variant="subtitle2" color="textSecondary">
          Part B Configuration
        </Typography>
        <Typography>✖ Show With Previous Employment</Typography>
        <Typography>✔ Show With Form12BA</Typography>
        <Typography>✔ Show Annexure B</Typography>
        <Typography>✖ Suppress Zero Tax</Typography>
        <Typography>✔ Enable GreytHR Part B Verification Form</Typography>

        <Box sx={{ my: 2 }} />

        <Typography variant="subtitle2" color="textSecondary">
          Form 16 Generation
        </Typography>
        <Typography>✔ Show Form16 Cover Page</Typography>
        <Typography>✔ Merge Part A and Part B</Typography>
        <Typography>✔ Use default appearance for the digital signature</Typography>
        <Typography>✖ Whether Form16 should be digitally signed</Typography>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SettingsIcon />}
          >
            Settings
          </Button>
        </Box>
      </Box>
    </Box>
    </>
  );
}
