import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
} from "@mui/material";
import { Edit, Delete, Visibility, Search, Add } from "@mui/icons-material";
import http from "../../http";
import { useNavigate } from "react-router-dom";
import EditCourseForm from "./EditCourseForm";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [deleteCourse, setDeleteCourse] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [deleteSelectedDialogOpen, setDeleteSelectedDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await http.get("/course/all");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleView = (courseCode) => navigate(`/admin/courses/${courseCode}`);
  const handleEdit = (courseCode) => {
    console.log(courseCode);
    setEditCourse(courseCode);
  };
  const handleDelete = (course) => setDeleteCourse(course);

  const confirmDelete = async () => {
    try {
      await http.delete(`/course/${deleteCourse.courseCode}`);
      setDeleteCourse(null);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleEditClose = () => {
    setEditCourse(null);
    fetchCourses();
  };

  const handleSelectAllClick = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map((course) => course.courseCode));
    }
  };

  const handleCheckboxClick = (courseCode) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.includes(courseCode)
        ? prevSelected.filter((code) => code !== courseCode)
        : [...prevSelected, courseCode]
    );
  };

  const handleDeleteSelected = () => {
    setDeleteSelectedDialogOpen(true);
  };

  const confirmDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedCourses.map((courseCode) =>
          http.delete(`/course/${courseCode}`)
        )
      );
      setSelectedCourses([]);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting selected courses:", error);
    } finally {
      setDeleteSelectedDialogOpen(false);
    }
  };

  const columns = [
    {
      field: "select",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <Checkbox
          checked={selectedCourses.includes(params.row.courseCode)}
          onChange={() => handleCheckboxClick(params.row.courseCode)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleView(params.row.courseCode)}
            size="small"
          >
            <Visibility />
          </IconButton>
          <IconButton
            onClick={() => handleEdit(params.row.courseCode)}
            size="small"
          >
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)} size="small">
            <Delete />
          </IconButton>
        </>
      ),
    },
    { field: "courseCode", headerName: "Course Code", flex: 2 },
    { field: "name", headerName: "Name", flex: 3 },
    { field: "description", headerName: "Description", flex: 6 },
  ];

  const filteredCourses = courses.filter((course) =>
    Object.values(course).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Course Management
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/admin/courses/create")}
        >
          Create Course
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" onClick={handleSelectAllClick}>
          {selectedCourses.length === filteredCourses.length
            ? "Unselect All"
            : "Select All"}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteSelected}
          disabled={selectedCourses.length === 0}
        >
          Delete Selected
        </Button>
      </Box>
      <Box
        sx={{ flexGrow: 1, width: "100%", height: "60vh", overflow: "hidden" }}
      >
        <DataGrid
          rows={filteredCourses}
          columns={columns}
          getRowId={(row) => row.courseCode}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          components={{ Toolbar: GridToolbar }}
          disableSelectionOnClick
          sx={{
            "& .MuiDataGrid-main": { overflow: "auto" },
            "& .MuiDataGrid-virtualScroller": { overflow: "auto" },
          }}
        />
      </Box>

      <Dialog open={!!deleteCourse} onClose={() => setDeleteCourse(null)}>
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this course?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCourse(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!editCourse}
        onClose={handleEditClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          {editCourse && (
            <EditCourseForm courseCode={editCourse} onClose={handleEditClose} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteSelectedDialogOpen}
        onClose={() => setDeleteSelectedDialogOpen(false)}
      >
        <DialogTitle>Delete Selected Courses</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected courses? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteSelectedDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteSelected} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CourseList;