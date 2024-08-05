import React from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Container } from "@mui/material";
import SpecificCourseDetails from "../../../components/Course/SpecificCourseDetails";
import CompetencyMapEditor from "../../../components/Course/CompetencyMapEditor";
import CareerMap from "../../../components/CareerMap";
import ReactflowCareerMap from "../../../components/ReactFlowCareerMap";

const ViewSpecificCourse = () => {
  const { courseCode } = useParams();

  return (
    <Container
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        mt: "4%",
      }}
    >
      <SpecificCourseDetails courseCode={courseCode} />
      <br /><br />
      {/* Not working */}
      {/* <CompetencyMapEditor courseCode={courseCode} /> */}

      {/* Working */}
      {/* Iteration 1 (Proprietory mapping component) */}
      {/* <CareerMap courseCode={courseCode} /> */}

      {/* Iteration 2 (Packaged mapping component - npm i reactflow) */}
      <ReactflowCareerMap courseCode={courseCode} />
    </Container>
  );
};

export default ViewSpecificCourse;
