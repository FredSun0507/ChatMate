// components/ChatApp.jsx
import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Button , Typography, Box} from '@mui/material';
import { ChatBubbleOutline } from '@mui/icons-material';
export default function ChatApp() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
 
const examples = [
  "What is Python?",
  "Write a JavaScript function to reverse a string.",
  "Explain how transformers work.",
];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);

  const sendMessage = () => {
  if (!message.trim()) return;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newHistory = [...history, { role: 'user', content: message, time }];
  setHistory(newHistory);
  setMessage('');
  setLoading(true);

  const ws = new WebSocket("wss://fredericksundeep-aiapisgateway.hf.space/chat-stream");

  ws.onopen = () => {
    ws.send(JSON.stringify({
      message,
      history: newHistory
    }));
  };

  let content = '';

  ws.onmessage = (event) => {
    const token = event.data;
    content += token;

    setHistory(h =>
      h.map((msg, i) =>
        i === newHistory.length
          ? { ...msg, content }
          : msg
      )
    );
  };

  ws.onclose = () => {
    setHistory(h => [...h, { role: 'assistant', content, time }]);
    setLoading(false);
  };

  ws.onerror = (err) => {
    console.error("WebSocket error:", err);
    setLoading(false);
  };
};

  return (
    <div className="chat-container">
      <div className="header-area">
      <Box display="flex" alignItems="center" gap={1} mb={2}>
  <ChatBubbleOutline color="primary" />
  <Typography variant="h5" component="h2">
    Chat Mate
  </Typography>
</Box>
      </div>
      <div className="chat-box">
  {history.length === 0 && !loading && (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      pt={8}
    >
      {examples.map((example, i) => (
        <Button
          key={i}
          variant="outlined"
          onClick={() => {
  const selected = example;
  setMessage(selected);
  setTimeout(() => {
    sendMessage(selected);
  }, 50);
}}
          sx={{
            color: '#fff',
            borderColor: '#444',
            backgroundColor: '#1e1e2f',
            borderRadius: '12px',
            width: '70%',
            fontSize: '1rem',
            fontWeight: 400,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#2c2c3e',
              borderColor: '#666',
            },
          }}
        >
          {example}
        </Button>
      ))}
    </Box>
  )}

  {history.map((msg, i) => (
    <MessageBubble key={i} {...msg} />
  ))}

  {loading && (
    <div className="typing-indicator">
      <span className="dot"></span><span className="dot"></span><span className="dot"></span>
    </div>
  )}

  <div ref={chatEndRef} />
</div>
      <div className="input-area">
        <textarea
          value={message}
          rows={2}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
        />
        <Button  variant="contained"
  color="primary"
  sx={{ ml: 1, px: 2, py: 1 }} disabled={!message.trim() || loading} onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
