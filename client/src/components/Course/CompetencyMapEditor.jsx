import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Xarrow from 'react-xarrows';
import Draggable from 'react-draggable';
import http from '../../http';

const CompetencyMapEditor = ({ courseCode }) => {
  const [modules, setModules] = useState([]);
  const [relationships, setRelationships] = useState([]);

  useEffect(() => {
    const fetchCompetencyMap = async () => {
      const response = await http.get(`/competency-maps/${courseCode}`);
      setModules(response.data.modules);
      setRelationships(response.data.relationships);
    };
    fetchCompetencyMap();
  }, [courseCode]);

  const handleDrag = (e, ui, id) => {
    const updatedModules = modules.map(module => 
      module.id === id ? { ...module, xPosition: module.xPosition + ui.deltaX, yPosition: module.yPosition + ui.deltaY } : module
    );
    setModules(updatedModules);
  };

  const handleSave = async () => {
    await http.put(`/competency-maps/${courseCode}`, { modules, relationships });
  };

  const handleAddRelationship = (fromModuleId, toModuleId) => {
    setRelationships([...relationships, { fromModuleId, toModuleId }]);
  };

  const handleRemoveRelationship = (fromModuleId, toModuleId) => {
    setRelationships(relationships.filter(
      rel => !(rel.fromModuleId === fromModuleId && rel.toModuleId === toModuleId)
    ));
  };

  return (
    <Box sx={{ width: '100%', height: '600px', position: 'relative', border: '1px solid #ccc' }}>
      <Typography variant="h4" gutterBottom>Competency Map Editor</Typography>
      {modules.map(module => (
        <Draggable
          key={module.id}
          position={{ x: module.xPosition, y: module.yPosition }}
          onStop={(e, ui) => handleDrag(e, ui, module.id)}
        >
          <div style={{ 
            padding: '10px', 
            border: '1px solid black', 
            backgroundColor: 'white',
            cursor: 'move'
          }}>
            {module.title}
          </div>
        </Draggable>
      ))}
      {relationships.map((relationship, index) => (
        <Xarrow
          key={index}
          start={relationship.fromModuleId.toString()}
          end={relationship.toModuleId.toString()}
          color="red"
          headSize={3}
          strokeWidth={2}
        />
      ))}
      <Button onClick={handleSave} variant="contained" color="primary" style={{ position: 'absolute', bottom: 10, right: 10 }}>
        Save Competency Map
      </Button>
    </Box>
  );
};

export default CompetencyMapEditor;