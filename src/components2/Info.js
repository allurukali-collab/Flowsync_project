import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, IconButton, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Info = ({ employee }) => {
  const [currentEmployee, setCurrentEmployee] = useState(employee);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    gender: '',
    employeeImage: '',
    isActive: true,
    stManagerId: '',
  });
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCurrentEmployee(employee);
    setFormData({
      name: employee?.name || '',
      email: employee?.email || '',
      designation: employee?.designation || '',
      gender: employee?.gender || '',
      employeeImage: employee?.employeeImage || '',
      isActive: employee?.isActive ?? true,
      stManagerId: employee?.stManagerId || '',
    });
    setEditMode(false);
    setSaveMessage('');
    setSaveError('');
  }, [employee]);

  const safeValue = (value) => {
    return value !== null && value !== undefined && value !== "" ? value : "-";
  };

  const employeeName = safeValue(currentEmployee?.name);
  const employeeId = safeValue(currentEmployee?.employeeId);
  const employeeEmail = safeValue(currentEmployee?.email);
  const employeeGender = safeValue(currentEmployee?.gender);
  const employeeDesignation = safeValue(currentEmployee?.designation);

  const profileLetter =
    currentEmployee?.name && currentEmployee.name.length > 0
      ? currentEmployee.name.charAt(0).toUpperCase()
      : "E";

  const handleEditClick = () => {
    setEditMode(true);
    setSaveMessage('');
    setSaveError('');
  };

  const handleCancel = () => {
    setFormData({
      name: currentEmployee?.name || '',
      email: currentEmployee?.email || '',
      designation: currentEmployee?.designation || '',
      gender: currentEmployee?.gender || '',
      employeeImage: currentEmployee?.employeeImage || '',
      isActive: currentEmployee?.isActive ?? true,
      stManagerId: currentEmployee?.stManagerId || '',
    });
    setEditMode(false);
    setSaveMessage('');
    setSaveError('');
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!currentEmployee?.employeeId) {
      setSaveError('Employee ID missing. Please search employee again.');
      return;
    }

    try {
      setSaving(true);
      setSaveMessage('');
      setSaveError('');

      const token = localStorage.getItem('token');

      const requestBody = {
        name: formData.name,
        email: formData.email,
        designation: formData.designation,
        employeeImage: formData.employeeImage,
        gender: formData.gender,
        isActive: formData.isActive,
        stManagerId: formData.stManagerId ? Number(formData.stManagerId) : null,
      };

      const response = await fetch(`http://localhost:8080/api/employee/update/${currentEmployee.employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to save employee details');
      }

      const updatedEmployee = await response.json();

      setCurrentEmployee(updatedEmployee);
      setFormData({
        name: updatedEmployee?.name || '',
        email: updatedEmployee?.email || '',
        designation: updatedEmployee?.designation || '',
        gender: updatedEmployee?.gender || '',
        employeeImage: updatedEmployee?.employeeImage || '',
        isActive: updatedEmployee?.isActive ?? true,
        stManagerId: updatedEmployee?.stManagerId || '',
      });

      setEditMode(false);
      setSaveMessage('Employee details saved successfully.');
    } catch (error) {
      console.error('Save employee error:', error);
      setSaveError('Unable to save employee details. Please check backend is running.');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (label, value = '-', fieldName = null) => (
    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>{label}</Typography>

      {editMode && fieldName ? (
        <TextField
          size="small"
          fullWidth
          value={formData[fieldName] ?? ''}
          onChange={(e) => handleChange(fieldName, e.target.value)}
          variant="standard"
          sx={{
            input: { color: 'white', fontWeight: 500 },
            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.4)' },
            '& .MuiInput-underline:hover:before': { borderBottomColor: 'white' },
            '& .MuiInput-underline:after': { borderBottomColor: '#2196f3' },
          }}
        />
      ) : (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{safeValue(value)}</Typography>
      )}
    </Grid>
  );

  const Section = ({ title, children, color = '#2196f3', editable = false }) => (
    <Paper sx={{ p: 2, mb: 1, borderRadius: 1, bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', color: 'white' }} elevation={0}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ borderLeft: `4px solid ${color}`, pl: 1 }}>{title}</Typography>
        {editable && (
          <IconButton size="small" sx={{ color: 'white' }} onClick={handleEditClick}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Grid container spacing={2}>{children}</Grid>
    </Paper>
  );

  return (
    <Box p={2}>
      {/* Profile Header */}
      <Paper sx={{ background: 'linear-gradient(to right, #162324ff, #61d1c4)', p: 2, mb: 1, color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'white',
                color: '#2196f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 24,
              }}
            >
              {profileLetter}
            </Box>
            <Box>
              {editMode ? (
                <TextField
                  size="small"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  variant="standard"
                  sx={{
                    input: { color: 'white', fontSize: 20, fontWeight: 600 },
                    '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.4)' },
                    '& .MuiInput-underline:hover:before': { borderBottomColor: 'white' },
                    '& .MuiInput-underline:after': { borderBottomColor: '#2196f3' },
                  }}
                />
              ) : (
                <Typography variant="h6">{employeeName}</Typography>
              )}
              <Typography variant="body2">#{employeeId}</Typography>
            </Box>
          </Box>

          {!editMode && (
            <IconButton size="small" sx={{ color: 'white' }} onClick={handleEditClick}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Paper>

      {saveMessage && (
        <Typography sx={{ color: '#4caf50', mb: 1, fontWeight: 600 }}>
          {saveMessage}
        </Typography>
      )}

      {saveError && (
        <Typography sx={{ color: '#ff6b6b', mb: 1, fontWeight: 600 }}>
          {saveError}
        </Typography>
      )}

      {/* Sections */}
      <Section title="Employee Information" editable>
        {renderField('Title')}
        {renderField('Nick Name')}
        {renderField('Gender', employeeGender, 'gender')}
        {renderField('Name', employeeName, 'name')}
        {renderField('Employee Login Username', employeeEmail, 'email')}
        {renderField('Mobile')}
        {renderField('Email', employeeEmail, 'email')}
        {renderField('Extension')}
      </Section>

      <Section title="Personal Information" editable>
        {renderField('DOB')}
        {renderField('Birthday')}
        {renderField('Blood Group')}
        {renderField("Father's Name")}
        {renderField('Marital Status')}
        {renderField('Marriage Date')}
        {renderField('Spouse Name')}
        {renderField('Nationality')}
        {renderField('Residential Status')}
        {renderField('Place Of Birth')}
        {renderField('Country Of Origin')}
        {renderField('Religion')}
        {renderField('International Employee', 'No')}
        {renderField('Physically Challenged', 'No')}
        {renderField('Is Director', employeeDesignation === 'DIRECTOR' ? 'Yes' : 'No')}
        {renderField('Personal Email')}
        {renderField('Height')}
        {renderField('Weight')}
        {renderField('Identification Mark')}
        {renderField('Hobby')}
        {renderField('Caste')}
      </Section>

      <Section title="Joining Details" editable>
        {renderField('Joined On')}
        {renderField('Confirmation Date')}
        {renderField('Status', currentEmployee?.isActive === true ? 'Active' : currentEmployee?.isActive === false ? 'Inactive' : '-')}
        {renderField('Probation Period')}
        {renderField('Notice Period')}
        {renderField('Current Company Experience')}
        {renderField('Previous Experience')}
        {renderField('Total Experience')}
        {renderField('Referred By')}
      </Section>

      <Section title="Current Position" color="#4caf50" editable>
        {renderField('Designation', employeeDesignation, 'designation')}
        {renderField('Employee Image', currentEmployee?.employeeImage, 'employeeImage')}
        {renderField('Manager ID', currentEmployee?.stManagerId, 'stManagerId')}
        {renderField('Location', 'Bangalore')}
      </Section>

      {editMode && (
        <Box display="flex" justifyContent="center" gap={2} my={2}>
          <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }} onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Employee Details'}
          </Button>
        </Box>
      )}

      {['Employee Identity', 'Education', 'Course Details'].map((title) => (
        <Accordion key={title} sx={{ mb: 1, borderRadius: 1, bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', color: 'white' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography fontWeight={600}>{title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">No records available</Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1, mb: 1, color: 'white' }}>Address</Typography>

      <Section title="Present" color="tomato">
        {renderField('Name', employeeName)}
        {renderField('Address')}
        {renderField('City')}
        {renderField('State')}
        {renderField('Country')}
        {renderField('Pincode')}
        {renderField('Phone1')}
        {renderField('Phone2')}
        {renderField('Ext')}
        {renderField('Fax')}
        {renderField('Mobile no')}
        {renderField('Email', employeeEmail)}
      </Section>

      <Divider />

      <Section title="Permanent" color="tomato">
        {renderField('Name', employeeName)}
        {renderField('Address')}
        {renderField('City')}
        {renderField('State')}
        {renderField('Country')}
        {renderField('Pincode')}
        {renderField('Phone1')}
        {renderField('Phone2')}
        {renderField('Ext')}
        {renderField('Fax')}
        {renderField('Mobile no')}
        {renderField('Email', employeeEmail)}
      </Section>

      <Divider />

      <Section title="Contact" color="tomato">
        {renderField('Name', employeeName)}
        {renderField('Address')}
        {renderField('City')}
        {renderField('State')}
        {renderField('Country')}
        {renderField('Pincode')}
        {renderField('Phone1')}
        {renderField('Phone2')}
        {renderField('Ext')}
        {renderField('Fax')}
        {renderField('Mobile no')}
        {renderField('Email', employeeEmail)}
      </Section>

      <Divider />

      <Section title="Emergency Contact" color="tomato">
        {renderField('Name')}
        {renderField('Relationship')}
        {renderField('Address')}
        {renderField('City')}
        {renderField('State')}
        {renderField('Country')}
        {renderField('Pincode')}
        {renderField('Phone1')}
        {renderField('Phone2')}
        {renderField('Ext')}
        {renderField('Fax')}
        {renderField('Mobile no')}
        {renderField('Email')}
      </Section>

      <Divider />

      <Section title="Background Check" color="#4caf50">
        {renderField('Verification Status')}
        {renderField('Verification Completed on')}
        {renderField('Agency Name')}
        {renderField('Remarks')}
      </Section>

      <Divider />

      <Section title="Remarks" color="#2196f3">
        <TextField
          fullWidth
          multiline
          rows={6}
          placeholder="Type your description...."
          variant="outlined"
          sx={{
            input: { color: 'white' },
            textarea: { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'white',
              opacity: 0.5,
            },
          }}
        />
      </Section>
    </Box>
  );
};

export default Info;