import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = styled.section`
  max-width: 960px;
  margin: 60px auto;
  padding: 24px;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  background: linear-gradient(90deg, #2563EB, #0ea5e9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 20px;
`;

const CTA = styled(Link)`
  display: inline-block;
  padding: 12px 18px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  color: #111827;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  text-decoration: none;
  font-weight: 700;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px ${({ theme }) => theme.colors.shadow};
  }
`;

export default function HomePage() {
  const { user } = useAuth();
  return (
    <Hero>
      <Title>Ask about the weather—instantly</Title>
      <Subtitle>Chat with an AI that explains weather implications, attire tips, and travel suggestions.</Subtitle>
      <CTA to={user ? "/chat" : "/register"}>{user ? "Open Chat" : "Get Started"}</CTA>
    </Hero>
  );
}
