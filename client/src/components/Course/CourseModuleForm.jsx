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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import * as Yup from "yup";
import http from "../../http";

const validationSchema = Yup.object({
  moduleCode: Yup.object().nullable().required("Module is required"),
  prevModuleCodes: Yup.array().of(Yup.object().nullable()),
  nextModuleCodes: Yup.array().of(Yup.object().nullable()),
  order: Yup.number().required("Order is required"),
  levelOfStudy: Yup.string().required("Level of Study is required"),
  complexityLevel: Yup.number()
    .required("Complexity Level is required")
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
      prevModuleCodes: [],
      nextModuleCodes: [],
      order: "",
      levelOfStudy: "",
      complexityLevel: "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          moduleCode: values.moduleCode?.moduleCode,
          prevModuleCodes: values.prevModuleCodes.map(
            (mod) => mod?.Module?.moduleCode
          ),
          nextModuleCodes: values.nextModuleCodes.map(
            (mod) => mod?.Module?.moduleCode
          ),
          order: parseInt(values.order, 10),
          complexityLevel: parseInt(values.complexityLevel, 10),
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
        window.location.reload(); // Refresh the page to activate flow map compoment (ReactflowCareerMap.jsx)
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
      const prevModules = courseModuleToEdit.prevModuleCodes.map((code) =>
        courseModules.find((m) => m.Module.moduleCode === code)
      );
      const nextModules = courseModuleToEdit.nextModuleCodes.map((code) =>
        courseModules.find((m) => m.Module.moduleCode === code)
      );

      formik.setValues({
        courseCode: courseCode,
        moduleCode: selectedModule || null,
        prevModuleCodes: prevModules.filter(Boolean),
        nextModuleCodes: nextModules.filter(Boolean),
        order: courseModuleToEdit.order || "",
        levelOfStudy: courseModuleToEdit.levelOfStudy || "",
        complexityLevel: courseModuleToEdit.complexityLevel || "",
      });
    }
  }, [isEditMode, availableModules, courseModules, courseModuleToEdit]);

  const handleBulkAdd = async () => {
    try {
      const promises = selectedModules.map((module) =>
        http.post(`/courseModule/${courseCode}/create`, {
          courseCode,
          moduleCode: module.moduleCode,
          order: 0,
          levelOfStudy: "",
          complexityLevel: 1,
          prevModuleCodes: [],
          nextModuleCodes: [],
        })
      );
      await Promise.all(promises);
      if (onModuleAdded) {
        onModuleAdded();
      }
      if (onClose) {
        onClose();
      }
      window.location.reload(); // Refresh the page to activate flow map compoment (ReactflowCareerMap.jsx)
    } catch (error) {
      console.error("Error adding modules in bulk:", error);
    }
  };

  const handleModuleToggle = (module) => {
    const currentIndex = selectedModules.findIndex(
      (m) => m.moduleCode === module.moduleCode
    );
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

  const handleAddPrevModule = () => {
    formik.setFieldValue("prevModuleCodes", [
      ...formik.values.prevModuleCodes,
      null,
    ]);
  };

  const handleAddNextModule = () => {
    formik.setFieldValue("nextModuleCodes", [
      ...formik.values.nextModuleCodes,
      null,
    ]);
  };

  const handleRemovePrevModule = (index) => {
    const newPrevModules = [...formik.values.prevModuleCodes];
    newPrevModules.splice(index, 1);
    formik.setFieldValue("prevModuleCodes", newPrevModules);
  };

  const handleRemoveNextModule = (index) => {
    const newNextModules = [...formik.values.nextModuleCodes];
    newNextModules.splice(index, 1);
    formik.setFieldValue("nextModuleCodes", newNextModules);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
        >
          <Tab label={isEditMode ? "Edit Module" : "Add Individual Module"} />
          {!isEditMode && <Tab label="Add Modules in Bulk" />}
        </Tabs>
      </Box>
      <Paper sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
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
                <Typography variant="subtitle1">Previous Modules</Typography>
                {formik.values.prevModuleCodes.map((prevModule, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    <Autocomplete
                      fullWidth
                      options={courseModules}
                      getOptionLabel={(option) => option?.Module?.title || ""}
                      filterOptions={filterOptions}
                      value={prevModule}
                      onChange={(event, newValue) => {
                        const newPrevModules = [...formik.values.prevModuleCodes];
                        newPrevModules[index] = newValue;
                        formik.setFieldValue("prevModuleCodes", newPrevModules);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label={`Previous Module ${index + 1}`} />
                      )}
                    />
                    <IconButton onClick={() => handleRemovePrevModule(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddPrevModule}
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Add Prev Module
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Next Modules</Typography>
                {formik.values.nextModuleCodes.map((nextModule, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    <Autocomplete
                      fullWidth
                      options={courseModules}
                      getOptionLabel={(option) => option?.Module?.title || ""}
                      filterOptions={filterOptions}
                      value={nextModule}
                      onChange={(event, newValue) => {
                        const newNextModules = [...formik.values.nextModuleCodes];
                        newNextModules[index] = newValue;
                        formik.setFieldValue("nextModuleCodes", newNextModules);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label={`Next Module ${index + 1}`} />
                      )}
                    />
                    <IconButton onClick={() => handleRemoveNextModule(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddNextModule}
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Add Next Module
                </Button>
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
                  id="complexityLevel"
                  name="complexityLevel"
                  label="Complexity Level"
                  type="number"
                  value={formik.values.complexityLevel}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.complexityLevel &&
                    Boolean(formik.errors.complexityLevel)
                  }
                  helperText={
                    formik.touched.complexityLevel && formik.errors.complexityLevel
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