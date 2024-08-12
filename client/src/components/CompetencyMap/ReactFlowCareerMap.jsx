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
  getBezierPath,
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

const StyledEdgeButton = {
  width: "30px",
  height: "30px",
  background: "#eee",
  border: "1px solid #fff",
  cursor: "pointer",
  borderRadius: "50px",
  fontSize: "12px",
  "&:hover": {
    background: "#f5f5f5",
    boxShadow: "none",
  },
};

const proOptions = { hideAttribution: true };

// Define a list of 100 distinct colors
const domainColors = [
  "#FFD1DC",  // light coral pink
  "#FFCC99",  // light apricot
  "#B3E5FC",  // light sky blue
  "#C8E6C9",  // light mint green
  "#FFECB3",  // light vanilla
  "#E1BEE7",  // light lavender
  "#FFE0B2",  // light peach
  "#B2DFDB",  // light teal
  "#FFCDD2",  // light blush pink
  "#DCEDC8",  // light lime
  "#F8BBD0",  // light pink
  "#D1C4E9",  // light purple
  "#FFAB91",  // light salmon
  "#C5CAE9",  // light periwinkle
  "#FFCC80",  // light tangerine
  "#B3E5FC",  // light baby blue
  "#D7CCC8",  // light mocha
  "#FFF59D",  // light lemon
  "#FFE082",  // light marigold
  "#FFAB91",  // light coral
  "#B39DDB",  // light wisteria
  "#FF8A65",  // light terra cotta
  "#BCAAA4",  // light taupe
  "#FF7043",  // light burnt orange
  "#A5D6A7",  // light mint
  "#FFCCBC",  // light peach cream
  "#F48FB1",  // light rose pink
  "#80DEEA",  // light aqua
  "#FFEB3B",  // light golden yellow
  "#C6FF00",  // light chartreuse
  "#FFEBEE",  // light pink blush
  "#E1F5FE",  // light sky blue
  "#E0F7FA",  // light turquoise
  "#F3E5F5",  // light lavender mist
  "#FFF3E0",  // light cream orange
  "#E8F5E9",  // light mint
  "#FFFDE7",  // light buttercream
  "#EDE7F6",  // light soft violet
  "#FBE9E7",  // light apricot blush
  "#FFEBEE",  // light blush rose
  "#E3F2FD",  // light baby blue
  "#FCE4EC",  // light pink foam
  "#E8EAF6",  // light lavender blue
  "#FFECB3",  // light banana yellow
  "#FFE082",  // light light orange
  "#E8F5E9",  // light pale green
  "#FFEB3B",  // light sunny yellow
  "#FFF9C4",  // light light yellow
  "#D7CCC8",  // light beige
  "#FFCDD2",  // light rosy pink
  "#C5CAE9",  // light violet blue
  "#FFE0B2",  // light apricot cream
  "#FFCC80",  // light pastel orange
  "#FFAB91",  // light salmon pink
  "#D1C4E9",  // light purple haze
  "#B2DFDB",  // light teal mint
  "#F8BBD0",  // light pink blush
  "#DCEDC8",  // light lime sherbet
  "#FBE9E7",  // light coral peach
  "#E1BEE7",  // light lavender blush
  "#C8E6C9",  // light mint green
  "#B3E5FC",  // light sky blue
  "#FFECB3",  // light vanilla
  "#FFCCBC",  // light peach cream
  "#D7CCC8",  // light taupe
  "#F8BBD0",  // light pink petal
  "#B2DFDB",  // light sea foam
  "#E1F5FE",  // light light blue
  "#C5CAE9",  // light periwinkle
  "#FFE0B2",  // light peach
  "#DCEDC8",  // light lime sherbet
  "#FFF9C4",  // light buttercream
  "#FFCCBC",  // light coral peach
  "#FFECB3",  // light lemon chiffon
  "#FFE082",  // light goldenrod
  "#FFAB91",  // light salmon
  "#D1C4E9",  // light wisteria
  "#C8E6C9",  // light sea mist
  "#B3E5FC",  // light baby blue
  "#FFEBEE",  // light pink blush
  "#E1F5FE",  // light ice blue
  "#C5CAE9",  // light lilac blue
  "#FFE0B2",  // light tangerine
  "#DCEDC8",  // light pale lime
  "#FFF9C4",  // light ivory yellow
  "#FFCCBC",  // light apricot
  "#FFECB3",  // light banana cream
  "#FFE082",  // light pastel gold
  "#FFAB91",  // light peach
  "#D1C4E9",  // light lavender
  "#C8E6C9",  // light mint green
  "#B3E5FC",  // light azure
  "#FFEBEE",  // light soft pink
  "#E1F5FE",  // light pale blue
  "#C5CAE9",  // light pale lilac
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

const CustomEdge = React.memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
  }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        <path
          id={id}
          style={style}
          className="react-flow__edge-path"
          d={edgePath}
        />
        <foreignObject
          width={80}
          height={40}
          x={labelX - 40}
          y={labelY - 20}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <Box>
            <Button
              style={StyledEdgeButton}
              onClick={(event) =>
                data.onEdgeClick(event, {
                  id,
                  source: data.source,
                  target: data.target,
                })
              }
            >
              <strong>x</strong>
            </Button>
          </Box>
        </foreignObject>
      </>
    );
  }
);

