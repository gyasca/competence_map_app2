import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import http from '../../http';

const CertificateUpload = ({ moduleCode, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('moduleCode', moduleCode);

    try {
      const response = await http.post('/certificate/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUploadSuccess(response.data);
    } catch (err) {
      setError('Failed to upload certificate. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [moduleCode, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Upload Certificate
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #cccccc',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <CircularProgress />
        ) : isDragActive ? (
          <Typography>Drop the file here ...</Typography>
        ) : (
          <Box>
            <CloudUploadIcon sx={{ fontSize: 48, color: '#999' }} />
            <Typography>
              Drag 'n' drop a file here, or click to select a file
            </Typography>
            <Typography variant="caption">
              (Accepted formats: JPEG, PNG, GIF, PDF)
            </Typography>
          </Box>
        )}
      </Box>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CertificateUpload;