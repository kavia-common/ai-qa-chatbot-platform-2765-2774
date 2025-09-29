import React, { useState } from "react";
import styled from "styled-components";

const Bar = styled.form`
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #fff;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Input = styled.textarea`
  flex: 1;
  min-height: 48px;
  max-height: 160px;
  resize: vertical;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  outline: none;
  font-size: 14px;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  color: #111827;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  padding: 0 16px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  min-width: 96px;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 22px ${({ theme }) => theme.colors.shadow};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  function submit(e) {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    onSend && onSend(v);
    setValue("");
  }

  return (
    <Bar onSubmit={submit}>
      <Input
        placeholder="Ask about weather... e.g., 'What should I wear for a rainy day in Seattle?'"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled}>Ask</Button>
    </Bar>
  );
}
