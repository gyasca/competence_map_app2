import React from 'react';
import { Typography, Button, Box, Paper, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import CourseList from '../../../components/Course/CourseList';

const ViewCourses = () => {
  return (
    <Container
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        mt: "4%"
      }}
    >
      {/* <Paper elevation={3} sx={{ p: 2 }}> */}
        <CourseList />
      {/* </Paper> */}
    </Container>
  );
};

export default ViewCourses;