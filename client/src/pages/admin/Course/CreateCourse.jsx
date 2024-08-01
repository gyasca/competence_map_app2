// pages/CreateCoursePage.jsx
import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CourseForm from '../../../components/Course/CourseForm';

const CreateCourse = () => {
  const navigate = useNavigate();

  const handleCourseCreated = (course) => {
    navigate('/admin/home');
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Create New Course</Typography>
      <CourseForm onCourseCreated={handleCourseCreated} />
    </div>
  );
};

export default CreateCourse;