const nodeTypes = {
  custom: CustomNode,
  columnLabel: ColumnLabelNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const ReactflowCareerMap = ({ courseCode, updateTrigger }) => {
  const [courseModules, setCourseModules] = useState([]);
  const [modules, setModules] = useState({});
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedCourseModule, setSelectedCourseModule] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [domainList, setDomainList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const domainsPerPage = 10;

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleClickOpen = useCallback((courseModule) => {
    setSelectedCourseModule(courseModule);
    setSelectedModule(modules[courseModule.moduleCode]);
    setOpen(true);
  }, [modules]);

  const handleClose = useCallback(() => {
    setOpen(false);
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
      if (!module) return; // Skip if module data is not available

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
          label: module.title,
          moduleCode: courseModule.moduleCode,
          domain: module.domain,
          color: getDomainColor(module.domain),
          tempComplexityLevel: courseModule.complexityLevel,
          nextModuleIds: courseModule.nextModuleCodes
            .map((code) =>
              courseModules.find((m) => m.moduleCode === code)?.id.toString()
            )
            .filter(Boolean),
          prevModuleIds: courseModule.prevModuleCodes
            .map((code) =>
              courseModules.find((m) => m.moduleCode === code)?.id.toString()
            )
            .filter(Boolean),
        },
        position: position,
      });
    });

    return nodes;
  }, [courseModules, modules, getDomainColor]);

  const initialEdges = useMemo(() => {
    let edges = [];
    courseModules.forEach((module) => {
      module.nextModuleCodes.forEach((nextCode) => {
        const targetModule = courseModules.find(
          (m) => m.moduleCode === nextCode
        );
        if (targetModule) {
          edges.push({
            id: `e${module.id}-${targetModule.id}`,
            source: module.id.toString(),
            target: targetModule.id.toString(),
            type: "custom",
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

  const updateModuleAPI = useCallback(
    async (
      courseModuleToBeUpdatedId,
      newNextModuleIds = null,
      newPrevModuleIds = null,
      newComplexityLevel = null,
      newPositionX = null,
      newPositionY = null,
      edgeUpdateCheck = null
    ) => {
      console.log(
        "Attempting to update module with ID:",
        courseModuleToBeUpdatedId
      );

      const module = nodes.find(
        (node) =>
          node.id === courseModuleToBeUpdatedId.toString() &&
          node.type === "custom"
      );

      if (module) {
        const payload = {
          id: parseInt(module.id),
          order: module.data.order,
          levelOfStudy: module.data.levelOfStudy,
          complexityLevel:
            newComplexityLevel !== null
              ? newComplexityLevel
              : parseInt(module.data.complexityLevel),
          prevModuleCodes: newPrevModuleIds
            ? newPrevModuleIds
                .map(
                  (id) =>
                    nodes.find(
                      (n) => n.id === id.toString() && n.type === "custom"
                    )?.data.moduleCode
                )
                .filter(Boolean)
            : module.data.prevModuleCodes,
          nextModuleCodes: newNextModuleIds
            ? newNextModuleIds
                .map(
                  (id) =>
                    nodes.find(
                      (n) => n.id === id.toString() && n.type === "custom"
                    )?.data.moduleCode
                )
                .filter(Boolean)
            : module.data.nextModuleCodes,
          courseCode: module.data.courseCode,
          moduleCode: module.data.moduleCode,
          positionX:
            newPositionX !== null ? newPositionX : module.data.positionX,
          positionY:
            newPositionY !== null ? newPositionY : module.data.positionY,
        };

        console.log("Payload to be sent:", payload);

        try {
          const response = await http.put(
            `/courseModule/course/${courseCode}/module/edit/${module.id}`,
            payload
          );
          console.log("Module updated successfully:", response.data);
        } catch (error) {
          console.error("Error updating module:", error);
        }
      } else {
        console.error("Module not found for ID:", courseModuleToBeUpdatedId);
        console.log(
          "Available node IDs:",
          nodes.map((n) => `${n.id} (${n.type})`)
        );
      }
    },
    [nodes, courseCode]
  );

  const onEdgeClick = useCallback(
    (event, edge) => {
      event.stopPropagation();
      const { source, target, id } = edge;

      console.log("Edge clicked:", edge);
      console.log("Source ID:", source);
      console.log("Target ID:", target);

      setEdges((eds) => eds.filter((e) => e.id !== id));

      setNodes((nds) => {
        const updatedNodes = nds.map((node) => {
          if (node.id === source) {
            const newNextModuleIds = node.data.nextModuleIds.filter(
              (nid) => nid !== target
            );
            return {
              ...node,
              data: {
                ...node.data,
                nextModuleIds: newNextModuleIds,
              },
            };
          }
          if (node.id === target) {
            const newPrevModuleIds = node.data.prevModuleIds.filter(
              (nid) => nid !== source
            );
            return {
              ...node,
              data: {
                ...node.data,
                prevModuleIds: newPrevModuleIds,
              },
            };
          }
          return node;
        });

        // Call the API to update the courseModules
        const sourceNode = updatedNodes.find((n) => n.id === source);
        const targetNode = updatedNodes.find((n) => n.id === target);

        if (sourceNode && targetNode) {
          updateModuleAPI(
            source,
            sourceNode.data.nextModuleIds,
            null,
            null,
            null,
            null,
            true
          );
          updateModuleAPI(
            target,
            null,
            targetNode.data.prevModuleIds,
            null,
            null,
            null,
            true
          );
        }

        return updatedNodes;
      });
    },
    [updateModuleAPI, setEdges, setNodes]
  );

  const memoizedEdges = useMemo(() => {
    return edges.map((edge) => ({
      ...edge,
      data: {
        ...edge.data,
        onEdgeClick,
        source: edge.source,
        target: edge.target,
      },
    }));
  }, [edges, onEdgeClick]);

  const onConnect = useCallback(
    (params) => {
      console.log("all nodes:", nodes);
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      if (!sourceNode || !targetNode) {
        console.error("Source or target node not found");
        return;
      }

      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        type: "custom",
        animated: true,
        style: { stroke: "black", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.Arrow,
          color: "black",
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));

      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) => {
          if (node.id === params.source) {
            const newNextModuleIds = [
              ...new Set([...node.data.nextModuleIds, targetNode.id]),
            ];
            return {
              ...node,
              data: {
                ...node.data,
                nextModuleIds: newNextModuleIds,
              },
            };
          }
          if (node.id === params.target) {
            const newPrevModuleIds = [
              ...new Set([...node.data.prevModuleIds, sourceNode.id]),
            ];
            return {
              ...node,
              data: {
                ...node.data,
                prevModuleIds: newPrevModuleIds,
              },
            };
          }
          return node;
        });

        // After updating the nodes, call the API
        const updatedSourceNode = updatedNodes.find(
          (node) => node.id === params.source
        );
        const updatedTargetNode = updatedNodes.find(
          (node) => node.id === params.target
        );

        updateModuleAPI(
          updatedSourceNode.id,
          updatedSourceNode.data.nextModuleIds,
          null
        );
        updateModuleAPI(
          updatedTargetNode.id,
          null,
          updatedTargetNode.data.prevModuleIds
        );

        return updatedNodes;
      });
    },
    [nodes, setEdges, setNodes, updateModuleAPI]
  );

  const onNodeDragStop = useCallback(
    (event, node) => {
      const newComplexityLevel = Math.floor(node.position.x / 300) + 1;
      if (
        newComplexityLevel !== node.data.tempComplexityLevel ||
        node.position.x !== node.data.positionX ||
        node.position.y !== node.data.positionY
      ) {
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                data: {
                  ...n.data,
                  tempComplexityLevel: newComplexityLevel,
                  complexityLevel: newComplexityLevel,
                  positionX: node.position.x,
                  positionY: node.position.y,
                },
              };
            }
            return n;
          })
        );
        updateModuleAPI(
          node.id,
          null,
          null,
          newComplexityLevel,
          node.position.x,
          node.position.y
        );
      }
    },
    [setNodes, updateModuleAPI]
  );

  const paginatedDomains = useMemo(() => {
    const startIndex = (currentPage - 1) * domainsPerPage;
    return domainList.slice(startIndex, startIndex + domainsPerPage);
  }, [domainList, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const courseResponse = await http.get(`/course/${courseCode}`);
        setCourse(courseResponse.data);

        // Fetch course modules
        const courseModulesResponse = await http.get(
          `/courseModule/course/${courseCode}/modules`
        );
        const fetchedCourseModules = courseModulesResponse.data;
        setCourseModules(fetchedCourseModules);

        // Fetch all modules
        const modulesResponse = await http.get("/module/all");
        const allModules = modulesResponse.data;

        // Filter modules to only those in the course and create a lookup object
        const courseModuleCodes = new Set(
          fetchedCourseModules.map((cm) => cm.moduleCode)
        );
        const filteredModules = allModules.reduce((acc, module) => {
          if (courseModuleCodes.has(module.moduleCode)) {
            acc[module.moduleCode] = module;
          }
          return acc;
        }, {});
        setModules(filteredModules);

        // Extract unique domains from the filtered modules
        const uniqueDomains = [
          ...new Set(
            Object.values(filteredModules).map((module) => module.domain)
          ),
        ];
        setDomainList(uniqueDomains);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseCode, updateTrigger]);

  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ mb: 2, height: "80vh" }}>
      <Grid container spacing={2} style={{ height: "100%" }}>
        <Grid
          item
          xs={12}
          md={3}
          style={{ height: "97%", position: "relative" }}
        >
          <LeftSectionPaper elevation={3}>
            <Typography variant="h6" gutterBottom>
              <strong>{courseCode}</strong><br></br>{course?.name} Curriculum
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
                    backgroundColor:
                      domainColors[
                        domainList.indexOf(domain) % domainColors.length
                      ],
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
          md={9}
          style={{ height: "100%", position: "relative" }}
        >
          <Paper
            style={{
              height: "100%",
              width: "100%",
              position: "relative",
              padding: 3,
              boxShadow:
                "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={memoizedEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeDragStop={onNodeDragStop}
              onNodeClick={(_, node) => {
                if (node.type === "custom") {
                  const fullModuleData = courseModules.find(
                    (m) => m.id.toString() === node.id
                  );
                  handleClickOpen(fullModuleData);
                }
              }}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              connectionLineStyle={{ stroke: "black" }}
              defaultEdgeOptions={{
                type: "custom",
                animated: true,
                style: { stroke: "black", strokeWidth: 2 },
                markerEnd: {
                  type: MarkerType.Arrow,
                  color: "black",
                },
              }}
              fitView
              fitViewOptions={{ padding: 0.2 }}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReactflowCareerMap;
