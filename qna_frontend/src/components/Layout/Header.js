import React from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Bar = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(2)};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 18px;
`;

const Badge = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Button = styled.button`
  background: ${({ variant, theme }) =>
    variant === "primary" ? theme.colors.primary : "transparent"};
  color: ${({ variant, theme }) =>
    variant === "primary" ? "#fff" : theme.colors.text};
  border: 1px solid
    ${({ variant, theme }) =>
      variant === "primary" ? theme.colors.primary : theme.colors.border};
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    box-shadow: 0 6px 18px ${({ theme }) => theme.colors.shadow};
    transform: translateY(-1px);
  }
`;

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Bar>
      <Inner>
        <Brand to="/">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#2563EB" opacity="0.1" />
            <path d="M6 14c2-3 6-3 8 0 2 3 4 3 4 3" stroke="#2563EB" strokeWidth="2" fill="none" />
            <circle cx="9" cy="10" r="1" fill="#2563EB" />
            <circle cx="13" cy="9" r="1" fill="#F59E0B" />
          </svg>
          Weather Q&A <Badge>AI</Badge>
        </Brand>
        <Actions>
          {user ? (
            <>
              <span style={{ color: "#6B7280" }}>Hi, {user.username}</span>
              <Button onClick={() => navigate("/chat")}>Chat</Button>
              <Button onClick={logout} variant="primary">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button>Login</Button></Link>
              <Link to="/register"><Button variant="primary">Register</Button></Link>
            </>
          )}
        </Actions>
      </Inner>
    </Bar>
  );
}
