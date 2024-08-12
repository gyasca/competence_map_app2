import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
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
  Pagination,
} from "@mui/material";
import { styled } from "@mui/system";
import http from "../../http";
import { UserContext } from "../../main";
import { validateUser } from "../../functions/user";
import { Navigate } from "react-router-dom";
import CertificateUpload from "../Certificate/CertificateUpload";

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
  fontSize: 20,
  textAlign: "center",
};

const columnLabelStyle = {
  padding: "10px",
  backgroundColor: "#083c84",
  borderRadius: "15px",
  textAlign: "center",
  fontSize: 35,
  fontWeight: "bold",
  color: "white",
  width: 200,
};

const proOptions = { hideAttribution: true };

// Define a list of 100 distinct colors
const domainColors = [
  "#FFD1DC", // light coral pink
  "#FFCC99", // light apricot
  "#B3E5FC", // light sky blue
  "#C8E6C9", // light mint green
  "#FFECB3", // light vanilla
  "#E1BEE7", // light lavender
  "#FFE0B2", // light peach
  "#B2DFDB", // light teal
  "#FFCDD2", // light blush pink
  "#DCEDC8", // light lime
  "#F8BBD0", // light pink
  "#D1C4E9", // light purple
  "#FFAB91", // light salmon
  "#C5CAE9", // light periwinkle
  "#FFCC80", // light tangerine
  "#B3E5FC", // light baby blue
  "#D7CCC8", // light mocha
  "#FFF59D", // light lemon
  "#FFE082", // light marigold
  "#FFAB91", // light coral
  "#B39DDB", // light wisteria
  "#FF8A65", // light terra cotta
  "#BCAAA4", // light taupe
  "#FF7043", // light burnt orange
  "#A5D6A7", // light mint
  "#FFCCBC", // light peach cream
  "#F48FB1", // light rose pink
  "#80DEEA", // light aqua
  "#FFEB3B", // light golden yellow
  "#C6FF00", // light chartreuse
  "#FFEBEE", // light pink blush
  "#E1F5FE", // light sky blue
  "#E0F7FA", // light turquoise
  "#F3E5F5", // light lavender mist
  "#FFF3E0", // light cream orange
  "#E8F5E9", // light mint
  "#FFFDE7", // light buttercream
  "#EDE7F6", // light soft violet
  "#FBE9E7", // light apricot blush
  "#FFEBEE", // light blush rose
  "#E3F2FD", // light baby blue
  "#FCE4EC", // light pink foam
  "#E8EAF6", // light lavender blue
  "#FFECB3", // light banana yellow
  "#FFE082", // light light orange
  "#E8F5E9", // light pale green
  "#FFEB3B", // light sunny yellow
  "#FFF9C4", // light light yellow
  "#D7CCC8", // light beige
  "#FFCDD2", // light rosy pink
  "#C5CAE9", // light violet blue
  "#FFE0B2", // light apricot cream
  "#FFCC80", // light pastel orange
  "#FFAB91", // light salmon pink
  "#D1C4E9", // light purple haze
  "#B2DFDB", // light teal mint
  "#F8BBD0", // light pink blush
  "#DCEDC8", // light lime sherbet
  "#FBE9E7", // light coral peach
  "#E1BEE7", // light lavender blush
  "#C8E6C9", // light mint green
  "#B3E5FC", // light sky blue
  "#FFECB3", // light vanilla
  "#FFCCBC", // light peach cream
  "#D7CCC8", // light taupe
  "#F8BBD0", // light pink petal
  "#B2DFDB", // light sea foam
  "#E1F5FE", // light light blue
  "#C5CAE9", // light periwinkle
  "#FFE0B2", // light peach
  "#DCEDC8", // light lime sherbet
  "#FFF9C4", // light buttercream
  "#FFCCBC", // light coral peach
  "#FFECB3", // light lemon chiffon
  "#FFE082", // light goldenrod
  "#FFAB91", // light salmon
  "#D1C4E9", // light wisteria
  "#C8E6C9", // light sea mist
  "#B3E5FC", // light baby blue
  "#FFEBEE", // light pink blush
  "#E1F5FE", // light ice blue
  "#C5CAE9", // light lilac blue
  "#FFE0B2", // light tangerine
  "#DCEDC8", // light pale lime
  "#FFF9C4", // light ivory yellow
  "#FFCCBC", // light apricot
  "#FFECB3", // light banana cream
  "#FFE082", // light pastel gold
  "#FFAB91", // light peach
  "#D1C4E9", // light lavender
  "#C8E6C9", // light mint green
  "#B3E5FC", // light azure
  "#FFEBEE", // light soft pink
  "#E1F5FE", // light pale blue
  "#C5CAE9", // light pale lilac
];

const DomainButton = styled(Button)(({ theme }) => ({
  width: "100%",
  justifyContent: "left",
  textTransform: "none",
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  fontSize: "0.8rem",
  borderRadius: "10px",
}));

