import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import http from '../../http'

const validationSchema = Yup.object({
  name: Yup.string().required("Course Name is required"),
  description: Yup.string().required("Description is required"),
  school: Yup.string().required("School is required"),
  // Add any other fields specific to your course model
});

function EditCourseForm({ course: propCourse, onClose }) {
  const [loading, setLoading] = useState(!propCourse);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(propCourse || null);

  useEffect(() => {
    if (!propCourse && courseId) {
      const fetchCourse = async () => {
        try {
          const response = await http.get(`/course/${courseId}`);
          setCourse(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching course:", error);
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [propCourse, courseId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: course ? {
      id: course.id,
      name: course.name,
      description: course.description,
      school: course.school,
      // Add any other fields specific to your course model
    } : {
      id: "",
      name: "",
      description: "",
      school: "",
      // Add any other fields specific to your course model
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await http.put(`/course/${values.id}`, values);
        if (onClose) {
          onClose();
        } else {
          navigate("/admin/courses");
        }
      } catch (error) {
        console.error("Error updating course:", error);
      }
    },
  });

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Course Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="school"
              name="school"
              label="School"
              value={formik.values.school}
              onChange={formik.handleChange}
              error={formik.touched.school && Boolean(formik.errors.school)}
              helperText={formik.touched.school && formik.errors.school}
            />
          </Grid>
          {/* Add any other fields specific to your course model */}
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="button" 
            onClick={onClose ? onClose : () => navigate("/admin/courses")} 
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Update Course
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default EditCourseForm;