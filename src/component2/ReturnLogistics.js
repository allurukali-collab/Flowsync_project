import React from 'react';
import {Box,Typography,Button,Grid,Paper,Avatar} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const actions = [
  {
    id: 1,
    title: 'Credit memo back to Duracell Inc. at 100% return value (RTV) of cost price',
    grossMargin: '0% ($0)',
    grossColor: 'black',
    mitigation: '$50,000',
    extra: '(100% recovery)'
  },
  {
    id: 2,
    title: 'Resale via BULQ.com (mixed electronics) at $9 per pack',
    grossMargin: '-11% (-$5,000)',
    grossColor: 'red',
    mitigation: '$45,000'
  },
  {
    id: 3,
    title: 'Donation to Chicago Homeless Shelters leading to Tax write-off of $2 per pack',
    grossMargin: '-400% (-$40,000)',
    grossColor: 'red',
    mitigation: '$10,000'
  }
];

const ReturnLogistics = ({ onClose }) => {
    

  return (
<Box
  sx={{
    px: { xs: 0.5, sm: 1, md: 2 },
    py: { xs: 1, sm: 2,md: 2 },
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    minHeight: '50vh',
    width: 'auto',
    maxWidth: {
    xs: '95vw',
    sm: '90vw',
    md: '80vw',
    lg: '900px',
    xl: '1000px'
    },
    boxSizing: 'border-box',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflowX: 'hidden', 
    m: '10px auto'
  }}
>

  <Button
    onClick={onClose} 
    sx={{
      position: 'absolute',
      top: 8,
      right: 8,
      minWidth: 'auto',
      padding: '4px',
      borderRadius: '50%',
      '&:hover': {
        backgroundColor: '#ddd'
      }
    }}
  >
    <CloseIcon sx={{ fontSize: 20, color: '#333' }} />
  </Button>

  <Typography
    variant="h5"
    fontWeight="bold"
    sx={{ color: '#1A1A1A',fontSize:{xs:15,md:20},marginRight:'auto' }}
  >
    Returns and Reverse Logistics
  </Typography>

    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.40)',
        p: 2,
        borderRadius: 2,
        maxWidth: 1100,
        m: '20px auto'
      }}
    >
      <Grid container justifyContent="space-between" alignItems="flex-start" spacing={0} columnGap={{ xs: 0.5, sm: 1, md: 2 }} wrap={{ xs: 'nowrap', sm: 'wrap' }} mb={1}>
<Grid item md={9}>
  {/* Title Row */}
  <Box
    display="flex"
    alignItems="center"
    mb={0.5}
    flexWrap="wrap"
  >
    <Avatar
      sx={{
        bgcolor: 'orange',
        width: { xs: 28, sm: 30 },
        height: { xs: 28, sm: 30 },
        mr: 1,
        mb: { xs: 0.5, sm: 0 }
      }}
    >
      <PriorityHighIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: 'white' }} />
    </Avatar>
    <Typography
      variant="h6"
      color="black"
      fontWeight="bold"
      sx={{ fontSize: { xs: '15px', sm: '16px', md: '18px' } }}
    >
      ISSUE: 1
    </Typography>
  </Box>

  {/* Main Description */}
  <Typography
    variant="body1"
    gutterBottom
    sx={{
      ml: { xs: 0, sm: 4 },
      fontSize: { xs: '10px', sm: '13px', md: '14px' },
      fontWeight: 500,
    }}
  >
    <b>20 units of Duracell Optimum AA Batteries (50-pack) in a 100 carton lot - size</b>
  </Typography>

  {/* Details */}
  <Typography
    variant="body2"
    color="text.secondary"
    gutterBottom
    sx={{
      ml: { xs: 0, sm: 4 },
      fontSize: { xs: '10px', sm: '13px', md: '14px' },
    }}
  >
    <b>Status:</b> Return Initiated <br />
    <b>Reason Code:</b> Return by Customer due to poor packaging <br />
    <b>Condition:</b> Units are unopened and within return window
  </Typography>
</Grid>


