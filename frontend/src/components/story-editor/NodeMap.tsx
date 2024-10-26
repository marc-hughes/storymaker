import React from "react";
import styled from "@emotion/styled";

const MapContainer = styled.div`
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlaceholderText = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const NodeMap: React.FC = () => {
  return (
    <MapContainer>
      <PlaceholderText>Node Map will be displayed here</PlaceholderText>
    </MapContainer>
  );
};

export default NodeMap;
