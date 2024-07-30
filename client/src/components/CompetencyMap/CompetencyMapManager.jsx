import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import CourseForm from '../Course/CourseForm';
import CreateModuleForm from '../Module/CreateModuleForm';
import CourseModuleList from '../Course/CourseModuleList';
import CompetencyMapEditor from '../Course/CompetencyMapEditor';

const CompetencyMapManager = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCourseCreated = (course) => {
    setSelectedCourseId(course.id);
    setActiveTab(1); // Move to Module tab
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Create Course" />
        <Tab label="Create Module" />
        <Tab label="Manage Course Modules" />
        <Tab label="Competency Map" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {activeTab === 0 && <CourseForm onCourseCreated={handleCourseCreated} />}
        {activeTab === 1 && <CreateModuleForm />}
        {activeTab === 2 && selectedCourseId && <CourseModuleList courseId={selectedCourseId} />}
        {activeTab === 3 && selectedCourseId && <CompetencyMapEditor courseId={selectedCourseId} />}
      </Box>
    </Box>
  );
};

export default CompetencyMapManager;