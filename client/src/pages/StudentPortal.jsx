import React, { useEffect } from 'react';
import { Container, Box, Paper, Typography, Grid, Button, IconButton } from '@mui/material';
import {
  EventAvailable,
  TrendingUp,
  Description,
  School,
  AccountBalance,
  ListAlt,
  Help,
  Info,
} from '@mui/icons-material';

const StudentPortal = () => {
  useEffect(() => {
    document.title = 'Student Portal - CM App';
  }, []);

  // Dummy data for indicators
  const indicators = [
    { label: 'Certifications Obtained', count: 5, color: 'green' },
    { label: 'Modules Completed', count: 15, color: 'blue' },
    { label: 'Current GPA', count: 3.8, color: 'purple' },
    { label: 'Credits Completed', count: '70/118', color: 'orange' },
    { label: 'CCA Points', count: 25, color: 'brown' },
  ];

  return (
    <Container maxWidth="xl" sx={{ marginTop: '1rem' }}>
      <Box marginBottom="20px">
        {/* First Paper Component */}
        <Paper elevation={0} style={{ padding: '20px', backgroundColor: '#d5e3eb' }}>
          <Typography variant="h6" gutterBottom>
            <EventAvailable /> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })},{' '}
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
          </Typography>
        </Paper>
      </Box>

      <Box marginBottom="20px">
        {/* Second Paper Component */}
        <Paper elevation={0} style={{ padding: '20px', textAlign: 'center', backgroundColor: '#d5e3eb' }}>
          <Grid container spacing={2} justifyContent="space-around">
            {indicators.map((indicator, index) => (
              <Grid item key={index} xs={2}>
                <Typography variant="h4" style={{ color: indicator.color }}>{indicator.count}</Typography>
                <Typography sx={{ fontSize: '0.6rem'}}>{indicator.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      <Box marginBottom="20px">
        {/* Third Paper Component */}
        <Paper elevation={0} style={{ padding: '20px', textAlign: 'center', backgroundColor: '#d5e3eb' }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <IconButton>
                <TrendingUp fontSize="large" />
              </IconButton>
              <Typography variant="subtitle1">Skill Map</Typography>
            </Grid>
            <Grid item xs={4}>
              <IconButton>
                <Description fontSize="large" />
              </IconButton>
              <Typography variant="subtitle1">Module Progression</Typography>
            </Grid>
            <Grid item xs={4}>
              <IconButton>
                <Description fontSize="large" />
              </IconButton>
              <Typography variant="subtitle1">Resume</Typography>
            </Grid>
            <Grid item xs={4}>
              <IconButton>
                <School fontSize="large" />
              </IconButton>
              <Typography variant="subtitle1">Student Portal</Typography>
            </Grid>
            <Grid item xs={4}>
              <IconButton>
                <AccountBalance fontSize="large" />
              </IconButton>
              <Typography variant="subtitle1">CCC Transcript</Typography>
            </Grid>
            <Grid item xs={4}>
              <IconButton>
                <TrendingUp fontSize="large" />
              </IconButton>
              <Typography variant="subtitle1">Grade Point Average</Typography>
            </Grid>
            <Grid item xs={4}>
              <IconButton>
                <ListAlt fontSize="large" />
              </IconButton>
              <Typography variant="subtitle1">Certification List</Typography>
            </Grid>
            <Grid item xs={4}>
              <IconButton>
                <Help fontSize="large" />
              </IconButton>
              <Typography variant="subtitle1">SIT Help Desk</Typography>
            </Grid>
            <Grid item xs={4}>
              <IconButton>
                <Info fontSize="large" />
              </IconButton>
              <Typography variant="subtitle1">About Me</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default StudentPortal;