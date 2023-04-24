import React, { useCallback, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, MarkerType} from 'reactflow';
import styled, { ThemeProvider } from 'styled-components';
import 'reactflow/dist/style.css';
import 'reactflow/dist/base.css';
import './App.css';

import {globalTheme} from './theme.js';
import CustomNode from './customNode.jsx';
import InitialNode from './initialNode.jsx';

//initial nodes and edges when the page is loaded
const nodeStack = [
  { id: '1', position: { x: 250, y: 250 }, data: { label: 'Initial' }, type: 'initial' },
  { id: '2', position: { x: 500, y: 250 }, data: { label: 'Draft'}, type: 'custom' }
];
const edgeStack = [{ id: 'e1-2', source: '1', target: '2', label: 'Start', markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20}, style: {strokeWidth: 1.5} }];

const nodeTypes = {
  custom: CustomNode,
  initial: InitialNode,
};


//background color, color of state, color of edge, color of selected state
const ReactFlowStyled = styled(ReactFlow)`
  background-color: ${(props) => props.theme.bg};
`;

const ControlsStyled = styled(Controls)`
  button {
    background-color: ${(props) => props.theme.controlsBg};
    color: ${(props) => props.theme.controlsColor};
    border-bottom: 1px solid ${(props) => props.theme.controlsBorder};

    &:hover {
      background-color: ${(props) => props.theme.controlsBgHover};
    }

    path {
      fill: currentColor;
    }
  }
`;

const Flow = () => {
  //useNodesState and useEdgesState are used to update the nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(nodeStack);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgeStack);
  const [nodeLabel, setNodeLabel] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [selectedNode, setSelectedNode] = useState(0);
  const [existingTransitionEdges, setExistingTransitionEdges] = useState([]);
  const [stateColor, setStateColor] = useState("#000000")

  //onConnect is used to add a new edge when a state is connected to another state
  const onConnect = useCallback((params) => {
    const edge = {
      id: `${params.source}-${params.target}`,
      source: params.source,
      target: params.target,
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20}, 
      style: {strokeWidth: 1.5}
    };
    setEdges((eds) => [...eds, edge]);
  }, [setEdges]);


  //handleAddNode is used to add a new state
  const handleAddNode = () => {
    const maxPos = Math.max(... nodes.map((node) => node.position.x));
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { x: maxPos + 250, y: 250},
      data: { label: "New State", color: {stateColor} },
      type: 'custom',
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
    setShowInput(true);
  };

  const handleChange = (event) => {
    setNodeLabel(event.target.value);
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === selectedNode
          ? { ...node, data: { ...node.data, label: event.target.value} } // update label of selected node
          : node
      )
    );
  };

  const handleNodeClick = (event, node) => { 
    setSelectedNode(node.id); // set clicked node as selected node
    setNodeLabel(node.data.label); // set the input value to the label of the selected node
    setShowInput(true); // show the input field
    setStateColor(node.data.color);
  };

  const [selectedDropdown, setSelectedDropdown] = useState(null);

  const handleDropdownChange = (event) => {
    const newDropdown = event.target.value;
    if (selectedDropdown !== newDropdown) {
      handleVirtualConnection(newDropdown);
    }
  };

  const handleVirtualConnection = (newDropdown) => {
    // Remove existing edge that was created with previous dropdown selection
    const existingEdge = existingTransitionEdges.find(edge => (edge.source === selectedNode && edge.target === selectedDropdown) || (edge.target === selectedNode && edge.source === selectedDropdown));
    const filteredEdges = existingEdge && existingEdge.source === selectedNode ? edges.filter(edge => edge.target !== selectedDropdown) : edges.filter(edge => edge.source !== selectedDropdown);
    setEdges(filteredEdges);
  
    // Create new edge with the new dropdown selection
    const newEdge = {
      id: `${filteredEdges.length + 1}`,
      source: `${selectedNode}`,
      target: `${newDropdown}`,
      label: 'State Timeout',
    };
    setEdges([...filteredEdges, newEdge]);
    setExistingTransitionEdges([...existingTransitionEdges.filter(edge => edge !== existingEdge), newEdge]);
  
    // Update selected dropdown
    setSelectedDropdown(newDropdown);
  };

  const allNodes = nodes.map((node) => ({value: node.id, label: node.data.label}));
  const [checked, setChecked] = useState(false);

  const handleStateColorChange = (event) => {
    setStateColor(event.target.value);
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === selectedNode
          ? { ...node, data: { ...node.data, color: event.target.value} } // update label of selected node
          : node
      )
    );
  };

  return (
      <div className='app'>
        <div className="flow">
        <button onClick={handleAddNode}>Create Node</button>
        <ReactFlowStyled
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
        >
        <div className='controls'>
          <ControlsStyled />
        </div>
        </ReactFlowStyled>
        </div>
        {showInput && (
        <div className="inputs-div">
          <input
            type="text"
            placeholder="Enter Node Name"
            value={nodeLabel}
            onChange={handleChange}
            onBlur={() => {
              setShowInput(false); // hide the input field on blur
              setSelectedNode(null); // clear the selected node
              setNodeLabel(''); // clear the input value
            }}        
          />
          <label>
            <input type="color" id="color" name="color" value={stateColor} onChange={handleStateColorChange}></input>
          </label>
          <label>
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
              />
              Set to 
            <select disabled={!checked} onChange={handleDropdownChange}>
              <option></option>
            {allNodes.map((node) => (
              <option key={node.id} value={node.value}>
                {node.label}
              </option>
              ))}
            </select>
             after
            <input type="number" disabled={!checked} />
             hours
          </label>
        </div>
        )}
      </div>
  );
};

export default () => {
  const theme = globalTheme;
  
  return (
  <ThemeProvider theme={theme}>
    <Flow />
  </ThemeProvider>  
  );
 };