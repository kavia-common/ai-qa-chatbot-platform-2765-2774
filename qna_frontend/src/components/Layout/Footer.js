import React from "react";
import styled from "styled-components";

const Bar = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(2)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

export default function Footer() {
  return (
    <Bar>
      <Inner>
        <span>© {new Date().getFullYear()} Weather Q&A</span>
        <span style={{ color: "#6B7280" }}>Ocean Professional Theme</span>
      </Inner>
    </Bar>
  );
}
