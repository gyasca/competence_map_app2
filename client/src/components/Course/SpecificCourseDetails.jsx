import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import http from '../../http';
import CourseModuleList from "./CourseModuleList";

function InfoBox({ title, value }) {
  return (
    <Box>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}

function SpecificCourseDetails() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const { courseCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse();
  }, [courseCode]);

  const fetchCourse = async () => {
    try {
      const response = await http.get(`/course/${courseCode}`);
      setCourse(response.data);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!course) {
    return <Typography>Course not found</Typography>;
  }

  return (
    <Box>
      <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              {course.name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Course Code: {course.courseCode}
            </Typography>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate(`/admin/courses/edit/${courseCode}`)}
                sx={{ width: "100%", mb: 1 }}
              >
                Edit Course
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/courses")}
                sx={{ width: "100%" }}
              >
                Back to Course List
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="course details tabs"
              variant="fullWidth"
            >
              <Tab label="General Info" value="1" />
              <Tab label="Course Modules" value="2" />
            </Tabs>
          </Paper>
          {activeTab === "1" && (
            <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Course Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <InfoBox title="Course Code" value={course.courseCode} />
                </Grid>
                <Grid item xs={6}>
                  <InfoBox title="Name" value={course.name} />
                </Grid>
                <Grid item xs={12}>
                  <InfoBox title="Description" value={course.description} />
                </Grid>
              </Grid>
            </Paper>
          )}
          {activeTab === "2" && (
            <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Course Modules
              </Typography>
              <CourseModuleList courseCode={courseCode} />
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default SpecificCourseDetails;
