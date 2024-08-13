import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import http from "../../http";

const MAX_FILE_SIZE = 2048 * 2048; // 2MB

const CertificateUpload = ({
  userId,
  moduleCode,
  onUploadSuccess,
  onFileUpload,
  onFileDelete,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > MAX_FILE_SIZE) {
          toast.error("Maximum file size is 2MB");
          return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${
              import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
            }/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          setUploadedFile({
            publicId: data.public_id,
            url: data.secure_url,
            originalname: file.name,
          });
          toast.success(
            "File uploaded successfully. Please submit the certificate."
          );
          onFileUpload(data.public_id);
        } catch (err) {
          setError("Failed to upload file. Please try again.");
          console.error("Upload error:", err);
          toast.error("Upload failed. Please try again.");
        } finally {
          setUploading(false);
        }
      } else {
        toast.error("No file selected or file type not accepted.");
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".gif"],
        "application/pdf": [".pdf"],
      },
      multiple: false,
      maxSize: MAX_FILE_SIZE,
    });

  // Handle file rejections
  useEffect(() => {
    fileRejections.forEach(({ file, errors }) => {
      if (errors[0]?.code === "file-too-large") {
        toast.error(`File is larger than 2MB`);
      } else if (errors[0]?.code === "file-invalid-type") {
        toast.error(`File type must be .jpeg, .jpg, .png, .gif, or .pdf`);
      } else {
        toast.error(`File error: ${errors[0]?.message}`);
      }
    });
  }, [fileRejections]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for the certificate");
      return;
    }

    if (!uploadedFile) {
      toast.error("Please upload a file first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const certificateData = {
        moduleCode,
        title: title.trim(),
        filePath: uploadedFile.publicId,
        fileUrl: uploadedFile.url,
      };

      const certificateResponse = await http.post(
        `/certificate/create/${userId}`,
        certificateData
      );

      onUploadSuccess(certificateResponse.data);
      toast.success("Certificate submitted successfully!");
      setTitle("");
      setUploadedFile(null);
    } catch (err) {
      setError("Failed to submit certificate. Please try again.");
      console.error("Submission error:", err);
      toast.error("Submission failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (uploadedFile) {
      try {
        // Note: Deleting from Cloudinary should be done on the backend for security
        await http.delete(`/file/delete/${uploadedFile.publicId}`);
        setUploadedFile(null);
        toast.success("File deleted successfully");
        onFileDelete();
      } catch (error) {
        console.error("Error deleting uploaded file:", error);
        toast.error("Failed to delete uploaded file");
      }
    }
  };

  return (
    <Card
      sx={{
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
        padding: 1,
      }}
    >
      <CardContent sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Upload Certificate
        </Typography>
        <TextField
          fullWidth
          label="Certificate Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        {!uploadedFile && (
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #cccccc",
              borderRadius: "10px",
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
                  (Accepted formats: JPEG, PNG, GIF, PDF. Max size: 2MB)
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {uploadedFile && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {uploadedFile.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  height: 200,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                <img
                  src={uploadedFile.url}
                  alt="Uploaded certificate"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  height: 200,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#f0f0f0",
                  mb: 2,
                }}
              >
                <Typography>PDF Preview Not Available</Typography>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography>
                File uploaded: {uploadedFile.originalname}
              </Typography>
              <IconButton onClick={handleDelete} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!uploadedFile || uploading}
          fullWidth
          sx={{ borderRadius: "8px 8px 15px 15px", mb: 2 }}
        >
          SUBMIT CERTIFICATE
        </Button>
      </CardActions>
      <ToastContainer />
    </Card>
  );
};

export default CertificateUpload;
