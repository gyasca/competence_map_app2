import { Container } from "@mui/material";
import React from "react";
import SpecificModuleDetails from "../../../components/Module/SpecificModuleDetails";
import CardTitle from "../../../components/CardTitle";
import AdminPageTitle from "../../../components/AdminPageTitle";

function ViewSpecificModule() {
  return (
    <Container
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AdminPageTitle
        title="Module Details"
        subtitle={`View module attributes`}
        backbutton
      />
      {/* <CardTitle title="test card title" /> */}
      <SpecificModuleDetails />
    </Container>
  );
}

export default ViewSpecificModule;
