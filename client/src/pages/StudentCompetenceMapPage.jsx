import React from 'react'
import StudentReactFlowCareerMap from '../components/CompetencyMap/StudentReactFlowCareerMap'
import { Container } from "@mui/material";

function StudentCompetenceMapPage() {
  return (
    <Container maxWidth="xl" sx={{ height: "80vh" }}>
    <StudentReactFlowCareerMap courseCode="C85" />
  </Container>
  )
}

export default StudentCompetenceMapPage