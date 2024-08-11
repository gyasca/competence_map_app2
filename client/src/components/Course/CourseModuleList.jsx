import React, { useState, useEffect, useMemo } from "react";
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
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { Edit, Delete, Visibility, Search, Add } from "@mui/icons-material";
import http from "../../http";
import { useNavigate, useParams } from "react-router-dom";
import CourseModuleForm from "./CourseModuleForm";

function CourseModuleList({ courseCode, onModuleUpdate }) {
  const [rawCourseModules, setRawCourseModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteCourseModule, setDeleteCourseModule] = useState(null);
  const [editCourseModule, setEditCourseModule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [deleteSelectedDialogOpen, setDeleteSelectedDialogOpen] = useState(false); // New state
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseModules();
  }, [courseCode]);

  const fetchCourseModules = async () => {
    setLoading(true);
    try {
      const response = await http.get(
        `/courseModule/course/${courseCode}/modules`
      );
      setRawCourseModules(response.data);
    } catch (error) {
      console.error("Error fetching course modules:", error);
    } finally {
      setLoading(false);
    }
  };

  const processedCourseModules = useMemo(() => {
    return rawCourseModules.map((courseModule) => ({
      id: courseModule.id,
      moduleCode: courseModule.Module?.moduleCode || "",
      title: courseModule.Module?.title || "",
      description: courseModule.Module?.description || "",
      credit: courseModule.Module?.credit || "",
      rawData: courseModule, // Keep the original data for actions
    }));
  }, [rawCourseModules]);

  const handleView = (moduleCode) =>
    navigate(`/admin/courses/${courseCode}/modules/${moduleCode}`);
  const handleEdit = (courseModule) => {
    setEditCourseModule(courseModule.rawData);
    setModuleDialogOpen(true);
  };
  const handleDelete = (courseModule) =>
    setDeleteCourseModule(courseModule.rawData);

  const confirmDelete = async () => {
    try {
      await http.delete(
        `/courseModule/course/${courseCode}/module/delete/${deleteCourseModule.id}`
      );
      setDeleteCourseModule(null);
      fetchCourseModules();
    } catch (error) {
      console.error("Error deleting course module:", error);
    }
  };

  const handleModuleDialogClose = () => {
    setEditCourseModule(null);
    setModuleDialogOpen(false);
  };

  const handleModuleAdded = () => {
    fetchCourseModules();
    handleModuleDialogClose();
    if (onModuleUpdate) {
      onModuleUpdate();
    }
  };

  const handleSelectAllClick = () => {
    if (selectedModules.length === processedCourseModules.length) {
      setSelectedModules([]);
    } else {
      setSelectedModules(processedCourseModules.map((module) => module.id));
    }
  };

  const handleCheckboxClick = (id) => {
    setSelectedModules((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = () => {
    setDeleteSelectedDialogOpen(true); // Open the dialog instead of deleting immediately
  };

  const confirmDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedModules.map((id) =>
          http.delete(`/courseModule/course/${courseCode}/module/delete/${id}`)
        )
      );
      setSelectedModules([]);
      fetchCourseModules();
    } catch (error) {
      console.error("Error deleting selected modules:", error);
    } finally {
      setDeleteSelectedDialogOpen(false); // Close the dialog after deletion
    }
  };

  const columns = [
    {
      field: "select",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <Checkbox
          checked={selectedModules.includes(params.row.id)}
          onChange={() => handleCheckboxClick(params.row.id)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleView(params.row.moduleCode)}
            size="small"
          >
            <Visibility />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row)} size="small">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)} size="small">
            <Delete />
          </IconButton>
        </>
      ),
    },
    { field: "id", headerName: "Module ID", width: 150 },

    { field: "moduleCode", headerName: "Module Code", width: 150 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "credit", headerName: "Credit", width: 100 },
  ];

  const filteredCourseModules = processedCourseModules.filter((courseModule) =>
    Object.values(courseModule).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return <CircularProgress />;
  }

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
        Course Module Management
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search course modules..."
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
          onClick={() => setModuleDialogOpen(true)}
        >
          Add Module to Course
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" onClick={handleSelectAllClick}>
          {selectedModules.length === processedCourseModules.length
            ? "Unselect All"
            : "Select All"}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteSelected}
          disabled={selectedModules.length === 0}
        >
          Delete Selected
        </Button>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          height: "400px",
          overflow: "hidden",
        }}
      >
        {processedCourseModules.length > 0 ? (
          <DataGrid
            rows={filteredCourseModules}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            components={{ Toolbar: GridToolbar }}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-main": { overflow: "auto" },
              "& .MuiDataGrid-virtualScroller": { overflow: "auto" },
            }}
          />
        ) : (
          <Typography>No course modules found.</Typography>
        )}
      </Box>

      <Dialog
        open={!!deleteCourseModule}
        onClose={() => setDeleteCourseModule(null)}
      >
        <DialogTitle>Remove Module from Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this module? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCourseModule(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={moduleDialogOpen}
        onClose={handleModuleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editCourseModule ? "Edit Course Module" : "Add Module to Course"}
        </DialogTitle>
        <DialogContent>
          <CourseModuleForm
            courseCode={courseCode}
            onClose={handleModuleDialogClose}
            onModuleAdded={handleModuleAdded}
            courseModuleToEdit={editCourseModule}
          />
        </DialogContent>
      </Dialog>

      {/* New Dialog for Deleting Selected Modules */}
      <Dialog
        open={deleteSelectedDialogOpen}
        onClose={() => setDeleteSelectedDialogOpen(false)}
      >
        <DialogTitle>Delete Selected Modules</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected modules? This action
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

export default CourseModuleList;
