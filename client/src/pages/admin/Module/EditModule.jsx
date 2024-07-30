import React from "react";
import { Container, Typography } from "@mui/material";
import EditModuleForm from "../../../components/Module/EditModuleForm";

function EditModule() {
  return (
    <Container
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        mt: "4%"
      }}
    >
      <Typography variant="h4" gutterBottom>
        Edit Module
      </Typography>
      <EditModuleForm />
    </Container>
  );
}

export default EditModule;