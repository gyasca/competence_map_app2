import React from 'react';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import { ArcherContainer, ArcherElement } from 'react-archer';

const CurvyPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(2),
  backgroundColor: '#F0F4F8',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(4),
}));

const CurvyButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  margin: theme.spacing(1),
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
}));

const categories = ['Business Innovation & Enterprise', 'Programming', 'Web & UX Design', 'Data Structures & Algorithms', 'Marketing Strategy', 'Full Stack Development for Data Science'];

const modules = {
  CL1: ['Mathematical Analysis & Application', 'Network Technologies', 'Statistical Research Methods', 'Business Innovation & Enterprise', 'Programming'],
  CL2: ['Cybersecurity Technologies & Ethics', 'AI & Data Analytics', 'Database Design & Administration', 'Web & UX Design'],
  CL3: ['Predictive Modelling', 'Data Wrangling', 'Marketing Strategy', 'Data Structures & Algorithms'],
  CL4: ['Applied Machine Learning', 'AI Ethics & Governance', 'Data Platform Management', 'Data Journalism'],
  CL5: ['Applied Deep Learning', 'Text Analytics', 'Machine Learning Operations', 'Data Processing on Big Data', 'Full Stack Development for Data Science'],
};

const outcomes = ['Analytics & Computational Modelling', 'Applied Artificial Intelligence', 'Data Strategy for AIOps', 'Emerging Technology & Application', 'Data Visualization & Journalism', 'DataOps for AI Innovation', 'Business Needs Analysis & Strategy', 'Agile Development for Data Science'];

const relationships = [
  { from: 'Mathematical Analysis & Application', to: 'Predictive Modelling' },
  { from: 'Predictive Modelling', to: 'Applied Machine Learning' },
  { from: 'Applied Machine Learning', to: 'Applied Deep Learning' },
  { from: 'Applied Deep Learning', to: 'Applied Artificial Intelligence' },
  { from: 'Predictive Modelling', to: 'Text Analytics' },
  { from: 'Text Analytics', to: 'Analytics & Computational Modelling' },
  
  { from: 'Network Technologies', to: 'Cybersecurity Technologies & Ethics' },
  { from: 'Cybersecurity Technologies & Ethics', to: 'Data Platform Management' },
  { from: 'Data Platform Management', to: 'Machine Learning Operations' },
  { from: 'Machine Learning Operations', to: 'Data Strategy for AIOps' },
  { from: 'Cybersecurity Technologies & Ethics', to: 'AI Ethics & Governance' },
  { from: 'AI Ethics & Governance', to: 'Technology Synthesis & Application' },
  { from: 'Technology Synthesis & Application', to: 'Emerging Technology & Application' },

  { from: 'Statistical Research Methods', to: 'AI & Data Analytics' },
  { from: 'AI & Data Analytics', to: 'AI Ethics & Governance' },
  { from: 'AI & Data Analytics', to: 'Data Journalism' },
  { from: 'Data Journalism', to: 'Data Visualization & Journalism' },

  { from: 'Database Design & Administration', to: 'Data Wrangling' },
  { from: 'Data Wrangling', to: 'Data Processing on Big Data' },
  { from: 'Data Processing on Big Data', to: 'DataOps for AI Innovation' },

  { from: 'Business Innovation & Enterprise', to: 'Marketing Strategy' },
  { from: 'Marketing Strategy', to: 'Business Needs Analysis & Strategy' },

  { from: 'Programming', to: 'Web & UX Design' },
  { from: 'Web & UX Design', to: 'Data Structures & Algorithms' },
  { from: 'Data Structures & Algorithms', to: 'Full Stack Development for Data Science' },
  { from: 'Full Stack Development for Data Science', to: 'Agile Development for Data Science' },
];

const ViewSkillMap = () => {
  return (
    <Container maxWidth="xl" sx={{ marginTop: '2rem' }}>
      <Grid container spacing={4}> 
        {/* Left Section */}
        <Grid item xs={12} md={2}>
          <CurvyPaper elevation={3}>
            <Typography variant="h5" gutterBottom>DAAA Curriculum</Typography>
            {categories.map((category, index) => (
              <CurvyButton key={index} fullWidth variant="contained">
                {category}
              </CurvyButton>
            ))}
            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={2}>
              <Button>1</Button>
              <Button>2</Button>
              <Button>3</Button>
            </Box>
          </CurvyPaper>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={10}>
          <ArcherContainer strokeColor="blue">
            <Grid container spacing={4}>
              {Object.keys(modules).map((cl, index) => (
                <Grid item xs={2} key={index}>
                  <Typography variant="h6" textAlign="center">{cl}</Typography>
                  {modules[cl].map((module, i) => (
                    <ArcherElement
                      key={i}
                      id={module}
                      relations={relationships
                        .filter((rel) => rel.from === module)
                        .map((rel) => ({
                          targetId: rel.to,
                          targetAnchor: 'left',
                          sourceAnchor: 'right',
                          style: { strokeColor: 'blue', strokeWidth: 2 },
                        }))}
                    >
                      <CurvyPaper elevation={3}>
                        <Typography variant="body1">{module}</Typography>
                      </CurvyPaper>
                    </ArcherElement>
                  ))}
                </Grid>
              ))}
              <Grid item xs={2}>
                <Typography variant="h6" textAlign="center">Outcomes</Typography>
                {outcomes.map((outcome, i) => (
                  <ArcherElement
                    key={i}
                    id={outcome}
                  >
                    <CurvyPaper elevation={3}>
                      <Typography variant="body1">{outcome}</Typography>
                    </CurvyPaper>
                  </ArcherElement>
                ))}
              </Grid>
            </Grid>
          </ArcherContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewSkillMap;