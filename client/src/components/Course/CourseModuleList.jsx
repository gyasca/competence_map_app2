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
} from "@mui/material";
import { Edit, Delete, Visibility, Search, Add } from "@mui/icons-material";
import http from "../../http";
import { useNavigate, useParams } from "react-router-dom";
import CourseModuleForm from "./CourseModuleForm";

function CourseModuleList() {
  const { courseCode } = useParams();
  const [rawCourseModules, setRawCourseModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteCourseModule, setDeleteCourseModule] = useState(null);
  const [editCourseModule, setEditCourseModule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
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
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "moduleCode", headerName: "Module Code", width: 150 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "credit", headerName: "Credit", width: 100 },
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
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          height: "calc(100% - 130px)",
          overflow: "hidden",
        }}
      >
        {processedCourseModules.length > 0 ? (
          <DataGrid
            rows={filteredCourseModules}
            columns={columns}
            pageSize={10}
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
            Are you sure you want to remove this module from the course?
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
    </Box>
  );
}

export default CourseModuleList;