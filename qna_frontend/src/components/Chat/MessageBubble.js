import React from "react";
import styled from "styled-components";

const Bubble = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  margin: 6px 0;
  box-shadow: 0 2px 10px ${({ theme }) => theme.colors.shadow};
  background: ${({ role, theme }) => (role === "user" ? "#2563EB" : "#FFFFFF")};
  color: ${({ role }) => (role === "user" ? "#fff" : "#111827")};
  border: 1px solid ${({ role, theme }) =>
    role === "user" ? "transparent" : theme.colors.border};
`;

const Row = styled.div`
  display: flex;
  justify-content: ${({ role }) => (role === "user" ? "flex-end" : "flex-start")};
`;

export default function MessageBubble({ role, text }) {
  return (
    <Row role={role}>
      <Bubble role={role}>{text}</Bubble>
    </Row>
  );
}
