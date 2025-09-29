import React from "react";
import styled from "styled-components";

const Wrap = styled.aside`
  width: 320px;
  min-width: 280px;
  max-width: 340px;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing(2)};
  overflow-y: auto;
  height: calc(100vh - 64px);
`;

const Title = styled.h3`
  margin: 0 0 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 10px 12px;
  margin-bottom: 10px;
  cursor: pointer;
  background: #fff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px ${({ theme }) => theme.colors.shadow};
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 6px 18px ${({ theme }) => theme.colors.shadow};
    transform: translateY(-1px);
  }
`;

export default function Sidebar({ conversations = [], selectedId, onSelect }) {
  return (
    <Wrap>
      <Title>Conversations</Title>
      <List>
        {conversations.map((c) => (
          <Item
            key={c.id || c.conversation_id || c.title}
            onClick={() => onSelect && onSelect(c)}
            style={{
              borderColor: selectedId === (c.id || c.conversation_id) ? "#2563EB" : undefined,
              background: selectedId === (c.id || c.conversation_id) ? "#EFF6FF" : "#fff"
            }}
            title={c.title || c.summary || `Conversation ${c.id || c.conversation_id}`}
          >
            <div style={{ fontWeight: 600, color: "#111827" }}>
              {c.title || c.summary || `Conversation ${c.id || c.conversation_id}`}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
              {c.updated_at || c.created_at || ""}
            </div>
          </Item>
        ))}
      </List>
    </Wrap>
  );
}
