import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import http from "../../http";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

const CertificateUpload = ({ userId, moduleCode, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > MAX_FILE_SIZE) {
          toast.error("Maximum file size is 1MB");
          return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
          // First, upload the file
          const uploadResponse = await http.post(
            "/file/upload/certificates",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("File upload response:", uploadResponse.data);

          // Then, create the certificate
          const certificateData = {
            moduleCode,
            title: file.name,
            filePath: uploadResponse.data.filename,
          };

          console.log("Certificate data:", certificateData);

          const certificateResponse = await http.post(
            `/certificate/create/${userId}`,
            certificateData
          );

          console.log("Certificate creation response:", certificateResponse.data);

          onUploadSuccess(certificateResponse.data);
          toast.success("Certificate uploaded successfully!");
        } catch (err) {
          setError("Failed to upload certificate. Please try again.");
          console.error("Upload error:", err);
          if (err.response) {
            console.error("Error response:", err.response.data);
            toast.error(`Upload failed: ${err.response.data.message || err.response.data.error || "Unknown error"}`);
          } else {
            toast.error("Upload failed. Please try again.");
          }
        } finally {
          setUploading(false);
        }
      } else {
        toast.error("No file selected or file type not accepted.");
      }
    },
    [moduleCode, onUploadSuccess, userId]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: MAX_FILE_SIZE,
  });

  // Handle file rejections
  React.useEffect(() => {
    fileRejections.forEach(({ file, errors }) => {
      if (errors[0]?.code === "file-too-large") {
        toast.error(`File is larger than 1MB`);
      } else if (errors[0]?.code === "file-invalid-type") {
        toast.error(`File type must be .jpeg, .jpg, .png, .gif, or .pdf`);
      } else {
        toast.error(`File error: ${errors[0]?.message}`);
      }
    });
  }, [fileRejections]);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Upload Certificate
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #cccccc",
          borderRadius: "4px",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#f0f0f0",
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
            <CloudUploadIcon sx={{ fontSize: 48, color: "#999" }} />
            <Typography>
              Drag 'n' drop a file here, or click to select a file
            </Typography>
            <Typography variant="caption">
              (Accepted formats: JPEG, PNG, GIF, PDF. Max size: 1MB)
            </Typography>
          </Box>
        )}
      </Box>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <ToastContainer />
    </Box>
  );
};

export default CertificateUpload;