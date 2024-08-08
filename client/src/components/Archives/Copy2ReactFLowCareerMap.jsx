import React, { useState, useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  addEdge,
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
import http from "../http";

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
  backgroundColor: "#f0f0f0",
  borderRadius: "5px",
  textAlign: "center",
  fontSize: 14,
  fontWeight: "bold",
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
    backgroundColor: domainColors[data.domain] || "#ffffff",
  };

  return (
    <div style={nodeStyle}>
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <div>{data.moduleCode}</div>
      <div>CL: {data.tempComplexityLevel}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const ColumnLabelNode = ({ data }) => {
  return <div style={columnLabelStyle}>{data.label}</div>;
};

const Copy2ReactflowCareerMap = ({ courseCode, onModuleUpdate }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    fetchCourseModules();
  }, [courseCode]);

  const fetchCourseModules = async () => {
    setLoading(true);
    try {
      const response = await http.get(
        `/courseModule/course/${courseCode}/modules`
      );
      console.log("Fetched modules:", response.data);
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching course modules:", error);
      setError("Failed to fetch course modules. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = useCallback((module) => {
    setSelectedModule(module);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const initialNodes = useMemo(() => {
    let nodes = [];
    const columnSpacing = 300;
    const nodeHeight = 80;
    const nodeSpacing = 50;

    // Always create column labels for CL1 to CL5
    for (let i = 1; i <= 5; i++) {
      nodes.push({
        id: `column-CL${i}`,
        type: "columnLabel",
        data: { label: `CL${i}` },
        position: { x: (i - 1) * columnSpacing + 100, y: 0 },
        draggable: false,
      });
    }

    // Create nodes for each module
    modules.forEach((module, index) => {
      nodes.push({
        id: module.id.toString(), // Convert to string to ensure consistency
        type: "custom",
        data: {
          courseModuleId: module.id,
          label: module.Module.title,
          moduleCode: module.moduleCode,
          domain: module.Module.domain,
          tempComplexityLevel: module.complexityLevel,
          prevModuleCodes: module.prevModuleCodes,
          nextModuleCodes: module.nextModuleCodes,
        },
        position: {
          x: (module.complexityLevel - 1) * columnSpacing + 100,
          y: (index + 1) * (nodeHeight + nodeSpacing),
        },
      });
    });

    return nodes;
  }, [modules]);

  const initialEdges = useMemo(() => {
    let edges = [];
    modules.forEach((module) => {
      module.nextModuleCodes.forEach((nextCode) => {
        const targetModule = modules.find((m) => m.moduleCode === nextCode);
        if (targetModule) {
          edges.push({
            id: `e${module.id}-${targetModule.id}`,
            source: module.id.toString(),
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
  }, [modules]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: "default",
        animated: true,
        style: { stroke: "black", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "black",
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));

      // Update prevModuleCodes and nextModuleCodes
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === params.source) {
            return {
              ...node,
              data: {
                ...node.data,
                nextModuleCodes: [...node.data.nextModuleCodes, params.target],
              },
            };
          }
          if (node.id === params.target) {
            return {
              ...node,
              data: {
                ...node.data,
                prevModuleCodes: [...node.data.prevModuleCodes, params.source],
              },
            };
          }
          return node;
        })
      );

      // Call the API to update the module
      console.log("params.source value: ", params.source);
      console.log("params.target value: ", params.target);

      updateModuleAPI(params.source);
      updateModuleAPI(params.target);
    },
    [setEdges, setNodes]
  );

  const updateModuleAPI = async (courseModuleToBeUpdatedId) => {
  const module = nodes.find((node) => node.id === courseModuleToBeUpdatedId);
  if (module) {
    const payload = {
      moduleCode: module.data.moduleCode,
      prevModuleCodes: module.data.prevModuleCodes,
      nextModuleCodes: module.data.nextModuleCodes,
      order: module.data.order,
      complexityLevel: parseInt(module.data.tempComplexityLevel),
      courseCode: courseCode,
      levelOfStudy: module.data.levelOfStudy, // Ensure this field exists in module.data
    };

    console.log("Payload to be sent:", payload);

    try {
      await http.put(
        `/courseModule/course/${courseCode}/module/edit/${courseModuleToBeUpdatedId}`,
        payload
      );
      console.log("Module updated successfully:", module.data);
      onModuleUpdate(module.data);
    } catch (error) {
      console.error("Error updating module:", error);
    }
  } else {
    console.error("Module not found for ID:", courseModuleToBeUpdatedId);
  }
};


  const onNodeDragStop = useCallback(
    (event, node) => {
      const newComplexityLevel = Math.floor(node.position.x / 300) + 1;
      if (newComplexityLevel !== node.data.tempComplexityLevel) {
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                data: {
                  ...n.data,
                  tempComplexityLevel: newComplexityLevel,
                },
              };
            }
            return n;
          })
        );
        updateModuleAPI(node.id);
      }
    },
    [setNodes, courseCode, onModuleUpdate]
  );

  const nodeTypes = useMemo(
    () => ({
      custom: CustomNode,
      columnLabel: ColumnLabelNode,
    }),
    []
  );

  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="xl" sx={{ marginTop: "2rem", height: "80vh" }}>
      <Grid container spacing={4} style={{ height: "100%" }}>
        <Grid item xs={12} md={2}>
          <LeftSectionPaper elevation={3}>
            <Typography variant="h5" gutterBottom>
              DAAA Curriculum
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
              onConnect={onConnect}
              onNodeDragStop={onNodeDragStop}
              onNodeClick={(_, node) => {
                if (node.type === "custom") {
                  const fullModuleData = modules.find(
                    (m) => m.id.toString() === node.id
                  );
                  handleClickOpen(fullModuleData);
                }
              }}
              nodeTypes={nodeTypes}
              connectionLineStyle={{ stroke: "black" }}
              defaultEdgeOptions={{
                type: "default",
                animated: true,
                style: { stroke: "black", strokeWidth: 2 },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: "black",
                },
              }}
              fitView
              snapToGrid
              snapGrid={[10, 10]}
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
          {selectedModule?.Module.title}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            <strong>Module Code:</strong> {selectedModule?.moduleCode}
          </Typography>
          <Typography gutterBottom>
            <strong>Complexity Level:</strong> {selectedModule?.complexityLevel}
          </Typography>
          <Typography gutterBottom>
            <strong>Domain:</strong> {selectedModule?.Module.domain}
          </Typography>
          <Typography gutterBottom>
            <strong>Level of Study:</strong> {selectedModule?.levelOfStudy}
          </Typography>
          <Typography gutterBottom>
            <strong>Previous Modules:</strong>{" "}
            {selectedModule?.prevModuleCodes.join(", ") || "None"}
          </Typography>
          <Typography gutterBottom>
            <strong>Next Modules:</strong>{" "}
            {selectedModule?.nextModuleCodes.join(", ") || "None"}
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

export default Copy2ReactflowCareerMap;