<Grid item xs="auto">
  <Box
    sx={{
      border: '2px dashed #ccc',
      p: 0.5,
      borderRadius: 1,
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      width: { xs: '98px', sm: '110px', md: '130px' },
      mx: 'auto', // Center on small screens,
      mr: 0.9
    }}
  >
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        fontSize: { xs: '10px', sm: '12px', md: '14px' }
      }}
    >
      Potential Loss Mitigation:
    </Typography>
    <Typography
      variant="h6"
      fontWeight="bold"
      sx={{
        fontSize: { xs: '15px', sm: '17px', md: '19px' }
      }}
    >
      $50,000
    </Typography>
  </Box>
</Grid>
</Grid>
      
<Box display="flex" alignItems="center" mt={1}>
  <Box
    sx={{
      backgroundColor: '#34A853',
      borderRadius: '50%',
      width: { xs: 24, sm: 28, md: 30 },
      height: { xs: 24, sm: 28, md: 30 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mr: 1
    }}
  >
    <LightbulbIcon sx={{ color: 'white', fontSize: { xs: 16, sm: 17, md: 18 } }} />
  </Box>
  <Typography
    variant="h6"
    fontWeight="bold"
    sx={{
      color: 'black',
      fontSize: { xs: '15px', sm: '16px', md: '18px' }
    }}
  >
    Remediation
  </Typography>
</Box>


{actions.map((item) => (
  <Paper
    key={item.id}
    elevation={1}
    sx={{
      p: { xs: 0.8, md: 1 },
      mb: 1,
      mt: 1,
      ml: { xs: 1, md: 4 },
      mr: { xs: 1, md: 0 },
      borderRadius: 2,
      backgroundColor: '#fafafa',
      width: 'auto'
    }}
  >
    <Grid container alignItems="center" justifyContent="space-between">
      <Grid item xs={12} md={9}>
        <Grid container alignItems="center" spacing={2}>
          {/* Title Section */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  bgcolor: '#faefcdff',
                  fontWeight: 'bold',
                  color: '#F9A825',
                  width: 28,
                  height: 28,
                  fontSize: 14,
                  mr: 2
                }}
              >
                {item.id.toString().padStart(2, '0')}
              </Avatar>
              <Typography
                fontWeight="bold"
                sx={{
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  maxWidth: { xs: 200, md: 400 },
                  fontSize: { xs: 10, md: 13 },
                  lineHeight: 1.2
                }}
              >
                {item.title}
              </Typography>
            </Box>
          </Grid>

          {/* Combined Row for xs screens */}
          <Grid item xs={12} md={6}>
            <Box
              display="flex"
              flexDirection={{ xs: 'row', md: 'row' }}
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
              pl={{ xs: 0, md: 4 }}
            >
              {/* Gross Margin */}
              <Box>
                <Typography
                  variant="body2"
                  fontWeight="500"
                  color="text.secondary"
                  sx={{ fontSize: { xs: 10, md: 13 } }}
                >
                  Gross Margin %:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: item.grossColor,
                    fontWeight: 'bold',
                    fontSize: { xs: 10, md: 13 }
                  }}
                >
                  {item.grossMargin}
                </Typography>
              </Box>

              {/* Loss Mitigation */}
              <Box>
                <Typography
                  variant="body2"
                  fontWeight="500"
                  color="text.secondary"
                  sx={{ fontSize: { xs: 10, md: 13 } }}
                >
                  Loss Mitigation:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: 10, md: 14 } }}
                >
                  {item.mitigation}{' '}
                  {item.extra && (
                    <span style={{ fontWeight: 400 }}>{item.extra}</span>
                  )}
                </Typography>
              </Box>

              {/* Action Button */}
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: '#faebc4ff',
                  border: '1px solid #E0E0E0',
                  borderRadius: '25px',
                  px: 1,
                  py: 0.5,
                  textTransform: 'none',
                  boxShadow: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    backgroundColor: '#edd8a4ff',
                    borderColor: '#D0D0D0',
                  }
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#1A1A1A',
                    width: 22,
                    height: 22,
                    flexShrink: 0
                  }}
                >
                  <SendIcon sx={{ fontSize: 14, color: '#FBC02D' }} />
                </Avatar>
                <Typography
                  varian
                  t="body2"
                  fontWeight="600"
                  color="black"
                  sx={{ fontSize: { xs: 11, md: 13 } }}
                >
                  Action
                </Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Paper>
))}
    </Box>
    </Box>
  );
};

export default ReturnLogistics;