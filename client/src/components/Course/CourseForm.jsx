import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import http from '../../http';

const CourseForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        try {
          const response = await http.get(`/courses/${courseId}`);
          setCourse(response.data);
        } catch (error) {
          console.error('Error fetching course:', error);
        }
      };
      fetchCourse();
    }
  }, [courseId]);

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
      if (courseId) {
        await http.put(`/courses/${courseId}`, course);
      } else {
        await http.post('/courses/create', course);
      }
      navigate('/courses');
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
        {courseId ? 'Edit Course' : 'Create New Course'}
      </Typography>
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
        {courseId ? 'Update Course' : 'Create Course'}
      </Button>
    </Box>
  );
};

export default CourseForm;