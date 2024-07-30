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
  Tab,
  Tabs,
  IconButton,
  InputAdornment,
  Typography,
  Container,
  Paper
} from "@mui/material";
import { Edit, Delete, Visibility, Search, Add } from "@mui/icons-material";
import http from "../http";
import { useNavigate } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await http.get("/user/all");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (user) => setEditUser(user);
  const handleDelete = (user) => setDeleteUser(user);
  const handleView = (userId) => navigate(`/admin/users/${userId}`);

  const confirmEdit = async () => {
    try {
      await http.put(`/user/${editUser.userId}`, editUser);
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      await http.delete(`/user/${deleteUser.userId}`);
      setDeleteUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleView(params.row.userId)}
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
    { field: "userId", headerName: "User ID", width: 130 },
    { field: "adminNumber", headerName: "Admin Number", width: 150 },
    { field: "staffId", headerName: "Staff ID", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "course", headerName: "Course", width: 200 },
    { field: "yearJoined", headerName: "Year Joined", width: 130 },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesTab =
      tabValue === 0 ||
      (tabValue === 1 && user.role === "student") ||
      (tabValue === 2 && user.role === "staff");

    const matchesSearch = Object.values(user).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return matchesTab && matchesSearch;
  });

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        User Management
      </Typography>

      <Paper elevation={3} sx={{ mt: 5, mb: 5 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ padding: 2, margin: 3 }}
        >
          <Tab label="All Users" />
          <Tab label="Students" />
          <Tab label="Staff" />
        </Tabs>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search users..."
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
          onClick={() => navigate("/admin/users/create")}
        >
          Create User
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          getRowId={(row) => row.userId}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          rowsPerPageOptions={[5, 10, 20]}
          components={{ Toolbar: GridToolbar }}
          disableSelectionOnClick
          sx={{
            "& .MuiDataGrid-main": { overflow: "auto" },
            "& .MuiDataGrid-virtualScroller": { overflow: "auto" },
          }}
        />
      </Box>

      <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={editUser?.name || ""}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={editUser?.email || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)}>Cancel</Button>
          <Button onClick={confirmEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteUser} onClose={() => setDeleteUser(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUser(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default UserList;
