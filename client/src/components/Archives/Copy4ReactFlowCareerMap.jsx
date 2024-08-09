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

const StyledEdgeButton = {
  width: "60px",
  height: "30px",
  background: "#eee",
  border: "1px solid #fff",
  cursor: "pointer",
  borderRadius: "5px",
  fontSize: "12px",
  "&:hover": {
    background: "#f5f5f5",
    boxShadow: "none",
  },
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

const Copy4ReactflowCareerMap = ({ courseCode, onModuleUpdate }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

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
        id: module.id.toString(),
        type: "custom",
        data: {
          ...module,
          label: module.Module.title,
          domain: module.Module.domain,
          tempComplexityLevel: module.complexityLevel,
          nextModuleIds: module.nextModuleCodes
            .map((code) =>
              modules.find((m) => m.moduleCode === code)?.id.toString()
            )
            .filter(Boolean),
          prevModuleIds: module.prevModuleCodes
            .map((code) =>
              modules.find((m) => m.moduleCode === code)?.id.toString()
            )
            .filter(Boolean),
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
  }, [modules]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const updateModuleAPI = useCallback(
    async (
      courseModuleToBeUpdatedId,
      newNextModuleIds = null,
      newPrevModuleIds = null,
      newComplexityLevel = null,
      edgeUpdateCheck = null
    ) => {
      console.log(
        "Attempting to update module with ID:",
        courseModuleToBeUpdatedId
      );

      console.log("Nodes to find:", nodes);
      
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
    async (event, edge) => {
      event.stopPropagation();
      const sourceId = edge.source;
      const targetId = edge.target;

      console.log("Edge clicked:", edge);
      console.log("Source ID:", sourceId);
      console.log("Target ID:", targetId);
      console.log("All nodes:", nodes)

      // Update edges state locally
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));

      // Update nodes state locally and gather the new next/prev module codes
      setNodes((nds) => {
        const updatedNodes = nds.map((node) => {
          if (node.id === sourceId) {
            return {
              ...node,
              data: {
                ...node.data,
                nextModuleIds: node.data.nextModuleIds.filter(
                  (id) => id !== targetId
                ),
              },
            };
          }
          if (node.id === targetId) {
            return {
              ...node,
              data: {
                ...node.data,
                prevModuleIds: node.data.prevModuleIds.filter(
                  (id) => id !== sourceId
                ),
              },
            };
          }
          return node;
        });

        // Find the updated nodes
        const updatedSourceNode = updatedNodes.find(
          (node) => node.id === sourceId
        );
        const updatedTargetNode = updatedNodes.find(
          (node) => node.id === targetId
        );

        console.log("Updated source node:", updatedSourceNode);
        console.log("Updated target node:", updatedTargetNode);

        // Call the API to update the modules
        if (updatedSourceNode && updatedTargetNode) {
          const edgeUpdate = true;
          updateModuleAPI(
            sourceId,
            updatedSourceNode.data.nextModuleIds,
            null,
            null,
            edgeUpdate
          ).catch((error) =>
            console.error("Error updating source module:", error)
          );
          updateModuleAPI(
            targetId,
            null,
            updatedTargetNode.data.prevModuleIds,
            null,
            edgeUpdate
          ).catch((error) =>
            console.error("Error updating target module:", error)
          );
        } else {
          console.error("Source or target node not found after update");
        }

        return updatedNodes;
      });
    },
    [setEdges, setNodes, updateModuleAPI]
  );

  const onConnect = useCallback(
    (params) => {
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
      if (newComplexityLevel !== node.data.tempComplexityLevel) {
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                data: {
                  ...n.data,
                  tempComplexityLevel: newComplexityLevel,
                  complexityLevel: newComplexityLevel, // Add this line
                },
              };
            }
            return n;
          })
        );
        updateModuleAPI(node.id, null, null, newComplexityLevel); // Pass the new complexity level
      }
    },
    [setNodes, updateModuleAPI]
  );

  const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    source,
    target,
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
              onClick={(event) => onEdgeClick(event, { id, source, target })}
            >
              Delete
            </Button>
          </Box>
        </foreignObject>
      </>
    );
  };

  const nodeTypes = useMemo(
    () => ({
      custom: CustomNode,
      columnLabel: ColumnLabelNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    [onEdgeClick]
  );

  useEffect(() => {
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

    fetchCourseModules();
  }, [courseCode]);

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
              edgeTypes={edgeTypes}
              onEdgeClick={onEdgeClick}
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

export default Copy4ReactflowCareerMap;
