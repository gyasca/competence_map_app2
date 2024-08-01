import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  Grid,
  Autocomplete,
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
      moduleCode: courseModuleToEdit
        ? availableModules.find(
            (m) => m.moduleCode === courseModuleToEdit.Module.moduleCode
          )
        : null,
      prevModuleCode: courseModuleToEdit
        ? courseModules.find(
            (m) => m.Module.moduleCode === courseModuleToEdit.prevModuleCode
          )
        : null,
      nextModuleCode: courseModuleToEdit
        ? courseModules.find(
            (m) => m.Module.moduleCode === courseModuleToEdit.nextModuleCode
          )
        : null,
      order: courseModuleToEdit ? courseModuleToEdit.order : "",
      levelOfStudy: courseModuleToEdit ? courseModuleToEdit.levelOfStudy : "",
      competencyLevel: courseModuleToEdit
        ? courseModuleToEdit.competencyLevel
        : "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        console.log("values before submitting: ", values);
        const payload = {
          ...values,
          moduleCode: values.moduleCode?.moduleCode,
          prevModuleCode: values.prevModuleCode?.Module?.moduleCode,
          nextModuleCode: values.nextModuleCode?.Module?.moduleCode,
        };
        let response;
        if (isEditMode) {
          response = await http.put(
            `/courseModule/${courseCode}/update/${courseModuleToEdit.id}`,
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

  const filterOptions = (options, { inputValue }) => {
    return options.filter(
      (option) =>
        option?.title?.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
    );
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? "Edit Module in Course" : "Add Module to Course"}
      </Typography>
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
    </Box>
  );
}

export default CourseModuleForm;
