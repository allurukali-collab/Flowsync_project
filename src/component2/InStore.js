import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const actions = [
  {
    id: 1,
    title: 'Reallocation of 2,000 Units to Walmart Arlington where Sell-through rate : 200 units per day,Stock level : 1000 units',
    grossMargin: '44%',
    grossColor: 'Green',
    mitigation: '$8,000',
  },
  {
    id: 2,
    title: '15% Clearance on 1,600 Units at Walmart Dallas DC',
    grossMargin: '35%',
    grossColor: 'green',
    mitigation: '$4,240'
  },
];

const actions2 = [
    {
    id: 1,
    title: 'Sell 2,400 units to Liquidation.com at 50% discount.',
    grossMargin: '20% ($2,400)',
    grossColor: 'Green',
    mitigation: '$12,000',
  },
  {
    id: 2,
    title: 'Donation with Tax Credit in Goof360.com channel',
    grossMargin: '-400% (-$7,680)',
    grossColor: 'red',
    mitigation: '$1,920'
  },
]


const InStore = ({ onClose }) => {
  return (
<Box sx={{ px: { xs: 0.5, sm: 1, md: 2 },
    py: { xs: 1, sm: 2,md: 2},
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
    m: {xs:'1px auto', md:'10px auto'}
}}>
    {/* <Button
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
  </Button> */}
  
  <Typography
    variant="h5"
    fontWeight="bold"
    sx={{ color: '#1A1A1A',fontSize:{xs:15,md:20},marginRight:' auto' }}
  >
    In-Store/Shelf Replenishment & Display
  </Typography>
    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.40)',
        p: 1,
        borderRadius: 2,
        maxWidth: 1100,
        m: '10px auto'
      }}
    >
      <Grid container justifyContent="space-between" alignItems="flex-start" spacing={0} columnGap={{ xs: 0.5, sm: 1, md: 2 }} wrap={{ xs: 'nowrap', sm: 'wrap' }} mb={1} >
        <Grid item md={9}>
          <Box display="flex" alignItems="center" mb={0.5} flexWrap="wrap">
            <Avatar sx={{ bgcolor: 'orange', width: { xs: 28, sm: 30 },height: { xs: 28, sm: 30 }, mr: 1,mb: { xs: 0.5, sm: 0 } }}>
              <PriorityHighIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: 'white' }} />
            </Avatar>
            <Typography variant="h6" color="black" fontWeight="bold" sx={{ fontSize: { xs: '15px', sm: '16px', md: '18px' } }}>
              ISSUE 1: Lower Sell-Through Rate
            </Typography>
          </Box>

          <Typography variant="body1" gutterBottom sx={{ml: { xs: 0, sm: 4 },fontSize: { xs: '10px', sm: '13px', md: '14px' },}}>
            <b>3,600 units</b> of WAFR123 - Honey Butter Wafers is not selling due to Sell-through rate against the plan in the Walmart Dallas.
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ml: { xs: 0, sm: 4 },fontSize: { xs: '10px', sm: '11px', md: '12px' },}}>
            Shelf life remaining:<b>22 days.</b><br />
             Sell-through rate at DC :<b> 14 Units</b> per day<br/>
             Cost Price :<b> $5</b>
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
              mx: 'auto',
              mr: {xs: 10, md:1,sm: 5}
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '10px', sm: '12px', md: '14px' }}}>
              Potential Loss Mitigation:
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{fontSize: { xs: '15px', sm: '17px', md: '19px' }}}>
              $12,240
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box display="flex" alignItems="center" >
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
        <Typography variant="h6" sx={{ color: 'black',fontSize: { xs: '15px', sm: '16px', md: '18px' } }} fontWeight="bold">
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
      width: 'auto',
    }}
  >
    <Grid container spacing={2} alignItems="center">
      {/* Left Column: ID + Title */}
      <Grid item xs={12} md={4}>
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              bgcolor: '#faefcdff',
              fontWeight: 'bold',
              color: '#F9A825',
              width:{xs:23,md: 28},
              height:{xs:23,md: 28},
              fontSize: 12,
              mr: 2
            }}
          >
            {item.id.toString().padStart(2, '0')}
          </Avatar>
          <Typography
            fontWeight="500"
            sx={{
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              maxWidth: { xs: 220, md: 460 },
              fontSize: { xs: 10, md: 13 },
              lineHeight: 1.2
            }}
          >
            {item.title}
          </Typography>
        </Box>
      </Grid>

      {/* Center Column: Margin + Mitigation */}
      <Grid item xs={12} md={5}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              variant="body2"
              fontWeight="500"
              color="text.secondary"
              sx={{ fontSize: { xs: 10, md: 13 } }}
            >
              Margin Variance:
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                color: item.grossColor,
                fontSize: { xs: 10, md: 13 }
              }}
            >
              {item.grossMargin}
            </Typography>
          </Grid>
          <Grid item xs={6}>
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
              sx={{ fontSize: { xs: 10, md: 13 } }}
            >
              {item.mitigation}{' '}
              {item.extra && (
                <span style={{ fontWeight: 400 }}>{item.extra}</span>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* Right Column: Action Button */}
      <Grid item xs={12} md={3}>
        <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
          <Button
            variant="outlined"
            sx={{
              backgroundColor: '#faebc4ff',
              border: '1px solid #E0E0E0',
              borderRadius: '25px',
              px: 1.5,
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
                height: 22
              }}
            >
              <SendIcon sx={{ fontSize: 14, color: '#FBC02D' }} />
            </Avatar>
            <Typography
              variant="body2"
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
  </Paper>
))}
</Box>

