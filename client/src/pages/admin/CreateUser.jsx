import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, Button, MenuItem, Snackbar } from '@mui/material';
import http from '../../http';
import BulkCreateUser from '../../components/BulkCreateUser';

function CreateUser() {
  const [snackbar, setSnackbar] = React.useState(null);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    role: Yup.string().required('Role is required'),
    staffId: Yup.string().when('role', {
      is: 'staff',
      then: Yup.string().required('Staff ID is required for staff'),
    }),
    department: Yup.string().when('role', {
      is: 'staff',
      then: Yup.string().required('Department is required for staff'),
    }),
    position: Yup.string().when('role', {
      is: 'staff',
      then: Yup.string().required('Position is required for staff'),
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: '',
      staffId: '',
      department: '',
      position: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await http.post('/user/register', values);
        setSnackbar({ message: 'User created successfully', severity: 'success' });
        formik.resetForm();
      } catch (error) {
        setSnackbar({ message: 'Error creating user', severity: 'error' });
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <BulkCreateUser />
      <Typography variant="h4" sx={{ mb: 2 }}>Create User</Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          id="role"
          name="role"
          select
          label="Role"
          value={formik.values.role}
          onChange={formik.handleChange}
          error={formik.touched.role && Boolean(formik.errors.role)}
          helperText={formik.touched.role && formik.errors.role}
          sx={{ mb: 2 }}
        >
          <MenuItem value="staff">Staff</MenuItem>
          <MenuItem value="student">Student</MenuItem>
        </TextField>
        {formik.values.role === 'staff' && (
          <>
            <TextField
              fullWidth
              id="staffId"
              name="staffId"
              label="Staff ID"
              value={formik.values.staffId}
              onChange={formik.handleChange}
              error={formik.touched.staffId && Boolean(formik.errors.staffId)}
              helperText={formik.touched.staffId && formik.errors.staffId}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="department"
              name="department"
              label="Department"
              value={formik.values.department}
              onChange={formik.handleChange}
              error={formik.touched.department && Boolean(formik.errors.department)}
              helperText={formik.touched.department && formik.errors.department}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="position"
              name="position"
              label="Position"
              value={formik.values.position}
              onChange={formik.handleChange}
              error={formik.touched.position && Boolean(formik.errors.position)}
              helperText={formik.touched.position && formik.errors.position}
              sx={{ mb: 2 }}
            />
          </>
        )}
        <Button color="primary" variant="contained" fullWidth type="submit">
          Create User
        </Button>
      </form>
      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={6000}
        onClose={() => setSnackbar(null)}
        message={snackbar?.message}
      />
    </Box>
  );
}

export default CreateUser;