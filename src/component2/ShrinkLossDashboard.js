import React, { useState } from 'react';
import {
  IconButton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import FilterAltIcon    from '@mui/icons-material/FilterAlt';
import CloseIcon        from '@mui/icons-material/Close';      // ← add this
import InStore          from './InStore';
import ReturnLogistics  from './ReturnLogistics';
import { useNavigate }  from 'react-router-dom';


const ShrinkLossDashboard = () => {
  const [region, setRegion] = useState('');
  const [store, setStore] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [skuCategory, setSkuCategory] = useState('');
  const [shrinkCategory, setShrinkCategory] = useState('');
const navigate    = useNavigate();
  const [openReturn, setOpenReturn] = useState(false);

  const handleOpenReturn  = () => setOpenReturn(true);
  const handleCloseReturn = () => {
    setOpenReturn(false);
    navigate('/shrinklossdashboard');           // <- ensure URL is back to dashboard
  };

  // **in‑store modal** state & handlers (new)
  const [openInStore, setOpenInStore] = useState(false);
  const handleOpenInStore  = () => setOpenInStore(true);
  const handleCloseInStore = () => setOpenInStore(false);


const theme = useTheme();
  // true for screen width < 600px (xs breakpoint)
  const isMobile = useMediaQuery('(max-width:768px)');
  const processData = [
    { name: 'DC Inbound and Receiving', fail: 0, pass: 0, icon: '🏭' },
    { name: 'DC Storage Handling', fail: 0, pass: 0, icon: '📦' },
    { name: 'Transportation to a Store', fail: 0, pass: 0, icon: '🚛' },
    { name: 'Store Inbound and Receiving', fail: 0, pass: 0, icon: '🏪' },
    { name: 'Backroom Handling', fail: 0, pass: 0, icon: '📋' },
    { name: 'In-Store/Shelf Replenishment & Display', fail: 2, pass: 0, icon: '🛒' },
    { name: 'Checkout & POS', fail: 0, pass: 0, icon: '💳' },
    { name: 'Returns and Reverse Logistics', fail: 1, pass: 0, icon: '↩' }
  ];

  const shrinkHotspots = [
    { rank: 1, name: 'Evergreen Market, Bellevue', value: '$24,756.78' },
    { rank: 2, name: 'Cascade Fresh Mart, Capitol Hill', value: '$13,349.90' },
    { rank: 3, name: 'Soundview Grocers, Northgate', value: '$12,683.40' }
  ];

  const rootCauses = [
    { cause: 'Merchandise Return', value: '$24,756.78' },
    { cause: 'Produce near expiry', value: '$10,842.78' },
    { cause: 'Missed scan pattern', value: '$62,083.40' }
  ];

  const quickActions = [
    { 
      text: '$12.000k salvage risk flagged in Seattle #421', 
      subtitle: 'Dairy | Evergreen Market, Bellevue',
      type: 'warning' 
    },
    { 
      text: '$30k at risk; 25 days shelf life left #827',
      subtitle: 'Frozen Poultry | Cascade Fresh Mart, Capitol Hill',
      type: 'alert' 
    },
    { 
      text: 'Return cost / salvage for SKU 8832A',
      subtitle: 'Electronics | Dallas DC | Return Analysis',
      type: 'info' 
    }
  ];

  const stores = [
    'Store #3345 - OR',
    'Store #5340 - PA', 
    'Store #4821 - NJ',
    'Store #8743 - NY',
    'Store #5342 - CT',
    'Store #5235 - IL',
    'Store #5531 - MN',
    'Store #7582 - OH',
    'Store #4710 - WI'
  ];

  const styles = {
    dashboard: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8f9fa',
      backgroundImage:'none',
      width: '100%',                // full‐width
    //minHeight: '100vh',           // at least the full viewport tall
    boxSizing: 'border-box', 
    },
    alertBanner: {
      backgroundColor: '#fff0bdff',
      borderLeft: '4px solid #ffc107',
      marginTop:'4px',
      padding: '6px 6px',
      fontSize: '12px',
      color: '#856404',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      width: '97%',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxShadow: '0 3px 4px rgba(0,0,0,0.1)',
    },
    filtersSection: {
      backgroundColor: 'white',
      padding: '7px 7px',
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      justifyContent: 'flex-end',
      
    },
    filtersRow: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    filterSelect: {
      backgroundColor: '#4a5568',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '25px',
      fontSize: '14px',
      minWidth: '120px',
    },
    applyBtn: {
      backgroundColor: '#4a5568',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    clearBtn: {
      backgroundColor: 'transparent',
      color: '#a0aec0',
      border: '1px solid #a0aec0',
      padding: '8px 16px',
      borderRadius: '25px',
      fontSize: '14px',
      cursor: 'not-allowed'
    },
    mainContent: {
      display: 'flex',
      gap: '20px',
      padding: '15px',
     flexWrap:'wrap',
     // height: 'calc(100vh - 140px)'
     height:'auto'
    },
    leftColumn: {
      flex: 0.7,
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontWeight: 'bold',
    },
    processList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px'
    },
    processItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #e9ecef'
    },
    processIcon: {
      width: '40px',
      height: '40px',
      backgroundCuserolor: '#f8f9fa',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '12px',
      fontSize: '18px'
    },
    processName: {
      flex: 1,
      fontSize: '14px',
      color: '#495057'
    },
    processCounts: {
      display: 'flex',
      gap: '8px'
    },
    count: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 500
    },
    countFail: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    },
    countFailActive: {
      backgroundColor: '#dc3545',
      color: 'white'
    },
    countPass: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
  rightColumn: {
    flex: 1.4
  },
  rightGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    height: '100%'
  },
  topRow: {
    display: 'flex',
    gap: '16px',
    height: '200px'
  },

  // MAP STYLES
  mapContainer: {
    flex: 0.93,
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapPlaceholder: {
    textAlign: 'center'
  },
  mapIcon: {
    fontSize: '40px',
    marginBottom: '8px'
  },
  mapText: {
    fontSize: '12px',
    color: '#6c757d',
    margin: '8px 0'
  },
  mapVisual: {
    width: '60px',
    height: '40px',
    background: 'linear-gradient(45deg, #e6fffa, #b2dfdb)',
    borderRadius: '8px',
    margin: '12px auto'
  },

  // SHRINK IMPACT STYLES
  shrinkImpact: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    marginBottom: '12px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#495057',
    marginTop:'10px'
  },
  shrinkData: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  shrinkAmount: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#dc3545'
  },
  shrinkPercentage: {
    fontSize: '16px',
    color: '#6c757d'
  },
  shrinkIcon: {
    fontSize: '24px'
  },
  shrinkDetails: {
    fontSize: '12px',
    color: '#6c757d'
  },

  // BOTTOM ROW
  bottomRow: {
    display: 'flex',
    gap: '16px',
    flex: 1
  },
  leftBottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1
  },

  // HOTSPOTS
  hotspotSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  hotspotsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  hotspotItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
    fontSize: '14px'
  },
  hotspotRank: {
    color: '#ffc107',
    fontWeight: 'bold',
    minWidth: '20px'
  },
  hotspotName: {
    flex: 1,
    color: '#495057'
  },
  hotspotValue: {
    fontWeight: 'bold',
    color: '#dc3545'
  },

  // ROOT CAUSES
  rootCauses: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  causesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  causeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    borderBottom: '1px solid #f8f9fa'
  },
  causeName: {
    color: '#495057'
  },
  causeValue: {
    fontWeight: 'bold',
    color: '#dc3545'
  },

  // QUICK ACTIONS
  quickActions: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  actionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  actionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    borderRadius: '4px',
    backgroundColor: '#f5f0f0ff'
  },
  actionIcon: {
    fontSize: '16px'
  },
  actionContent: {
    flex: 1
  },
  actionText: {
    fontSize: '13px',
    color: '#495057',
    fontWeight: 500
  },
  actionSubtitle: {
    fontSize: '12px',
    color: '#6c757d',
    marginTop: '2px'
  },
  actionToggle: {
    marginLeft: 'auto'
  },

  // TOGGLE SWITCH
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '40px',
    height: '20px'
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    transition: '.4s',
    borderRadius: '20px'
  }
  };
  

  return (
    <div style={{
        ...styles.dashboard,
        // ON DESKTOP: fill viewport exactly & hide any overflow
        height: isMobile ? 'auto' : '100vh',
        overflowY: isMobile ? 'auto' : 'hidden',
      }}>

      {/* Filters Section */}
      <div style={{
    ...styles.filtersSection,
    display: 'flex',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    gap: isMobile ? '8px' : '16px',
    alignItems: 'center'
  }}>
        <IconButton sx={{ color: 'black', mr:'auto' }}>
        <ArrowBackIosIcon />
        </IconButton>
        <div style={{
      ...styles.filtersRow,
      display: 'flex',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      gap: isMobile ? '8px' : '12px',
      alignItems: 'center'
    }}>
        <IconButton sx={{ color: 'black'}}>
        <FilterAltIcon />
        </IconButton>          
          <select 
            value={region} 
            onChange={(e) => setRegion(e.target.value)}
            style={{
        ...styles.filterSelect,
        flex: '1 1 160px',
        minWidth: '120px'
      }}
          >
            <option value="">Region</option>
            <option value="west">West</option>
            <option value="east">East</option>
            <option value="central">Central</option>
          </select>
          
          <select 
            value={store} 
            onChange={(e) => setStore(e.target.value)}
            style={{
        ...styles.filterSelect,
        flex: '1 1 150px',
        minWidth: '120px'
      }}
          >
            <option value="">Store</option>
            {stores.map((storeOption, index) => (
              <option key={index} value={storeOption}>{storeOption}</option>
            ))}
          </select>
          
          <select 
            value={timePeriod} 
            onChange={(e) => setTimePeriod(e.target.value)}
            style={{...styles.filterSelect,flex: '1 1 200px',
        minWidth: '140px'}}
          >
            <option value="">Time Period</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          
          <select 
            value={skuCategory} 
            onChange={(e) => setSkuCategory(e.target.value)}
            style={{...styles.filterSelect,flex: '1 1 200px',
        minWidth: '140px'}}
          >
            <option value="">SKU Category</option>
            <option value="dairy">Dairy</option>
            <option value="produce">Produce</option>
            <option value="meat">Meat</option>
          </select>
          
          <select 
            value={shrinkCategory} 
            onChange={(e) => setShrinkCategory(e.target.value)}
           style={{
        ...styles.filterSelect,
        flex: '1 1 200px',
        minWidth: '140px'
      }}
          >
            <option value="">Shrink Category</option>
            <option value="damage">Damage</option>
            <option value="theft">Theft</option>
            <option value="expiry">Expiry</option>
          </select>
          
          <button style={{
        ...styles.applyBtn,
        flex: '1 1 120px',
        minWidth: '100px'
      }}
    >
      Apply
    </button>
    <button
      style={{
        ...styles.clearBtn,
        flex: '1 1 120px',
        minWidth: '100px'
      }}
      disabled
    >
      Close
    </button>
        </div>
      </div>

     {/* Alert Banner */}
      <div  style={{
    ...styles.alertBanner,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: isMobile ? 'center' : 'flex-start',
    textAlign: isMobile ? 'center' : 'left',
    gap: '8px'
  }}>
        <span>⚠</span>
        Mars is experiencing prices in frozen desserts and ice cream by 4% | Sales down in Fragrance by 2%
      </div>

      {/* Main Content */}
      <div  style={{
          ...styles.mainContent,
          // stack on mobile, row on tablet+/desktop
          flexDirection: isMobile ? 'column' : 'row',
          // let it grow/shrink naturally on small screens
          height: isMobile ? 'auto' : styles.mainContent.height,
          flexWrap: 'wrap',
        }}>
        {/* Left Column - Process List */}
        <div  style={{
            ...styles.leftColumn,
            // full width on mobile, 30% on larger
            flex: isMobile ? '1 1 100%' : '0.7',
            marginBottom: isMobile ? 16 : 0,
          }}>
          <div style={styles.processList}>
            {processData.map((process, index) => (
              <div key={index}style={{...styles.processItem,
                cursor: (
                  process.name === 'In-Store/Shelf Replenishment & Display' ||
                  process.name === 'Returns and Reverse Logistics'
                )
                  ? 'pointer'
                  : 'default'
              }}
              onClick={() => {
                if (process.name === 'In-Store/Shelf Replenishment & Display') {
                  handleOpenInStore();
                }
                if (process.name === 'Returns and Reverse Logistics') {
                  handleOpenReturn();
                }
              }}>
                <div style={styles.processIcon}>{process.icon}</div>
                <div style={styles.processName}>{process.name}</div>
                <div style={styles.processCounts}>
                  <span style={{
                    ...styles.count,
                    ...(process.fail > 0 ? styles.countFailActive : styles.countFail)
                  }}>
                    {process.fail}
                  </span>
                  <span style={{...styles.count, ...styles.countPass}}>
                    {process.pass}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

{/* Right Column */}
<div style={{
            ...styles.rightColumn,
            flex: isMobile ? '1 1 100%' : '1.4',
          }}>
  <div style={styles.rightGrid}>
    
    {/* Top Row: Map & Shrink Impact */}
    <div  style={{
                ...styles.topRow,
                flexDirection: isMobile ? 'column' : 'row',
                height: isMobile ? 'auto' : styles.topRow.height,
              }}>
      {/* Map Section */}
      <div style={styles.mapContainer}>
        <div style={styles.mapPlaceholder}>
          <div style={styles.mapIcon}>🗺</div>
          <p style={styles.mapText}>
            Homestrly WinHost (19 ct) is the new top selling SKU
          </p>
          <div style={styles.mapVisual}></div>
        </div>
      </div>

      {/* Shrink Impact Section */}
      <div style={styles.shrinkImpact}>
        <h3 style={styles.sectionTitle}>Total Shrink Impact (Real-time $ + Trend)</h3>
        <div style={styles.shrinkData}>
          <div style={styles.shrinkAmount}>$263,045</div>
          <div style={styles.shrinkPercentage}>8.3%</div>
          <div style={styles.shrinkIcon}>📉</div>
        </div>
        <div style={styles.shrinkDetails}>
          <div>Shrink % of Sales | Avg Shrink Over Time</div>
          <div style={{ marginTop: 8 }}>Issues: 2</div>
        </div>
      </div>
    </div>

    {/* Bottom Row: Hotspots, Root Causes & Quick Actions */}
    <div style={{
                ...styles.bottomRow,
                flexDirection: isMobile ? 'column' : 'row',
                height: isMobile ? 'auto' : '100%',
              }}>
      {/* Hotspots + Root Causes */}
      <div style={styles.leftBottom}>
        {/* Hotspots */}
        <div style={styles.hotspotSection}>
          <h3 style={styles.sectionTitle}>Shrink Loss Hotspots - Top 3 Stores</h3>
          <div style={styles.hotspotsList}>
            {shrinkHotspots.map((store) => (
              <div key={store.rank} style={styles.hotspotItem}>
                <span style={styles.hotspotRank}>{store.rank}</span>
                <span style={styles.hotspotName}>{store.name}</span>
                <span style={styles.hotspotValue}>{store.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Root Causes */}
        <div style={styles.rootCauses}>
          <h3 style={styles.sectionTitle}>Top 3 Root Causes by $ Impact</h3>
          <div style={styles.causesList}>
            {rootCauses.map((cause, index) => (
              <div key={index} style={styles.causeItem}>
                <div style={styles.causeName}>{cause.cause}</div>
                <div style={styles.causeValue}>{cause.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionsList}>
          {quickActions.map((action, index) => (
            <div key={index} style={styles.actionItem}>
              <div style={styles.actionIcon}>⚠</div>
              <div style={styles.actionContent}>
                <div style={styles.actionText}>{action.text}</div>
                <div style={styles.actionSubtitle}>{action.subtitle}</div>
              </div>
              <div style={styles.actionToggle}>
                <label style={styles.switch}>
                  <input type="checkbox" style={styles.switchInput} />
                  <span style={styles.slider}></span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
</div>

          </div>
          {/* modal dialog for returns */}
   <Dialog
        open={openReturn}
        onClose={handleCloseReturn}
        BackdropProps={{ sx:{ backdropFilter:'blur(6px)', backgroundColor:'rgba(0,0,0,0.3)' } }}
        PaperProps={{ sx:{ backgroundColor:'transparent', boxShadow:'none', overflow:'visible' } }}
        fullWidth maxWidth="lg"
      >
        <ReturnLogistics onClose={handleCloseReturn} />
      </Dialog>

      {/** In‑Store dialog **/}
      <Dialog
        open={openInStore}
        onClose={handleCloseInStore}
        scroll="paper" 
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(0,0,0,0.3)'
          }
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible'
          }
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
    sx={{
      backgroundColor: 'rgba(255,255,255,0.9)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
  >
    In‑Store/Shelf Replenishment & Display
    <IconButton size="small" onClick={handleCloseInStore}>
      <CloseIcon fontSize="small" />
    </IconButton>
  </DialogTitle>

  {/* this area scrolls */}
  <DialogContent
    dividers
    sx={{
      p: 0,
      maxHeight: '80vh',          // adjust so it never overflows viewport
      overflowY: 'auto',
      backgroundColor: 'rgba(255,255,255,0.9)'
    }}
  >
    <InStore onClose={handleCloseInStore} />          {/* extract the contents of your InStore box here */}
  </DialogContent>
</Dialog>

        </div>  
  );
};

export default ShrinkLossDashboard;