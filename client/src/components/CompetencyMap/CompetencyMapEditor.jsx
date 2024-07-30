import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ArcherContainer, ArcherElement } from 'react-archer';
import http from '../../http';

const CompetencyMapEditor = ({ courseId }) => {
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    fetchCompetencyMap();
  }, [courseId]);

  const fetchCompetencyMap = async () => {
    try {
      const response = await http.get(`/courses/${courseId}/competency-map`);
      setModules(response.data);
    } catch (error) {
      console.error('Error fetching competency map:', error);
    }
  };

  const handleOpen = (module) => {
    setSelectedModule(module);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedModule(null);
  };

  const handleSave = async () => {
    try {
      await http.put(`/competency-map-modules/${selectedModule.id}`, selectedModule);
      handleClose();
      fetchCompetencyMap();
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  const renderModule = (module) => (
    <ArcherElement
      id={module.id.toString()}
      relations={[
        {
          targetId: module.nextModuleId?.toString(),
          targetAnchor: 'left',
          sourceAnchor: 'right',
          style: { strokeColor: 'blue', strokeWidth: 1 },
        },
      ]}
    >
      <Box
        onClick={() => handleOpen(module)}
        sx={{
          border: '1px solid black',
          padding: 2,
          borderRadius: 1,
          cursor: 'pointer',
          backgroundColor: 'white',
        }}
      >
        {module.title}
      </Box>
    </ArcherElement>
  );

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <ArcherContainer strokeColor="red">
        <Box display="flex" flexDirection="column" gap={4}>
          {[1, 2, 3, 4, 5].map((row) => (
            <Box key={row} display="flex" gap={4}>
              {modules
                .filter((module) => module.row === row)
                .map((module) => (
                  <Box key={module.id}>{renderModule(module)}</Box>
                ))}
            </Box>
          ))}
        </Box>
      </ArcherContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Module</DialogTitle>
        <DialogContent>
          <TextField
            label="Row"
            type="number"
            value={selectedModule?.row || ''}
            onChange={(e) => setSelectedModule({ ...selectedModule, row: parseInt(e.target.value) })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Column"
            type="number"
            value={selectedModule?.column || ''}
            onChange={(e) => setSelectedModule({ ...selectedModule, column: parseInt(e.target.value) })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Previous Module ID"
            value={selectedModule?.prevModuleId || ''}
            onChange={(e) => setSelectedModule({ ...selectedModule, prevModuleId: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Next Module ID"
            value={selectedModule?.nextModuleId || ''}
            onChange={(e) => setSelectedModule({ ...selectedModule, nextModuleId: e.target.value })}
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
    </Box>
  );
};

export default CompetencyMapEditor;