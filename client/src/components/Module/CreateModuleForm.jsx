import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import http from "../../http";

const validationSchema = Yup.object({
  moduleCode: Yup.string().required("Module Code is required"),
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  school: Yup.string().required("School is required"),
  credit: Yup.number().required("Credit is required").positive().integer(),
  domain: Yup.string().required("Domain is required"),
});

function CreateModuleForm() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      moduleCode: "",
      title: "",
      description: "",
      school: "",
      credit: "",
      domain: "",
      prevModule: "",
      nextModule: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await http.post("/module/create", values);
        navigate("/admin/modules");
      } catch (error) {
        console.error("Error creating module:", error);
      }
    },
  });

  return (
    <Box sx={{ mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Module
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="moduleCode"
                name="moduleCode"
                label="Module Code"
                value={formik.values.moduleCode}
                onChange={formik.handleChange}
                error={
                  formik.touched.moduleCode && Boolean(formik.errors.moduleCode)
                }
                helperText={
                  formik.touched.moduleCode && formik.errors.moduleCode
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
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
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="credit"
                name="credit"
                label="Credit"
                type="number"
                value={formik.values.credit}
                onChange={formik.handleChange}
                error={formik.touched.credit && Boolean(formik.errors.credit)}
                helperText={formik.touched.credit && formik.errors.credit}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                id="domain"
                name="domain"
                label="Domain"
                value={formik.values.domain}
                onChange={formik.handleChange}
                error={formik.touched.domain && Boolean(formik.errors.domain)}
                helperText={formik.touched.domain && formik.errors.domain}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="prevModule"
                name="prevModule"
                label="Previous Module"
                value={formik.values.prevModule}
                onChange={formik.handleChange}
                error={
                  formik.touched.prevModule &&
                  Boolean(formik.errors.prevModule)
                }
                helperText={
                  formik.touched.prevModule && formik.errors.prevModule
                }
              />
            </Grid> */}
            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="nextModule"
                name="nextModule"
                label="Next Module"
                value={formik.values.nextModule}
                onChange={formik.handleChange}
                error={
                  formik.touched.nextModule &&
                  Boolean(formik.errors.nextModule)
                }
                helperText={
                  formik.touched.nextModule && formik.errors.nextModule
                }
              />
            </Grid> */}
          </Grid>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="button"
              onClick={() => navigate("/admin/modules")}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create Module
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default CreateModuleForm;
