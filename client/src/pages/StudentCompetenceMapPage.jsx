import React from 'react'
import StudentReactFlowCareerMap from '../components/CompetencyMap/StudentReactFlowCareerMap'
import { Container } from "@mui/material";

function StudentCompetenceMapPage() {
  return (
    <Container
    sx={{
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <StudentReactFlowCareerMap courseCode="C85" />
  </Container>
  )
}

export default StudentCompetenceMapPage