const CustomNode = ({ data }) => {
  const nodeStyle = {
    ...customNodeStyle,
    backgroundColor: data.color || "#e4f1f5",
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
  const [modules, setModules] = useState({});
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedCourseModule, setSelectedCourseModule] = useState(null);
  const [domainList, setDomainList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [certificates, setCertificates] = useState([]);
  const domainsPerPage = 8;

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { user } = useContext(UserContext);

  const handleClickOpen = useCallback(
    (moduleData) => {
      setSelectedCourseModule(moduleData);
      setSelectedModule(modules[moduleData.moduleCode]);
      setOpen(true);
    },
    [modules]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedModule(null);
    setSelectedCourseModule(null);
  }, []);

  const getDomainColor = useCallback(
    (domain) => {
      const index = domainList.indexOf(domain);
      return index !== -1
        ? domainColors[index % domainColors.length]
        : "#e4f1f5";
    },
    [domainList]
  );

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
      const module = modules[courseModule.moduleCode];
      if (!module) return;

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
          title: module.title,
          domain: module.domain,
          color: getDomainColor(module.domain),
        },
        position: position,
        draggable: false,
      });
    });

    return nodes;
  }, [courseModules, modules, getDomainColor]);

  const initialEdges = useMemo(() => {
    let edges = [];
    courseModules.forEach((courseModule) => {
      courseModule.nextModuleCodes.forEach((nextCode) => {
        const targetModule = courseModules.find(
          (m) => m.moduleCode === nextCode
        );
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

  const paginatedDomains = useMemo(() => {
    const startIndex = (currentPage - 1) * domainsPerPage;
    return domainList.slice(startIndex, startIndex + domainsPerPage);
  }, [domainList, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const fetchCourseAndModules = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const courseResponse = await http.get(`/course/${courseCode}`);
        setCourse(courseResponse.data);

        // Fetch course modules
        const courseModulesResponse = await http.get(
          `/courseModule/course/${courseCode}/modules`
        );
        setCourseModules(courseModulesResponse.data);

        // Fetch all modules
        const modulesResponse = await http.get("/module/all");
        const allModules = modulesResponse.data;

        // Filter modules to only those in the course and create a lookup object
        const courseModuleCodes = new Set(
          courseModulesResponse.data.map((cm) => cm.moduleCode)
        );
        const filteredModules = allModules.reduce((acc, module) => {
          if (courseModuleCodes.has(module.moduleCode)) {
            acc[module.moduleCode] = module;
          }
          return acc;
        }, {});
        setModules(filteredModules);

        // Extract unique domains
        const uniqueDomains = [
          ...new Set(
            Object.values(filteredModules).map((module) => module.domain)
          ),
        ];
        setDomainList(uniqueDomains);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError("Failed to fetch course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndModules();
  }, [courseCode]);

  const handleCertificateUpload = useCallback((newCertificate) => {
    setCertificates((prevCertificates) => [
      ...prevCertificates,
      newCertificate,
    ]);
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await http.get(`/certificate/user/${user.userId}`);
        console.log(response.data);
        setCertificates(response.data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    if (user) {
      fetchCertificates();
    }
  }, [user]);

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
        <Grid
          item
          xs={12}
          md={2.5}
          style={{ height: "100%", position: "relative" }}
        >
          <LeftSectionPaper elevation={3}>
            <Typography variant="h6" gutterBottom>
              <strong>{courseCode}</strong>
              <br></br>
              {course?.name} Curriculum
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Domains:
            </Typography>
            <Box display="flex" flexDirection="column" mb={2}>
              {paginatedDomains.map((domain, index) => (
                <DomainButton
                  key={index}
                  variant="contained"
                  style={{
                    backgroundColor: getDomainColor(domain),
                    color: "black",
                  }}
                >
                  {domain}
                </DomainButton>
              ))}
            </Box>
            <Pagination
              count={Math.ceil(domainList.length / domainsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              size="small"
              sx={{ display: "flex", justifyContent: "center" }}
            />
          </LeftSectionPaper>
        </Grid>

        <Grid
          item
          xs={12}
          md={9.5}
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
            <strong>Level of Study:</strong>{" "}
            {selectedModule?.levelOfStudy || "None"}
          </Typography>
          <Typography gutterBottom>
            <strong>Credit:</strong> {selectedModule?.credit}
          </Typography>
          <Typography gutterBottom>
            <strong>School:</strong> {selectedModule?.school}
          </Typography>
          <Typography gutterBottom>
            <strong>Prerequisite:</strong>{" "}
            {selectedModule?.prerequisite || "None"}
          </Typography>
          <Typography gutterBottom>
            <strong>Complexity Level:</strong>{" "}
            {selectedCourseModule?.complexityLevel}
          </Typography>
          <Typography gutterBottom>
            <strong>Previous Modules:</strong>{" "}
            {selectedCourseModule?.prevModuleCodes.join(", ") || "None"}
          </Typography>
          <Typography gutterBottom>
            <strong>Next Modules:</strong>{" "}
            {selectedCourseModule?.nextModuleCodes.join(", ") || "None"}
          </Typography>
          <Typography gutterBottom>
            <strong>Obtainable Certification(s): </strong>
            {selectedModule?.certifications?.length
              ? selectedModule.certifications
              : "None"}
          </Typography>

          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Your Certificates
            </Typography>
            {certificates
              .filter((cert) => cert.moduleCode === selectedModule?.moduleCode)
              .map((cert) => (
                <Typography key={cert.id}>
                  {cert.title} - {new Date(cert.createdAt).toLocaleDateString()}
                </Typography>
              ))}
          </Box>
          <Box mt={2}>
            <CertificateUpload
              userId={user?.userId}
              moduleCode={selectedModule?.moduleCode}
              onUploadSuccess={handleCertificateUpload}
            />
          </Box>
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
