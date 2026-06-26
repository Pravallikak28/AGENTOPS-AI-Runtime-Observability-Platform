# 🚀 AGENTOPS – AI Runtime & Observability Platform

> **Observe Every Agent. Understand Every Decision. Debug Every Workflow.**

🌐 **Live Demo:** https://agentops-694578067508.asia-southeast1.run.app

---

## 📖 Overview

AGENTOPS is a modern **AI Runtime & Observability Platform** built for AI Engineers developing production-grade AI agents and LLM applications.

Instead of only displaying the final AI response, AGENTOPS visualizes **every internal execution step**, allowing developers to inspect agent reasoning, trace workflows, monitor tool calls, analyze latency, debug failures, replay executions, and optimize AI systems with confidence.

Inspired by modern AI engineering platforms such as **LangSmith**, **Langfuse**, **Helicone**, and **AgentOps**, AGENTOPS provides a unified workspace for understanding how AI agents behave internally.

---

# ✨ Features

## 🤖 Live Agent Execution

Visualize every execution performed by an AI agent.

Execution Flow:

```
User
   │
   ▼
Planner
   │
   ▼
Retriever
   │
   ▼
Memory
   │
   ▼
Tool Calls
   │
   ▼
Gemini
   │
   ▼
Validator
   │
   ▼
Final Response
```

Features include:

- Live execution monitoring
- Animated execution nodes
- Real-time status updates
- Interactive execution flow
- Node-level inspection

---

## 📜 Session Explorer

Track and inspect every execution session.

Each session displays:

- Session ID
- Timestamp
- Duration
- Status
- Token Usage
- Estimated Cost
- Response Time

Open any session to inspect the complete execution lifecycle.

---

## 🔍 Distributed Trace Viewer

Understand exactly what happened during execution.

Execution Timeline:

- Planner Started
- Memory Search
- Document Retrieval
- Tool Invocation
- Gemini Processing
- Validation
- Final Response

Each event expands to reveal additional execution details.

---

## 🛠 Tool Call Inspector

Inspect every external tool invocation.

Displays:

- Tool Name
- Input Parameters
- Output
- Runtime
- Status
- Retry Count
- Error Details

Perfect for debugging AI workflows.

---

## 🧠 Memory Inspector

Inspect the complete memory state used during execution.

Includes:

- Conversation Context
- Session Memory
- Retrieved Documents
- Knowledge Sources
- Memory References
- Context Window

---

## 💬 Prompt Inspector

Visualize prompt transformations.

Displays:

- Original Prompt
- Expanded Prompt
- Final Prompt Sent to Gemini

Compare prompts and understand how the runtime constructs model inputs.

---

## 📊 Token Analytics

Monitor token consumption through interactive dashboards.

Metrics:

- Input Tokens
- Output Tokens
- Total Tokens
- Average Tokens
- Daily Usage
- Weekly Usage
- Monthly Trends

---

## ⚡ Latency Dashboard

Analyze runtime performance.

Tracks:

- Planning Time
- Retrieval Time
- Tool Execution Time
- Gemini Response Time
- Total Execution Time

Identify performance bottlenecks instantly.

---

## 💰 Cost Analytics

Estimate operational costs.

Visualizations include:

- Cost per Session
- Cost per Agent
- Daily Cost
- Weekly Cost
- Monthly Cost
- Usage Trends

---

## ❤️ Agent Health Monitor

Monitor runtime health in real time.

Displays:

- Success Rate
- Failure Rate
- Running Agents
- Active Sessions
- Average Runtime
- System Health

---

## 🚨 Error Dashboard

Analyze failures efficiently.

Includes:

- Prompt Errors
- Tool Failures
- Memory Issues
- Validation Errors
- Timeouts
- Retry Attempts

Each issue includes diagnostics for debugging.

---

## ▶️ Agent Replay

Replay complete executions step-by-step.

Replay:

- Planner
- Retriever
- Memory
- Tool Calls
- Gemini
- Validator
- Final Response

Useful for debugging complex AI workflows.

---

## 📂 Reports & Export

Export execution data in multiple formats.

Supported exports:

- PDF
- JSON
- CSV
- Markdown

Generate execution summaries for reporting and analysis.

---

## 📈 Enterprise Analytics

Professional dashboards for AI Engineers.

Track:

- Session Trends
- Token Usage
- Agent Performance
- Cost Analysis
- Runtime Distribution
- Error Rates
- Tool Performance
- Latency Trends

---

# 🎨 User Interface

AGENTOPS follows a premium developer-first design inspired by:

- Cursor
- Linear
- GitHub
- Vercel
- Stripe Dashboard
- LangSmith

Design Highlights:

- Dark Theme
- Glassmorphism
- Professional Charts
- Responsive Layout
- Interactive Dashboards
- Smooth Animations
- Developer-Centric Navigation

---

# 🏗️ System Architecture

```
                 User Request
                      │
                      ▼
               Planner Agent
                      │
                      ▼
             Memory Retrieval
                      │
                      ▼
              External Tool Calls
                      │
                      ▼
               Gemini Processing
                      │
                      ▼
                Validation Layer
                      │
                      ▼
                Final Response
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
  Trace Viewer   Analytics   Prompt Inspector
        │             │             │
        ▼             ▼             ▼
Memory Inspector   Dashboard   Reports
```

---

# 🛠️ Tech Stack

## Frontend

- React
- Tailwind CSS
- Framer Motion
- Recharts

## AI

- Google Gemini

## Deployment

- Google AI Studio
- Google Cloud Run

---

# 🎯 Target Users

AGENTOPS is built for:

- AI Engineers
- Agentic AI Developers
- LLM Developers
- GenAI Engineers
- AI Researchers
- AI Product Teams
- AI Startups
- AI Platform Engineers

---

# 💡 Why AGENTOPS?

Modern AI applications are no longer simple API calls.

Today's AI systems involve:

- Planning
- Memory Retrieval
- Tool Calling
- Validation
- Multi-Agent Collaboration
- External APIs
- Runtime Decisions

AGENTOPS helps developers understand every step of that execution pipeline.

It transforms AI systems from **black boxes into observable, debuggable, measurable workflows**.

---

# 🚀 Future Roadmap

Upcoming enterprise features include:

- Multi-Model Runtime Support
- AI Root Cause Analysis
- Team Workspaces
- OpenTelemetry Integration
- Webhook Support
- Production Alerting
- Role-Based Access Control
- Enterprise Authentication
- Agent Collaboration Dashboard
- Distributed Runtime Monitoring
- Custom Dashboards
- API Monitoring
- Cloud Deployment Integrations

---

# 📄 License

This project is released for **educational, research, and portfolio purposes**.

---

# 👩‍💻 Author

## Pravallika Kuruva

**AI Engineer | Full Stack AI Developer | Agentic AI Enthusiast**

### GitHub

https://github.com/Pravallikak28

---

# ⭐ Support

If you found this project interesting, please consider giving it a ⭐ on GitHub.

It helps support future AI Engineering projects and open-source development.

---

## 🚀 Building the Future of AI Engineering

**AGENTOPS** is part of a growing ecosystem of AI Engineering platforms developed to make modern AI systems more transparent, observable, and production-ready.

Explore the live demo and experience how professional AI teams can inspect, debug, replay, and optimize complex AI agent workflows.
