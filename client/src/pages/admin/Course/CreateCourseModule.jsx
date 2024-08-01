import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CreateCourseModuleForm from '../../../components/Course/CourseModuleForm';

function CreateCourseModule() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(`/admin/courses/${courseId}/modules`);
  };

  const handleModuleAdded = () => {
    navigate(`/admin/courses/${courseId}/modules`);
  };

  return (
    <CreateCourseModuleForm 
      courseId={courseId} 
      onClose={handleClose}
      onModuleAdded={handleModuleAdded}
    />
  );
}

export default CreateCourseModule;