<Box
  sx={{
    background: 'rgba(255, 255, 255, 0.40)',
    p: {xs:1,md:2},
    borderRadius: 2,
    maxWidth: 1100,
  }}
>
  <Grid
    container
    justifyContent="space-between"
    alignItems="flex-start"
    spacing={0}
    columnGap={{ xs: 0.5, sm: 1, md: 2 }}
    wrap={{ xs: 'nowrap', sm: 'wrap' }}
    mb={1}
  >
    <Grid item xs={12} md={9}>
      <Box display="flex" alignItems="center" mb={0.5} flexWrap="wrap">
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
          ISSUE 2: Seasonal Overstock
        </Typography>
      </Box>

      <Typography
        variant="body1"
        gutterBottom
        sx={{
          ml: { xs: 0, sm: 4 },
          fontSize: { xs: '10px', sm: '13px', md: '14px' }
        }}
      >
        <b>2,400 </b>units of a seasonal item - Holiday Decor LED Easter Garland (SKU: HLD456)
        did not sell during the season.
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
          mr: {xs: 7, md:0.3,sm: 2},
          mx: 'auto',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: '10px', sm: '12px', md: '14px' } }}
        >
          Potential Loss Mitigation:
        </Typography>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: { xs: '15px', sm: '17px', md: '19px' } }}
        >
          $12,000
        </Typography>
      </Box>
    </Grid>
  </Grid>

  <Box display="flex" alignItems="center">
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
      sx={{ color: 'black', fontSize: { xs: '15px', sm: '16px', md: '18px' } }}
      fontWeight="bold"
    >
      Remediation
    </Typography>
  </Box>

  {actions2.map((item) => (
    <Paper
      key={item.id}
      elevation={1}
      sx={{
        p: { xs: 0.8, md: 1 },
        mb: 0.3,
        mt: 1,
        ml: { xs: 1, md: 4 },
        mr: { xs: 1, md: 0 },
        borderRadius: 2,
        backgroundColor: '#fafafa',
        width: 'auto'
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Left Column: ID + Title */}
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                bgcolor: '#faefcdff',
                fontWeight: 'bold',
                color: '#F9A825',
                width: {xs:23,md: 28},
                height: {xs:23,md: 28},
                fontSize: 12,
                mr: 2
              }}
            >
              {item.id.toString().padStart(2, '0')}
            </Avatar>
            <Typography
              fontWeight="500"
              sx={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                maxWidth: { xs: 220, md: 460 },
                fontSize: { xs: 10, md: 13 },
                lineHeight: 1.2
              }}
            >
              {item.title}
            </Typography>
          </Box>
        </Grid>

        {/* Center Column */}
        <Grid item xs={12} md={5}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
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
            </Grid>
            <Grid item xs={6}>
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
                sx={{ fontSize: { xs: 10, md: 13 } }}
              >
                {item.mitigation}{' '}
                {item.extra && <span style={{ fontWeight: 400 }}>{item.extra}</span>}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column: Button */}
        <Grid item xs={12} md={3}>
          <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            <Button
              variant="outlined"
              sx={{
                backgroundColor: '#faebc4ff',
                border: '1px solid #E0E0E0',
                borderRadius: '25px',
                px: 1.5,
                py: 0.5,
                textTransform: 'none',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  backgroundColor: '#edd8a4ff',
                  borderColor: '#D0D0D0'
                }
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#1A1A1A',
                  width: 22,
                  height: 22
                }}
              >
                <SendIcon sx={{ fontSize: 14, color: '#FBC02D' }} />
              </Avatar>
              <Typography
                variant="body2"
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
    </Paper>
  ))}
</Box>
</Box>
  );
};

export default InStore;
