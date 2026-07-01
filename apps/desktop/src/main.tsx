import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const engineUrl = "http://localhost:3987";

type TargetFormat = "bedrock" | "bedrock_block";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ReferenceImageUpload {
  fileName: string;
  mimeType: string;
  dataUrl: string;
}

interface JobLog {
  at: string;
  message: string;
}

interface ModelJob {
  id: string;
  status: string;
  logs: JobLog[];
  error?: string;
}

async function fetchJob(jobId: string): Promise<ModelJob> {
  const response = await fetch(engineUrl + "/api/jobs/" + jobId);
  const data = (await response.json()) as { job: ModelJob };
  return data.job;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read selected image."));
    reader.readAsDataURL(file);
  });
}

function getTargetLabel(format: TargetFormat): string {
  return format === "bedrock" ? "Bedrock Entity" : "Bedrock Block";
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [targetFormat, setTargetFormat] = useState<TargetFormat>("bedrock_block");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeJob, setActiveJob] = useState<ModelJob | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Choose Bedrock Entity or Bedrock Block, then upload a reference image or write a prompt. Bedrock Block means a placeable Minecraft Bedrock custom block."
    }
  ]);

  useEffect(() => {
    if (!activeJob || ["completed", "failed", "cancelled"].includes(activeJob.status)) return;

    const timer = window.setInterval(async () => {
      const nextJob = await fetchJob(activeJob.id);
      setActiveJob(nextJob);

      if (nextJob.status === "completed") {
        setMessages((current) => [
          ...current,
          { role: "assistant", content: "Model generation completed. Please open Blockbench to review the result." }
        ]);
      }

      if (nextJob.status === "failed") {
        setMessages((current) => [
          ...current,
          { role: "assistant", content: nextJob.error ?? "Model generation failed." }
        ]);
      }
    }, 1500);

    return () => window.clearInterval(timer);
  }, [activeJob]);

  async function createReferenceImageUpload(): Promise<ReferenceImageUpload[]> {
    if (!selectedFile) return [];

    const dataUrl = await readFileAsDataUrl(selectedFile);

    return [
      {
        fileName: selectedFile.name,
        mimeType: selectedFile.type || "application/octet-stream",
        dataUrl
      }
    ];
  }

  async function submitJob() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setMessages((current) => [...current, { role: "user", content: getTargetLabel(targetFormat) + ": " + trimmedPrompt }]);
    setPrompt("");

    try {
      const referenceImages = await createReferenceImageUpload();

      const response = await fetch(engineUrl + "/api/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          referenceImages,
          imagePaths: [],
          format: targetFormat,
          autoReview: true
        })
      });

      const data = (await response.json()) as { job?: ModelJob; error?: string };

      if (!response.ok || !data.job) {
        throw new Error(data.error ?? "Unable to create job.");
      }

      setActiveJob(data.job);
      setSelectedFile(null);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            referenceImages.length > 0
              ? "Job created with a reference image for " + getTargetLabel(targetFormat) + "."
              : "Job created for " + getTargetLabel(targetFormat) + "."
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: error instanceof Error ? error.message : "Unable to reach the engine API." }
      ]);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <h1>BuildIT</h1>
        <p>Blockbench Auto Model Studio</p>
        <div className="status-card">
          <strong>Target type</strong>
          <span>{getTargetLabel(targetFormat)}</span>
        </div>
        <div className="status-card">
          <strong>Active job</strong>
          <span>{activeJob ? activeJob.status : "No active job"}</span>
        </div>
      </aside>
      <section className="chat-panel">
        <div className="messages">
          {messages.map((message, index) => (
            <article className={`message ${message.role}`} key={index}>
              {message.content}
            </article>
          ))}
          {activeJob ? (
            <article className="job-card">
              <strong>{activeJob.id}</strong>
              <span>Status: {activeJob.status}</span>
              <ul>
                {activeJob.logs.slice(-5).map((log) => (
                  <li key={log.at}>{log.message}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>
        <div className="composer">
          <div className="target-selector">
            <label>
              <span>Project type</span>
              <select value={targetFormat} onChange={(event) => setTargetFormat(event.target.value as TargetFormat)}>
                <option value="bedrock_entity">Bedrock Entity</option>
                <option value="bedrock_block">Bedrock Block</option>
              </select>
            </label>
            <p>
              Bedrock Block is a placeable Minecraft Bedrock custom block. Bedrock Entity is an entity model.
            </p>
          </div>
          <label className="file-picker">
            <span>{selectedFile ? selectedFile.name : "Select reference image"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
          </label>
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
