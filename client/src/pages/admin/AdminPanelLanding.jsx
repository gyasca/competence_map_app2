import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';

function AdminPanelLanding() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', // This ensures the Box takes full height of its container
        width: '100%', // This ensures the Box takes full width of its container
        padding: '2rem',
      }}
    >
      <Typography variant="h3" sx={{ marginBottom: '2rem', textAlign: 'center' }}>
        Staff Panel
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Button
            component={Link}
            to="/admin/users"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: '100px', fontSize: '1.2rem' }}
          >
            Manage Users
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            component={Link}
            to="/admin/modules"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: '100px', fontSize: '1.2rem' }}
          >
            Manage Modules
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            component={Link}
            to="/admin/competencies"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: '100px', fontSize: '1.2rem' }}
          >
            Manage Competencies
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            component={Link}
            to="/admin/courses"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: '100px', fontSize: '1.2rem' }}
          >
            Manage Courses
          </Button>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4}>
          <Button
            component={Link}
            to="/admin/modules"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: '100px', fontSize: '1.2rem' }}
          >
            Manage Modules
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            component={Link}
            to="/admin/competencies"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: '100px', fontSize: '1.2rem' }}
          >
            Manage Competencies
          </Button>
        </Grid> */}
      </Grid>
    </Box>
  );
}

export default AdminPanelLanding;