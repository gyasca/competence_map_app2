import React from "react";
import UserList from "../../components/UserList";
import { Box } from "@mui/material";

function ViewUsers() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%", // This ensures the Box takes full height of its container
        width: "100%", // This ensures the Box takes full width of its container
        padding: "2rem",
      }}
    >
      <UserList />
    </Box>
  );
}

export default ViewUsers;
