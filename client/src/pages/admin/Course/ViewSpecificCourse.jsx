import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Container } from "@mui/material";
import SpecificCourseDetails from "../../../components/Course/SpecificCourseDetails";
import ReactflowCareerMap from "../../../components/ReactFlowCareerMap";

const ViewSpecificCourse = () => {
  const { courseCode } = useParams();
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleModuleUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  return (
    <Container
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        mt: "4%",
        mb: "4%",
      }}
    >
      <SpecificCourseDetails courseCode={courseCode} onModuleUpdate={handleModuleUpdate} />
      <br /><br />
      {/* Not working */}
      {/* <CompetencyMapEditor courseCode={courseCode} /> */}

      {/* Working */}
      {/* Iteration 1 (Proprietory mapping component) */}
      {/* <CareerMap courseCode={courseCode} /> */}

      {/* Iteration 2 (Packaged mapping component - npm i reactflow) */}
      <ReactflowCareerMap 
        courseCode={courseCode} 
        updateTrigger={updateTrigger}
      />
    </Container>
  );
};

export default ViewSpecificCourse;