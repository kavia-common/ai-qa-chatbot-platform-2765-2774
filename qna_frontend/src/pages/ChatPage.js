import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Layout/Sidebar";
import MessageBubble from "../components/Chat/MessageBubble";
import ChatInput from "../components/Chat/ChatInput";
import { apiAskQuestion, apiGetConversationDetail, apiListConversations } from "../services/api";

const Wrap = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-shadow: 0 10px 30px ${({ theme }) => theme.colors.shadow};

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const ChatArea = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 60vh;
`;

const Messages = styled.div`
  flex: 1;
  padding: 20px;
  background: linear-gradient(180deg, rgba(37,99,235,0.05), rgba(255,255,255,1));
  overflow-y: auto;
`;

const Empty = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-top: 40px;
`;

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  const selectedId = useMemo(() => selected?.id || selected?.conversation_id, [selected]);
  const scrollRef = useRef(null);

  async function loadConversations() {
    try {
      const data = await apiListConversations();
      setConversations(Array.isArray(data) ? data : data?.results || []);
      if (!selected && (Array.isArray(data) ? data.length : (data?.results || []).length)) {
        const first = Array.isArray(data) ? data[0] : data.results[0];
        setSelected(first);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to load conversations", e);
    }
  }

  async function loadConversationDetail(id) {
    if (!id) return;
    try {
      const data = await apiGetConversationDetail(id);
      const hist = data?.messages || data?.history || [];
      setMessages(hist.map((m) => ({
        role: m.role || m.sender || (m.is_user ? "user" : "assistant"),
        text: m.content || m.text || ""
      })));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to load conversation", e);
      setMessages([]);
    }
  }

  useEffect(() => {
    if (user) loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (selectedId) loadConversationDetail(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(q) {
    setSending(true);
    try {
      const optimistic = [...messages, { role: "user", text: q }];
      setMessages(optimistic);
      const res = await apiAskQuestion({ question: q, conversation_id: selectedId });
      // Try to get answer text across likely response shapes
      const answer =
        res?.answer ||
        res?.data?.answer ||
        res?.message ||
        res?.response ||
        (typeof res === "string" ? res : "");

      setMessages([...optimistic, { role: "assistant", text: answer || "..." }]);

      // If a new conversation was created, update list
      if (res?.conversation_id && !selectedId) {
        await loadConversations();
        setSelected({ conversation_id: res.conversation_id });
      }
    } catch (e) {
      setMessages([...messages, { role: "assistant", text: `Error: ${e.message}` }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <Wrap>
      <Sidebar
        conversations={conversations}
        selectedId={selectedId}
        onSelect={(c) => setSelected(c)}
      />
      <ChatArea>
        <Messages ref={scrollRef}>
          {messages.length === 0 ? (
            <Empty>Start a conversation by asking a weather question.</Empty>
          ) : (
            messages.map((m, idx) => <MessageBubble key={idx} role={m.role} text={m.text} />)
          )}
        </Messages>
        <ChatInput onSend={handleSend} disabled={sending} />
      </ChatArea>
    </Wrap>
  );
}
