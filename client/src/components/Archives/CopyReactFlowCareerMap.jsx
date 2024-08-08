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

const domainColors = {
  'Programming': '#FFB3BA',
  'Data Analytics': '#BAFFC9',
  'Information Security': '#BAE1FF',
  'Business': '#FFFFBA',
  'AI': '#FFD700',
};

const CustomNode = ({ data }) => {
  const nodeStyle = {
    ...customNodeStyle,
    backgroundColor: domainColors[data.domain] || '#ffffff',
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
  return (
    <div style={columnLabelStyle}>
      {data.label}
    </div>
  );
};

const CopyReactflowCareerMap = ({ courseCode }) => {
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
      const cl = `CL${module.complexityLevel}`;
      if (!modulesMap[cl]) modulesMap[cl] = [];
      modulesMap[cl].push(module);
    });
    return modulesMap;
  }, [modules]);

  const relationships = useMemo(() => {
    let relations = [];
    modules.forEach(module => {
      module.nextModuleCodes.forEach(nextCode => {
        relations.push({
          from: module.moduleCode,
          to: nextCode
        });
      });
    });
    return relations;
  }, [modules]);

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
        position: { x: columnIndex * columnSpacing + 100, y: 0 },
        draggable: false,
      });

      modulesList.forEach((module, rowIndex) => {
        nodes.push({
          id: module.moduleCode,
          type: 'custom',
          data: { 
            label: module.Module.title,
            moduleCode: module.moduleCode,
            domain: module.Module.domain,
            tempComplexityLevel: module.complexityLevel,
          },
          position: { 
            x: columnIndex * columnSpacing + 100, 
            y: (rowIndex + 1) * (nodeHeight + nodeSpacing)
          },
        });
      });
    });

    // Handle case with a single module
    if (modules.length === 1) {
      const singleModule = modules[0];
      nodes.push({
        id: singleModule.moduleCode,
        type: 'custom',
        data: {
          label: singleModule.Module.title,
          moduleCode: singleModule.moduleCode,
          domain: singleModule.Module.domain,
          tempComplexityLevel: singleModule.complexityLevel,
        },
        position: { 
          x: 300, 
          y: 100
        },
      });
    }

    return nodes;
  }, [initialModules, modules]);

  const initialEdges = useMemo(() => relationships.map((rel, index) => ({
    id: `e${index}`,
    source: rel.from,
    target: rel.to,
    type: 'default',
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

  const onNodeDragStop = useCallback((event, node) => {
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
    }
  }, [setNodes]);

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
              {Object.entries(domainColors).map(([domain, color], index) => (
                <CurvyButton 
                  key={index} 
                  variant="contained" 
                  size="small"
                  style={{ backgroundColor: color, color: 'black' }}
                >
                  {domain}
                </CurvyButton>
              ))}
            </Box>
          </LeftSectionPaper>
        </Grid>

        <Grid item xs={12} md={10} style={{ height: '100%', position: 'relative' }}>
          {nodes.length > 0 && edges.length > 0 ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeDragStop={onNodeDragStop}
              onNodeClick={(_, node) => {
                if (node.type === 'custom') {
                  const fullModuleData = modules.find(module => module.moduleCode === node.id);
                  handleClickOpen(fullModuleData);
                }
              }}
              nodeTypes={nodeTypes}
              fitView
              proOptions={proOptions}
            >
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          ) : (
            <Typography>Loading graph data...</Typography>
          )}
        </Grid>
      </Grid>

      {selectedModule && (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedModule.Module.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Domain: {selectedModule.Module.domain}
            </Typography>
            <Typography variant="body1">
              Complexity Level: {selectedModule.complexityLevel}
            </Typography>
            <Typography variant="body1">
              Prerequisite Modules: {selectedModule.preModuleCodes.join(", ")}
            </Typography>
            <Typography variant="body1">
              Next Modules: {selectedModule.nextModuleCodes.join(", ")}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default CopyReactflowCareerMap;
