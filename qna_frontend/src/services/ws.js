/**
 * WebSocket scaffolding for future real-time updates.
 * Usage:
 * const ws = createChatSocket({ onMessage: (msg)=>{}, onOpen: ()=>{}, onClose: ()=>{} })
 * ws.send(JSON.stringify({event: 'ping'}))
 * ws.close()
 */
// PUBLIC_INTERFACE
export function createChatSocket({ path = "/ws/chat/", onMessage, onOpen, onClose, onError }) {
  const WS_BASE = process.env.REACT_APP_WS_BASE_URL || "ws://localhost:8000/ws";
  const url = WS_BASE.endsWith("/") ? `${WS_BASE}chat/` : `${WS_BASE}/chat/`;
  const socket = new WebSocket(url);

  socket.onopen = () => {
    if (onOpen) onOpen();
  };
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onMessage) onMessage(data);
    } catch {
      if (onMessage) onMessage(event.data);
    }
  };
  socket.onclose = () => {
    if (onClose) onClose();
  };
  socket.onerror = (e) => {
    if (onError) onError(e);
  };
  return socket;
}
