import React, { useState,useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  Typography,
  TextareaAutosize,
  IconButton,
  Dialog
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Breadcrumbs, Link } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link as RouterLink } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Navbar from './Navbar.js';

const AddBulletin = () => {
  const navigate = useNavigate();  
  const [payrollMonth, setPayrollMonth] = useState(dayjs());
  const [employeeType, setEmployeeType] = useState('');   
  const location = useLocation();
  const bulletinData = location.state?.bulletin || null;
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('quick');
  const [category, setCategory] = useState('');
  const [rank, setRank] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postedDate, setPostedDate] = useState('');
  const [hide, setHide] = useState(false);
  const [file, setFile] = useState(null);
  const [employeeFilter, setEmployeeFilter] = useState('All Employees');

  useEffect(() => {
  if (bulletinData) {
    setCategory(bulletinData.category || '');
    setTitle(bulletinData.title || '');
    setStartDate(dayjs().format('YYYY-MM-DD')); // Replace with real startDate if available
    setExpiryDate(dayjs().format('YYYY-MM-DD')); // Replace with real expiryDate if available
    setRank(bulletinData.rank || 0);
    setContent(bulletinData.content || '');
    // Add other fields if needed
  }
}, [bulletinData]);

  const [criteriaList, setCriteriaList] = useState([
  { id: Date.now(), field: '', condition: '' }
]);
   
  const handleAddCriteria = () => {
  setCriteriaList(prev => [...prev, { id: Date.now(), field: '', condition: '' }]);
};

  const handleRemoveCriteria = (id) => {
  setCriteriaList(prev => prev.filter(item => item.id !== id));
};

  return (
    <Box>
      <Navbar/>
    <Box sx={{width:'80%',margin:'0 auto',mt:'70px'}}>
            {/* Breadcrumbs */}
              <Breadcrumbs separator=">" sx={{ '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.4)' }}}>
                <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/welcome">Home</Link>
                <Link underline="hover" component={RouterLink} color="rgba(255,255,255,0.4)" to="/updateemp">Employee</Link>
                <Link underline="hover" component={RouterLink} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} to="/bulletin">Bulletin Board</Link>
                {/* <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Company Policies & Forms</span> */}
              </Breadcrumbs>
      
              {/* Filters */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 1 }}>
                  {/* Payroll Month Picker */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    px: 2,
                    borderRadius: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    width: '150px'
                  }}>
                    <DatePicker
                      views={['year', 'month']}
                      value={dayjs(payrollMonth, "MMM YYYY")}
                      onChange={(newValue) => {
                        const formatted = dayjs(newValue).format("MMM YYYY");
                        setPayrollMonth(formatted);
                      }}
                      slotProps={{
                        textField: {
                          variant: 'standard',
                          fullWidth: true,
                          InputLabelProps: { shrink: false },
                          InputProps: {
                            disableUnderline: true,
                            sx: {
                              fontSize: '12px',
                              color: '#fff',
                              '& .MuiSvgIcon-root': { color: '#fff' }
                            }
                          },
                          inputProps: {
                            style: {
                              fontSize: '12px',
                              padding: '6px 4px',
                              color: '#fff'
                            },
                            placeholder: ''
                          },
                        },
                      }}
                    />
                  </Box>
      
                  {/* Employee Type Dropdown */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    px: 2,
                    borderRadius: 1,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <GroupIcon sx={{ mr: 1, color: '#ddd' }} />
                    <Select
                      value={employeeType}
                      onChange={(e) => setEmployeeType(e.target.value)}
                      variant="standard"
                      disableUnderline
                      sx={{ color: '#fff', '& .MuiSelect-icon': { color: '#fff' } }}
                    >
                      <MenuItem value="No Options" disabled>No Options</MenuItem>
                    </Select>
                  </Box>
                </Box>
              </LocalizationProvider>    
    <Box p={1} sx={{backgroundColor:'rgba(255, 255, 255, 0.58)',border:'1px solid gray',borderRadius:'5px',width: { xs: '90vw', sm: '80vw', md: '70vw' },m:'20px auto'}}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1} >
        <Box flex={0.5} mr={2} color="white" >
          <InputLabel >Category</InputLabel>
          <Select
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="">----Select----</MenuItem>
            <MenuItem value="General">General</MenuItem>
            <MenuItem value="H&R Campaign">H&R Campaign</MenuItem>
            <MenuItem value="Notification">Notification</MenuItem>
          </Select>

          <Box mt={1}>
            <InputLabel>Start Date</InputLabel>
            <TextField fullWidth size="small" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Box>

          <Box mt={1}>
            <InputLabel>Title</InputLabel>
            <TextField fullWidth size="small" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Box>
        </Box>

        <Box flex={0.5} ml={2}>
          <InputLabel>Rank</InputLabel>
          <TextField fullWidth size="small" value={rank} onChange={(e) => setRank(e.target.value)} />

          <Box mt={1}>
            <InputLabel>Expiry Date</InputLabel>
            <TextField fullWidth size="small" type="date" value={expiryDate} onChange={(e) => {setExpiryDate(e.target.value); setPostedDate(e.target.value);}} />
          </Box>
        </Box>

    <Box flex={1} ml={2}>
       <Box mt={2}>
              <Checkbox checked={hide} onChange={(e) => setHide(e.target.checked)} /> Hide
          </Box>   
    </Box>       
      </Box>

      <Box mt={1}>
        <InputLabel>Content</InputLabel>
        <TextareaAutosize
          minRows={5}
          placeholder=""
          style={{ width: '50%', borderRadius: 4, borderColor: '#ccc', padding: 10,backgroundColor: 'rgba(255,255,255,0.4)' }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Box>

      <Box mt={1}>
        <InputLabel>Attachments</InputLabel>
        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
          component="label"
        >
          Upload File
          <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
        </Button>
        <Typography variant="caption" display="block" mt={1} fontSize="10px">
          Only PDF, XLS, XLSX, DOC, DOCX, TXT, PPT, PPTX, GIF, JPG, PNG files are accepted.
        </Typography>
      </Box>

      <Box mt={1} alignItems="center">
        <InputLabel>Employee Filter</InputLabel>
        <FormControl size="small">
          <Select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
          >
            <MenuItem value="All Employees">All Employees</MenuItem>
            <MenuItem value="HR Only">HR Only</MenuItem>
          </Select>
        </FormControl>
        {/* <IconButton color="primary" sx={{ ml: 1 }} onClick={() => setOpenFilterDialog(true)}>
          <AddIcon />
        </IconButton> */}
      </Box>

      <Box mt={1}>
        <Button variant="contained" sx={{ mr: 2 }}onClick={() => {
  const newBulletin = {
    id: bulletinData?.id || Date.now(),
    category,
    title,
    startDate,
    expiryDate,
    rank,
    content
  };

  const storedBulletins = JSON.parse(localStorage.getItem('bulletins') || '[]');

  let updatedBulletins;
  if (bulletinData) {
    // Update existing bulletin
    updatedBulletins = storedBulletins.map(b =>
      b.id === bulletinData.id ? newBulletin : b
    );
  } else {
    // Add new bulletin
    updatedBulletins = [...storedBulletins, newBulletin];
  }

  localStorage.setItem('bulletins', JSON.stringify(updatedBulletins));
  navigate('/bulletin');
}}> {bulletinData ? 'Update' : 'Save'}</Button>
        <Button variant="outlined" onClick={()=> navigate('/bulletin')}>Close</Button>
      </Box>
    </Box>
<Dialog open={openFilterDialog} onClose={() => setOpenFilterDialog(false)} fullWidth maxWidth="sm">
  <Box p={3} bgcolor="#fff">
    <Typography variant="h6" mb={2}>Employee Filter</Typography>

    {/* Filter Title + Shared Filter */}
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <TextField
        fullWidth
        size="small"
        placeholder="filter title"
        sx={{ mr: 2 }}
      />
      <FormControl>
        <Checkbox size="small" />
        <Typography variant="body2" component="span">Shared Filter</Typography>
      </FormControl>
    </Box>

    {/* Quick / Custom Tabs */}
    <Box display="flex" mb={2} borderBottom="1px solid #eee">
      <Button
        variant="text"
        sx={{ textTransform: 'none', color: activeTab === 'quick' ? '#000' : '#888', fontWeight: 500 }}
        onClick={() => setActiveTab('quick')}
      >
        Quick
      </Button>
      <Button
        variant="text"
        sx={{ textTransform: 'none', color: activeTab === 'custom' ? '#000' : '#888', ml: 2 }}
        onClick={() => setActiveTab('custom')}
      >
        Custom
      </Button>
    </Box>

    {/* Quick Tab */}
    {activeTab === 'quick' && (
      <>
        {/* Category Type */}
        <Box>
          <InputLabel sx={{ color: '#1a73e8', fontSize: 14,mb:0.5 }}>Category Type</InputLabel>
          
          <Box display="flex" alignItems="center" mt={1}>
            <TextField
              multiline
              minRows={5}
              sx={{ flex: 1, border: '1px solid #ccc', borderRadius: 1, mr: 2 }}
            />
            <Typography fontSize={24}>➡</Typography>
            <TextField
              multiline
              minRows={5}
              sx={{ flex: 1, border: '1px solid #ccc', borderRadius: 1, ml: 2 }}
            />
          </Box>
        </Box>

        {/* Employee Type & Status */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Box>
            <Typography fontWeight="bold" fontSize={14}>Employee Type:</Typography>
            <Box mt={1}>
              <FormControl>
                <Box display="flex" gap={2}>
                  <label><input type="radio" name="empType" /> All</label>
                  <label><input type="radio" name="empType" /> Current</label>
                  <label><input type="radio" name="empType" /> Resigned</label>
                </Box>
              </FormControl>
            </Box>
          </Box>

          <Box>
            <Typography fontWeight="bold" fontSize={14}>Employee Status:</Typography>
            <FormControl size="small" fullWidth sx={{ mt: 1 }}>
              <Select defaultValue="">
                <MenuItem value="">-----Select Status-----</MenuItem>
                <MenuItem value="probation">Probation</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="trainee">Trainee</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </>
    )}

    {/* Custom Tab */}
    {activeTab === 'custom' && (
<Box mt={2} p={2} border="1px solid #f4e1c5" borderRadius={2} bgcolor="#fdf7f2">
  {criteriaList.map((item, index) => (
    <Box
      key={item.id}
      p={2}
      bgcolor="#e9f7f7"
      borderRadius={1}
      mb={2}
      display="flex"
      gap={2}
      alignItems="center"
    >
      <FormControl fullWidth size="small">
        <Select value={item.field} displayEmpty>
          <MenuItem value="">-----</MenuItem>
          {/* Add more options here */}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <Select value={item.condition} displayEmpty>
          <MenuItem value="">-----</MenuItem>
          {/* Add more options here */}
        </Select>
      </FormControl>

      {criteriaList.length > 1 && (
        <IconButton onClick={() => handleRemoveCriteria(item.id)}>
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  ))}

  <Button variant="outlined" onClick={handleAddCriteria}>Add Criteria</Button>

  <Box mt={2} textAlign="center">
    <Button variant="outlined">Add Group</Button>
  </Box>
</Box>

    )}

    {/* Buttons */}
    <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
      <Button variant="contained" sx={{ bgcolor: '#3f51b5' }} onClick={() => setOpenFilterDialog(false)}>
        Save changes
      </Button>
      <Button variant="outlined" onClick={() => setOpenFilterDialog(false)}>
        Cancel
      </Button>
    </Box>
  </Box>
</Dialog>
    </Box>
    </Box>
  );
};

export default AddBulletin;
