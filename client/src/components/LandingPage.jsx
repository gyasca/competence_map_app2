import React, { useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  hero: {
    backgroundImage: `url('/background.png')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  content: {
    textAlign: "center",
    padding: theme.spacing(4),
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: "30px",
  },
  features: {
    padding: theme.spacing(8, 0),
  },
  featureItem: {
    textAlign: "center",
    padding: theme.spacing(4),
  },
  appBar: {
    backgroundColor: "#333",
  },
  toolbar: {
    justifyContent: "space-between",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
}));

const LandingPage = () => {
  const classes = useStyles();

  useEffect(() => {
    document.title = "CM App - Competence Mapping";
  }, []);

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        {/* <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.logo}>
            CM App
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar> */}
      </AppBar>
      <Box className={classes.hero}>
        <Box className={classes.content}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to NYP CM App
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Your ultimate competence mapping solution
          </Typography>
          <Button 
  variant="contained" 
  color="white" 
  sx={{ color: 'primary.main' }} 
  size="large"
>
  Get Started
</Button>
        </Box>
      </Box>
      <Container maxWidth="md" className={classes.features}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={classes.featureItem}>
              <Typography variant="h6" component="h3">
                Feature 1
              </Typography>
              <Typography variant="body1">
                Description of feature 1.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={classes.featureItem}>
              <Typography variant="h6" component="h3">
                Feature 2
              </Typography>
              <Typography variant="body1">
                Description of feature 2.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={classes.featureItem}>
              <Typography variant="h6" component="h3">
                Feature 3
              </Typography>
              <Typography variant="body1">
                Description of feature 3.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default LandingPage;