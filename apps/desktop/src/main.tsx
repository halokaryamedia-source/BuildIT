import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Upload a reference image or write a prompt to create a Blockbench voxel model."
    }
  ]);

  function submitJob() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setMessages((current) => [
      ...current,
      { role: "user", content: trimmedPrompt },
      {
        role: "assistant",
        content: "Job queued. The engine will analyze the request, control Blockbench through MCP, and notify you when the model is ready."
      }
    ]);
    setPrompt("");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <h1>BuildIT</h1>
        <p>Blockbench Auto Model Studio</p>
      </aside>
      <section className="chat-panel">
        <div className="messages">
          {messages.map((message, index) => (
            <article className={`message ${message.role}`} key={index}>
              {message.content}
            </article>
          ))}
        </div>
        <div className="composer">
          <input type="file" accept="image/*" />
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the model you want to create..."
          />
          <button onClick={submitJob}>Generate</button>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
