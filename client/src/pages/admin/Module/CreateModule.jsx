import { Container } from "@mui/material";
import React from "react";
import CreateModuleForm from "../../../components/Module/CreateModuleForm";
import BulkCreateModule from "../../../components/Module/BulkCreateModule";

function CreateModule() {
  return (
    <Container
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        mt: "4%",
      }}
    >
      <BulkCreateModule />
      <CreateModuleForm />
    </Container>
  );
}

export default CreateModule;
