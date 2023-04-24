import React from "react";
import { Handle, Position } from "reactflow";
import styled from "styled-components";
import './App.css';

const Node = styled.div`
  padding: 10px 20px;
  border-radius: 5px;
  background: ${(props) => props.theme.nodeBg};
  color: ${(props) => props.theme.nodeColor};
  border: 1px solid
    ${(props) =>
      props.selected ? props.theme.primary : props.theme.nodeBorder};

  .react-flow__handle {
    background: ${(props) => props.theme.primary};
    width: 6px;
    height: 6px;
    border-radius: 10px;
  }
`;

const NodeContent = styled.div`
  display: flex;
  align-items: center;
`;

const NodeLabel = styled.div`
  flex: 1;
`;

const Circle = styled.svg`
  margin-left: 10px;
  width: 20px;
  height: 20px;
`;

export default ({ data, selected }) => {
  console.log("Test" + data.color);
  return (
    <Node selected={selected}>
      <Handle type="target" position={Position.Left} />
      <NodeContent>
        <NodeLabel>
          <strong>{data.label}</strong>
        </NodeLabel>
          <Circle viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill={data.color}/>
          </Circle>
      </NodeContent>
      <Handle type="source" position={Position.Right} />
    </Node>
  );
};
