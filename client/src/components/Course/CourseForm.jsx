import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import http from '../../http';

const CourseForm = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (courseCode) {
      const fetchCourse = async () => {
        try {
          const response = await http.get(`/course/${courseCode}`);
          setCourse(response.data);
        } catch (error) {
          console.error('Error fetching course:', error);
        }
      };
      fetchCourse();
    }
  }, [courseCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (courseCode) {
        await http.put(`/course/${courseCode}`, course);
      } else {
        await http.post('/course/create', course);
      }
      navigate('/admin/courses');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {}));
      } else {
        console.error('Error saving course:', error);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {courseCode ? 'Edit Course' : 'Create New Course'}
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Course Code"
        name="courseCode"
        value={course.courseCode}
        onChange={handleChange}
        error={!!errors.courseCode}
        helperText={errors.courseCode}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Course Name"
        name="name"
        value={course.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Description"
        name="description"
        value={course.description}
        onChange={handleChange}
        error={!!errors.description}
        helperText={errors.description}
        multiline
        rows={4}
        required
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {courseCode ? 'Update Course' : 'Create Course'}
      </Button>
    </Box>
  );
};

export default CourseForm;