import React, { useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background} from 'reactflow';
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
  { id: '2', position: { x: 500, y: 250 }, data: { label: 'Draft' }, type: 'custom' }
];
const edgeStack = [{ id: 'e1-2', source: '1', target: '2', label: 'Start' }];

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

  //onConnect is used to add a new edge when a state is connected to another state
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  //handleAddNode is used to add a new state
  const handleAddNode = () => {
    const maxPos = Math.max(... nodes.map((node) => node.position.x));
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { x: maxPos + 250, y: 250},
      data: { label: `Node ${nodes.length + 1}` },
      type: 'custom',
    };
    setNodes([...nodes, newNode]);
  };

  return (
      <div className='app'>
        <div className="flow">
        <ReactFlowStyled
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
        <ControlsStyled />
        </ReactFlowStyled>
        </div>
        <div className="button-div">
          <button onClick={handleAddNode}>Add Node</button>
        </div>
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