import React from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Container } from "@mui/material";
import SpecificCourseDetails from "../../../components/Course/SpecificCourseDetails";
import CompetencyMapEditor from "../../../components/Course/CompetencyMapEditor";
import CareerMap from "../../../components/CareerMap";

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
      {/* <CompetencyMapEditor courseCode={courseCode} /> */}
      <CareerMap courseCode={courseCode} />
    </Container>
  );
};

export default ViewSpecificCourse;
