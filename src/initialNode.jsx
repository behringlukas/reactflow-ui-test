import React from "react";
import { Handle, Position } from "reactflow";
import styled from "styled-components";

const Node = styled.div`
  padding: 10px 20px;
  border-radius: 5px;
  background: ${(props) => props.theme.nodeBg};
  color: ${(props) => props.theme.nodeColor};
  border: 1px dashed
    ${(props) =>
      props.selected ? props.theme.primary : props.theme.nodeBorder};

  .react-flow__handle {
    background: ${(props) => props.theme.primary};
    width: 6px;
    height: 6px;
    border-radius: 10px;
  }
`;

export default ({ data, selected }) => {
  return (
    <Node selected={selected}>
      <div>
        <strong>{data.label}</strong>
      </div>
      <Handle type="source" position={Position.Right} />
    </Node>
  );
};
