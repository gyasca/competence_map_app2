// src/components/SkillMap.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SkillMap = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 960;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Example data, replace this with your actual data
    const graph = {
      nodes: [
        { id: 'Skill A', group: 1 },
        { id: 'Skill B', group: 1 },
        { id: 'Skill C', group: 2 },
        { id: 'Skill D', group: 2 },
        { id: 'Skill E', group: 3 },
      ],
      links: [
        { source: 'Skill A', target: 'Skill B', value: 1 },
        { source: 'Skill B', target: 'Skill C', value: 1 },
        { source: 'Skill C', target: 'Skill D', value: 1 },
        { source: 'Skill D', target: 'Skill E', value: 1 },
      ],
    };

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graph.nodes)
      .enter().append('g');

    node.append('circle')
      .attr('r', 5)
      .attr('fill', d => color(d.group))
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('text')
      .text(d => d.id)
      .attr('x', 6)
      .attr('y', 3);

    node.append('title')
      .text(d => d.id);

    simulation
      .nodes(graph.nodes)
      .on('tick', ticked);

    simulation.force('link')
      .links(graph.links);

    function ticked() {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, []);

  return <svg ref={svgRef}></svg>;
};

export default SkillMap;