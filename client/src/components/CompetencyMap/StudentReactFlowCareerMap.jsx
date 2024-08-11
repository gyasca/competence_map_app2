import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext
} from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import http from "../../http";
import { UserContext } from "../../main";
import { validateUser } from "../../functions/user";
import { Navigate } from "react-router-dom";

const CurvyButton = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
  margin: theme.spacing(1),
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
}));

const LeftSectionPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "20px",
  padding: theme.spacing(2),
  backgroundColor: "#F0F4F8",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  height: "100%",
}));

const customNodeStyle = {
  padding: 10,
  borderRadius: 5,
  border: "1px solid #ddd",
  width: 200,
  fontSize: 12,
  textAlign: "center",
};

const columnLabelStyle = {
  padding: "10px",
  backgroundColor: "#083c84",
  borderRadius: "15px",
  textAlign: "center",
  fontSize: 14,
  fontWeight: "bold",
  color: "white",
  width: 200,
};

const proOptions = { hideAttribution: true };

const domainColors = {
  Programming: "#FFB3BA",
  "Data Analytics": "#BAFFC9",
  "Information Security": "#BAE1FF",
  Business: "#FFFFBA",
  AI: "#FFD700",
};

const CustomNode = ({ data }) => {
  const nodeStyle = {
    ...customNodeStyle,
    backgroundColor: domainColors[data.domain] || "#e4f1f5",
    borderRadius: "20px",
    border: "1px solid #b5b5b5",
  };

  return (
    <div style={nodeStyle}>
      <Handle type="target" position={Position.Left} />
      <div>{data.title}</div>
      <div>{data.moduleCode}</div>
      <div>CL: {data.complexityLevel}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const ColumnLabelNode = ({ data }) => {
  return <div style={columnLabelStyle}>{data.label}</div>;
};

const nodeTypes = {
  custom: CustomNode,
  columnLabel: ColumnLabelNode,
};

const StudentReactFlowCareerMap = ({ courseCode }) => {
  const [courseModules, setCourseModules] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedCourseModule, setSelectedCourseModule] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { user } = useContext(UserContext);

  const handleClickOpen = useCallback(async (moduleData) => {
    setSelectedCourseModule(moduleData);
    setLoading(true);
    try {
      const response = await http.get(`/module/${moduleData.moduleCode}`);
      setSelectedModule(response.data);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching module details:", error);
      setError("Failed to fetch module details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedModule(null);
    setSelectedCourseModule(null);
  }, []);

  const initialNodes = useMemo(() => {
    let nodes = [];
    const columnSpacing = 300;
    const nodeHeight = 80;
    const nodeSpacing = 50;

    for (let i = 1; i <= 5; i++) {
      nodes.push({
        id: `column-CL${i}`,
        type: "columnLabel",
        data: { label: `CL${i}` },
        position: { x: (i - 1) * columnSpacing + 100, y: 0 },
        draggable: false,
      });
    }

    courseModules.forEach((courseModule, index) => {
      const position = {
        x:
          courseModule.positionX !== null
            ? courseModule.positionX
            : (courseModule.complexityLevel - 1) * columnSpacing + 100,
        y:
          courseModule.positionY !== null
            ? courseModule.positionY
            : (index + 1) * (nodeHeight + nodeSpacing),
      };

      nodes.push({
        id: courseModule.id.toString(),
        type: "custom",
        data: {
          ...courseModule,
          title: courseModule.Module.title,
          domain: courseModule.Module.domain,
        },
        position: position,
        draggable: false,
      });
    });

    return nodes;
  }, [courseModules]);

  const initialEdges = useMemo(() => {
    let edges = [];
    courseModules.forEach((courseModule) => {
      courseModule.nextModuleCodes.forEach((nextCode) => {
        const targetModule = courseModules.find((m) => m.moduleCode === nextCode);
        if (targetModule) {
          edges.push({
            id: `e${courseModule.id}-${targetModule.id}`,
            source: courseModule.id.toString(),
            target: targetModule.id.toString(),
            type: "default",
            animated: true,
            style: { stroke: "black", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "black",
            },
          });
        }
      });
    });
    return edges;
  }, [courseModules]);

  useEffect(() => {
    const fetchCourseAndModules = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const courseResponse = await http.get(`/course/${courseCode}`);
        setCourse(courseResponse.data);
  
        // Fetch course modules
        const courseModulesResponse = await http.get(`/courseModule/course/${courseCode}/modules`);
        setCourseModules(courseModulesResponse.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError("Failed to fetch course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourseAndModules();
  }, [courseCode]);

  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (!validateUser()) {
    return <Navigate to="/login" />;
  }

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="xl" sx={{ marginTop: "2rem", height: "80vh" }}>
      <Grid container spacing={4} style={{ height: "100%" }}>
        <Grid item xs={12} md={2}>
          <LeftSectionPaper elevation={3}>
            <Typography variant="h5" gutterBottom>
              {course?.name} Curriculum
            </Typography>
            <Box display="flex" flexDirection="column">
              {Object.entries(domainColors).map(([domain, color], index) => (
                <CurvyButton
                  key={index}
                  variant="contained"
                  size="small"
                  style={{ backgroundColor: color, color: "black" }}
                >
                  {domain}
                </CurvyButton>
              ))}
            </Box>
          </LeftSectionPaper>
        </Grid>

        <Grid
          item
          xs={12}
          md={10}
          style={{ height: "100%", position: "relative" }}
        >
          <Paper
            style={{
              height: "100%",
              position: "relative",
              padding: 3,
              boxShadow:
                "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              // onNodeClick={(_, node) => {
              //   if (node.type === "custom") {
              //     handleClickOpen(node.data.moduleCode);
              //   }
              // }}
              onNodeClick={(_, node) => {
                if (node.type === "custom") {
                  const fullModuleData = courseModules.find(
                    (m) => m.id.toString() === node.id
                  );
                  handleClickOpen(fullModuleData);
                }
              }}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.5}
              maxZoom={1.5}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              proOptions={proOptions}
            >
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {selectedModule?.title}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            <strong>Module Code:</strong> {selectedModule?.moduleCode}
          </Typography>
          <Typography gutterBottom>
            <strong>Description:</strong> {selectedModule?.description}
          </Typography>
          <Typography gutterBottom>
            <strong>Domain:</strong> {selectedModule?.domain}
          </Typography>
          <Typography gutterBottom>
            <strong>Level of Study:</strong> {selectedModule?.levelOfStudy || "None"}
          </Typography>
          <Typography gutterBottom>
            <strong>Credit:</strong> {selectedModule?.credit}
          </Typography>
          <Typography gutterBottom>
            <strong>School:</strong> {selectedModule?.school}
          </Typography>
          <Typography gutterBottom>
            <strong>Prerequisite:</strong> {selectedModule?.prerequisite || "None"}
          </Typography>
          <Typography gutterBottom>
            <strong>Complexity Level:</strong> {selectedCourseModule?.complexityLevel}
          </Typography>
          <Typography gutterBottom>
            <strong>Previous Modules:</strong>{" "}
            {selectedCourseModule?.prevModuleCodes.join(", ") || "None"}
          </Typography>
          <Typography gutterBottom>
            <strong>Next Modules:</strong>{" "}
            {selectedCourseModule?.nextModuleCodes.join(", ") || "None"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentReactFlowCareerMap;