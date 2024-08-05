import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Autocomplete,
  Tabs,
  Tab,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import http from "../../http";

const validationSchema = Yup.object({
  moduleCode: Yup.object().nullable().required("Module is required"),
  prevModuleCode: Yup.object().nullable(),
  nextModuleCode: Yup.object().nullable(),
  order: Yup.number().required("Order is required"),
  levelOfStudy: Yup.string().required("Level of Study is required"),
  competencyLevel: Yup.number()
    .required("Competency Level is required")
    .positive()
    .integer(),
});

function CourseModuleForm({
  courseCode,
  onClose,
  onModuleAdded,
  courseModuleToEdit = null,
}) {
  const [availableModules, setAvailableModules] = useState([]);
  const [courseModules, setCourseModules] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedModules, setSelectedModules] = useState([]);
  const isEditMode = !!courseModuleToEdit;

  useEffect(() => {
    fetchAvailableModules();
    fetchCourseModules();
  }, [courseCode]);

  const fetchAvailableModules = async () => {
    try {
      const response = await http.get(`/module/all`);
      setAvailableModules(response.data);
    } catch (error) {
      console.error("Error fetching available modules:", error);
    }
  };

  const fetchCourseModules = async () => {
    try {
      const response = await http.get(
        `/courseModule/course/${courseCode}/modules`
      );
      setCourseModules(response.data);
    } catch (error) {
      console.error("Error fetching course modules:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      courseCode: courseCode,
      moduleCode: null,
      prevModuleCode: null,
      nextModuleCode: null,
      order: "",
      levelOfStudy: "",
      competencyLevel: "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          moduleCode: values.moduleCode?.moduleCode,
          prevModuleCode: values.prevModuleCode?.Module?.moduleCode,
          nextModuleCode: values.nextModuleCode?.Module?.moduleCode,
          order: parseInt(values.order, 10),
          competencyLevel: parseInt(values.competencyLevel, 10),
        };
        let response;
        if (isEditMode) {
          response = await http.put(
            `/courseModule/course/${courseCode}/module/edit/${courseModuleToEdit.id}`,
            payload
          );
        } else {
          response = await http.post(
            `/courseModule/${courseCode}/create`,
            payload
          );
        }
        if (onModuleAdded) {
          onModuleAdded(response.data);
        }
        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error(
          `Error ${isEditMode ? "updating" : "creating"} course module:`,
          error
        );
      }
    },
  });

  useEffect(() => {
    if (isEditMode && availableModules.length > 0 && courseModules.length > 0) {
      const selectedModule = availableModules.find(
        (m) => m.moduleCode === courseModuleToEdit.moduleCode
      );
      const prevModule = courseModules.find(
        (m) => m.Module.moduleCode === courseModuleToEdit.prevModuleCode
      );
      const nextModule = courseModules.find(
        (m) => m.Module.moduleCode === courseModuleToEdit.nextModuleCode
      );

      formik.setValues({
        courseCode: courseCode,
        moduleCode: selectedModule || null,
        prevModuleCode: prevModule || null,
        nextModuleCode: nextModule || null,
        order: courseModuleToEdit.order || "",
        levelOfStudy: courseModuleToEdit.levelOfStudy || "",
        competencyLevel: courseModuleToEdit.competencyLevel || "",
      });
    }
  }, [isEditMode, availableModules, courseModules, courseModuleToEdit]);

  const handleBulkAdd = async () => {
    try {
      const promises = selectedModules.map(module =>
        http.post(`/courseModule/${courseCode}/create`, {
          courseCode,
          moduleCode: module.moduleCode,
          order: 0,
          levelOfStudy: "",
          competencyLevel: 1,
        })
      );
      await Promise.all(promises);
      if (onModuleAdded) {
        onModuleAdded();
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error adding modules in bulk:", error);
    }
  };

  const handleModuleToggle = (module) => {
    const currentIndex = selectedModules.findIndex(m => m.moduleCode === module.moduleCode);
    const newSelectedModules = [...selectedModules];

    if (currentIndex === -1) {
      newSelectedModules.push(module);
    } else {
      newSelectedModules.splice(currentIndex, 1);
    }

    setSelectedModules(newSelectedModules);
  };

  const filterOptions = (options, { inputValue }) => {
    return options.filter(
      (option) =>
        option?.title?.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label={isEditMode ? "Edit Module" : "Add Individual Module"} />
          {!isEditMode && <Tab label="Add Modules in Bulk" />}
        </Tabs>
      </Box>
      <Paper sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {selectedTab === 0 ? (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  options={availableModules}
                  getOptionLabel={(option) => option?.title || ""}
                  filterOptions={filterOptions}
                  value={formik.values.moduleCode}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("moduleCode", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Module"
                      error={
                        formik.touched.moduleCode &&
                        Boolean(formik.errors.moduleCode)
                      }
                      helperText={
                        formik.touched.moduleCode && formik.errors.moduleCode
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  options={courseModules.filter(
                    (mod) => mod?.id !== formik.values.nextModuleCode?.id
                  )}
                  getOptionLabel={(option) => option?.Module?.title || ""}
                  filterOptions={filterOptions}
                  value={formik.values.prevModuleCode}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("prevModuleCode", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Previous Module" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  options={courseModules.filter(
                    (mod) => mod?.id !== formik.values.prevModuleCode?.id
                  )}
                  getOptionLabel={(option) => option?.Module?.title || ""}
                  filterOptions={filterOptions}
                  value={formik.values.nextModuleCode}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("nextModuleCode", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Next Module" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="order"
                  label="Order"
                  type="number"
                  value={formik.values.order}
                  onChange={formik.handleChange}
                  error={formik.touched.order && Boolean(formik.errors.order)}
                  helperText={formik.touched.order && formik.errors.order}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="levelOfStudy"
                  name="levelOfStudy"
                  label="Level of Study"
                  value={formik.values.levelOfStudy}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.levelOfStudy &&
                    Boolean(formik.errors.levelOfStudy)
                  }
                  helperText={
                    formik.touched.levelOfStudy && formik.errors.levelOfStudy
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="competencyLevel"
                  name="competencyLevel"
                  label="Competency Level"
                  type="number"
                  value={formik.values.competencyLevel}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.competencyLevel &&
                    Boolean(formik.errors.competencyLevel)
                  }
                  helperText={
                    formik.touched.competencyLevel && formik.errors.competencyLevel
                  }
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              {onClose && (
                <Button onClick={onClose} sx={{ mr: 1 }}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="contained" color="primary">
                {isEditMode ? "Update Module in Course" : "Add Module to Course"}
              </Button>
            </Box>
          </form>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Bulk Add Modules
            </Typography>
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {availableModules.map((module) => (
                <ListItem
                  key={module.moduleCode}
                  dense
                  button
                  onClick={() => handleModuleToggle(module)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedModules.some(m => m.moduleCode === module.moduleCode)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={module.title} secondary={module.moduleCode} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              {onClose && (
                <Button onClick={onClose} sx={{ mr: 1 }}>
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleBulkAdd}
                disabled={selectedModules.length === 0}
              >
                Add Selected Modules
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default CourseModuleForm;
