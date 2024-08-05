import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  addEdge
} from 'reactflow';
import 'reactflow/dist/style.css';

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
import http from '../http';

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
  border: '1px solid #ddd',
  backgroundColor: '#fff',
  width: 200,
  fontSize: 12,
  textAlign: 'center',
};

const columnLabelStyle = {
  padding: '10px',
  backgroundColor: '#f0f0f0',
  borderRadius: '5px',
  textAlign: 'center',
  fontSize: 14,
  fontWeight: 'bold',
  width: 200,
};

const proOptions = { hideAttribution: true };

const CustomNode = ({ data }) => {
  return (
    <div style={customNodeStyle}>
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <div>{data.moduleCode}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const ColumnLabelNode = ({ data }) => {
  return (
    <div style={columnLabelStyle}>
      {data.label}
    </div>
  );
};

const ReactflowCareerMap = ({ courseCode }) => {
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
      const response = await http.get(`/courseModule/course/${courseCode}/modules`);
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

  const initialModules = useMemo(() => {
    const modulesMap = {};
    modules.forEach(module => {
      const cl = `CL${module.competencyLevel}`;
      if (!modulesMap[cl]) modulesMap[cl] = [];
      modulesMap[cl].push(module);
    });
    return modulesMap;
  }, [modules]);

  const relationships = useMemo(() => 
    modules.filter(m => m.nextModuleCode).map(m => ({
      from: m.moduleCode,
      to: m.nextModuleCode
    }))
  , [modules]);

  const initialNodes = useMemo(() => {
    let nodes = [];
    const columnSpacing = 300;
    const nodeHeight = 80;
    const nodeSpacing = 50;

    Object.entries(initialModules).forEach(([column, modulesList], columnIndex) => {
      nodes.push({
        id: `column-${column}`,
        type: 'columnLabel',
        data: { label: column },
        position: { x: columnIndex * columnSpacing, y: 0 },
        draggable: false,
      });

      modulesList.forEach((module, rowIndex) => {
        nodes.push({
          id: module.moduleCode,
          type: 'custom',
          data: { 
            label: module.Module.title,
            moduleCode: module.moduleCode,
          },
          position: { x: columnIndex * columnSpacing, y: (rowIndex + 1) * (nodeHeight + nodeSpacing) },
        });
      });
    });
    return nodes;
  }, [initialModules]);

  const initialEdges = useMemo(() => relationships.map((rel, index) => ({
    id: `e${index}`,
    source: rel.from,
    target: rel.to,
    type: 'bezier',
    animated: true,
    style: { stroke: 'purple', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'purple',
    },
  })), [relationships]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
    columnLabel: ColumnLabelNode,
  }), []);

  useEffect(() => {
    if (initialNodes.length > 0 && initialEdges.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="xl" sx={{ marginTop: "2rem", height: "80vh" }}>
      <Grid container spacing={4} style={{ height: '100%' }}>
        <Grid item xs={12} md={2}>
          <LeftSectionPaper elevation={3}>
            <Typography variant="h5" gutterBottom>
              DAAA Curriculum
            </Typography>
            <Box display="flex" flexDirection="column">
              {['Category 1', 'Category 2', 'Category 3'].map((category, index) => (
                <CurvyButton key={index} variant="contained" size="small">
                  {category}
                </CurvyButton>
              ))}
            </Box>
          </LeftSectionPaper>
        </Grid>

        <Grid item xs={12} md={10} style={{ height: '100%', border: '1px solid red' }}>
          {nodes.length > 0 && edges.length > 0 ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) => {
                if (node.type === 'custom') {
                  handleClickOpen(node.data);
                }
              }}
              nodeTypes={nodeTypes}
              connectionLineStyle={{ stroke: 'purple' }}
              defaultEdgeOptions={{
                type: 'bezier',
                style: { stroke: 'purple', strokeWidth: 2 },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: 'purple',
                },
              }}
              fitView
              snapToGrid
              proOptions={proOptions}
            >
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          ) : (
            <Typography>No data to display</Typography>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {selectedModule?.label}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom><strong>Module Code:</strong> {selectedModule?.moduleCode}</Typography>
          {/* Add more details here if needed */}
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

export default ReactflowCareerMap;