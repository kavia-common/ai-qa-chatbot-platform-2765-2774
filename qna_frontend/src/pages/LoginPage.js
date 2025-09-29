import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Card = styled.div`
  max-width: 420px;
  margin: 40px auto;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  box-shadow: 0 12px 28px ${({ theme }) => theme.colors.shadow};
`;

const Title = styled.h2`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  margin: 0 0 24px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
`;

const Label = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px ${({ theme }) => theme.colors.shadow};
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Error = styled.div`
  background: #FEF2F2;
  color: #991B1B;
  border: 1px solid #FECACA;
  padding: 10px 12px;
  border-radius: 10px;
  margin: 10px 0;
`;

export default function LoginPage() {
  const { user, login, error, setError, loading } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    const ok = await login(form);
    if (ok) navigate("/chat");
  }

  useEffect(() => {
    if (user) navigate("/chat");
  }, [user, navigate]);

  return (
    <Card>
      <Title>Welcome back</Title>
      <Subtitle>Login to ask the Weather Q&A assistant</Subtitle>
      {error ? <Error>{error}</Error> : null}
      <form onSubmit={submit}>
        <Field>
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </Field>
        <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button>
      </form>
      <p style={{ marginTop: 12 }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </Card>
  );
}
