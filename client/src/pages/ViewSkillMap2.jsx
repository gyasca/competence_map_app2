import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
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
} from "@mui/material";
import { styled } from "@mui/system";

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

const categories = [
  "Business Innovation & Enterprise",
  "Programming",
  "Web & UX Design",
  "Data Structures & Algorithms",
  "Marketing Strategy",
  "Full Stack Development for Data Science",
];

const initialModules = {
  CL1: [
    "Mathematical Analysis & Application",
    "Network Technologies",
    "Statistical Research Methods",
    "Business Innovation & Enterprise",
    "Programming",
  ],
  CL2: [
    "Cybersecurity Technologies & Ethics",
    "AI & Data Analytics",
    "Database Design & Administration",
    "Web & UX Design",
  ],
  CL3: [
    "Predictive Modelling",
    "Data Wrangling",
    "Marketing Strategy",
    "Data Structures & Algorithms",
  ],
  CL4: [
    "Applied Machine Learning",
    "AI Ethics & Governance",
    "Data Platform Management",
    "Data Journalism",
  ],
  CL5: [
    "Applied Deep Learning",
    "Text Analytics",
    "Machine Learning Operations",
    "Data Processing on Big Data",
    "Full Stack Development for Data Science",
  ],
  Outcomes: [
    "Analytics & Computational Modelling",
    "Applied Artificial Intelligence",
    "Data Strategy for AIOps",
    "Emerging Technology & Application",
    "Data Visualization & Journalism",
    "DataOps for AI Innovation",
    "Business Needs Analysis & Strategy",
    "Agile Development for Data Science",
  ],
};

const relationships = [
    { from: "Mathematical Analysis & Application", to: "Predictive Modelling" },
    { from: "Predictive Modelling", to: "Applied Machine Learning" },
    { from: "Applied Machine Learning", to: "Applied Deep Learning" },
    { from: "Applied Deep Learning", to: "Applied Artificial Intelligence" },
    { from: "Predictive Modelling", to: "Text Analytics" },
    { from: "Text Analytics", to: "Analytics & Computational Modelling" },
  
    { from: "Network Technologies", to: "Cybersecurity Technologies & Ethics" },
    {
      from: "Cybersecurity Technologies & Ethics",
      to: "Data Platform Management",
    },
    { from: "Data Platform Management", to: "Machine Learning Operations" },
    { from: "Machine Learning Operations", to: "Data Strategy for AIOps" },
    { from: "Cybersecurity Technologies & Ethics", to: "AI Ethics & Governance" },
    { from: "AI Ethics & Governance", to: "Technology Synthesis & Application" },
    {
      from: "Technology Synthesis & Application",
      to: "Emerging Technology & Application",
    },
  
    { from: "Statistical Research Methods", to: "AI & Data Analytics" },
    { from: "AI & Data Analytics", to: "AI Ethics & Governance" },
    { from: "AI & Data Analytics", to: "Data Journalism" },
    { from: "Data Journalism", to: "Data Visualization & Journalism" },
  
    { from: "Database Design & Administration", to: "Data Wrangling" },
    { from: "Data Wrangling", to: "Data Processing on Big Data" },
    { from: "Data Processing on Big Data", to: "DataOps for AI Innovation" },
  
    { from: "Business Innovation & Enterprise", to: "Marketing Strategy" },
    { from: "Marketing Strategy", to: "Business Needs Analysis & Strategy" },
  
    { from: "Programming", to: "Web & UX Design" },
    { from: "Web & UX Design", to: "Data Structures & Algorithms" },
    {
      from: "Data Structures & Algorithms",
      to: "Full Stack Development for Data Science",
    },
    {
      from: "Full Stack Development for Data Science",
      to: "Agile Development for Data Science",
    },
  ];

const customNodeStyle = {
  padding: 10,
  borderRadius: 5,
  border: '1px solid #ddd',
  backgroundColor: '#fff',
  width: 200,
  fontSize: 12,
  textAlign: 'center',
};

const CustomNode = ({ data, isConnectable }) => {
  return (
    <div style={customNodeStyle}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div>{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
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

const ColumnLabelNode = ({ data }) => {
  return (
    <div style={columnLabelStyle}>
      {data.label}
    </div>
  );
};

const proOptions = { hideAttribution: true };

const ViewSkillMap2 = () => {
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState("");

  const handleClickOpen = useCallback((module) => {
    setSelectedModule(module);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const columnWidth = 250;
  const nodeHeight = 80;
  const nodeSpacing = 50;
  const columnSpacing = 300; // Increased spacing between columns

  const initialNodes = useMemo(() => {
    let nodes = [];
    Object.entries(initialModules).forEach(([column, modules], columnIndex) => {
      // Add column label node
      nodes.push({
        id: `column-${column}`,
        type: 'columnLabel',
        data: { label: column },
        position: { x: columnIndex * columnSpacing, y: 0 },
        draggable: false,
      });

      // Add module nodes
      modules.forEach((module, rowIndex) => {
        nodes.push({
          id: module,
          type: 'custom',
          data: { label: module },
          position: { x: columnIndex * columnSpacing, y: (rowIndex + 1) * (nodeHeight + nodeSpacing) },
        });
      });
    });
    return nodes;
  }, []);

  const initialEdges = useMemo(() => relationships.map((rel, index) => ({
    id: `e${index}`,
    source: rel.from,
    target: rel.to,
    type: 'bezier', // Changed to bezier for smoother curves
    animated: true,
    style: { stroke: 'purple', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'purple',
    },
  })), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
    columnLabel: ColumnLabelNode,
  }), []);

  return (
    <Container maxWidth="xl" sx={{ marginTop: "2rem", height: "80vh" }}>
      <Grid container spacing={4} style={{ height: '100%' }}>
        <Grid item xs={12} md={2}>
          <LeftSectionPaper elevation={3}>
            <Typography variant="h5" gutterBottom>
              DAAA Curriculum
            </Typography>
            <Box display="flex" flexDirection="column">
              {categories.map((category, index) => (
                <CurvyButton key={index} variant="contained" size="small">
                  {category}
                </CurvyButton>
              ))}
            </Box>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button size="small">1</Button>
              <Button size="small">2</Button>
              <Button size="small">3</Button>
            </Box>
          </LeftSectionPaper>
        </Grid>

        <Grid item xs={12} md={10} style={{ height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => {
              if (node.type === 'custom') {
                handleClickOpen(node.data.label);
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
            {/* <MiniMap /> */}
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {selectedModule} Certifications
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Dummy Certification 1</Typography>
          <Typography gutterBottom>Dummy Certification 2</Typography>
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

export default ViewSkillMap2;