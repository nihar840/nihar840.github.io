import { useState, useCallback, useRef } from 'react';
import { streamSearch } from '../../services/apiClient';

export function useStreamingChat() {
  const [messages, setMessages] = useState([]);
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const sendQuery = useCallback(async (query) => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setError(null);
    setSources([]);
    setIsLoading(true);

    // Append user message
    const userMsg = { role: 'user', content: query, id: Date.now() };
    const assistantId = Date.now() + 1;
    const assistantMsg = { role: 'assistant', content: '', id: assistantId };

    setMessages(prev => [...prev, userMsg, assistantMsg]);

    try {
      const response = await streamSearch(query);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete line

        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;

          let evt;
          try { evt = JSON.parse(jsonStr); } catch { continue; }

          if (evt.eventType === 'sources') {
            setSources(evt.sources || []);
          } else if (evt.eventType === 'token') {
            setMessages(prev => prev.map(m =>
              m.id === assistantId
                ? { ...m, content: m.content + (evt.token || '') }
                : m
            ));
          } else if (evt.eventType === 'error') {
            setError(evt.errorMessage || 'Unknown error');
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Connection failed');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSources([]);
    setError(null);
  }, []);

  return { messages, sources, isLoading, error, sendQuery, clearMessages };
}
