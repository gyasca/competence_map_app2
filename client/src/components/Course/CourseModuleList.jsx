import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import http from '../../http';

const CourseModuleList = ({ courseId }) => {
  const [courseModules, setCourseModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [prevModuleId, setPrevModuleId] = useState('');
  const [nextModuleId, setNextModuleId] = useState('');

  useEffect(() => {
    fetchCourseModules();
  }, [courseId]);

  const fetchCourseModules = async () => {
    try {
      const response = await http.get(`/courses/${courseId}/modules`);
      setCourseModules(response.data);
    } catch (error) {
      console.error('Error fetching course modules:', error);
    }
  };

  const handleOpen = (module) => {
    setSelectedModule(module);
    setPrevModuleId(module.prevModuleId || '');
    setNextModuleId(module.nextModuleId || '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedModule(null);
    setPrevModuleId('');
    setNextModuleId('');
  };

  const handleSave = async () => {
    try {
      await http.put(`/course-modules/${selectedModule.id}`, {
        prevModuleId,
        nextModuleId,
      });
      handleClose();
      fetchCourseModules();
    } catch (error) {
      console.error('Error updating course module:', error);
    }
  };

  return (
    <>
      <List>
        {courseModules.map((module) => (
          <ListItem key={module.id} button onClick={() => handleOpen(module)}>
            <ListItemText primary={module.title} secondary={`Code: ${module.moduleCode}`} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Module Relationships</DialogTitle>
        <DialogContent>
          <TextField
            label="Previous Module ID"
            value={prevModuleId}
            onChange={(e) => setPrevModuleId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Next Module ID"
            value={nextModuleId}
            onChange={(e) => setNextModuleId(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseModuleList;