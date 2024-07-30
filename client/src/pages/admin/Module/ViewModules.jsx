import { Container } from "@mui/material";
import React from "react";
import ModuleList from "../../../components/Module/ModuleList";

function ViewModules() {
  return (
    <Container
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        mt: "4%"
      }}
    >
      <ModuleList />
    </Container>
  );
}

export default ViewModules;
