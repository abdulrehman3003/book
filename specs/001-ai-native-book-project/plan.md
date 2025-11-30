# Implementation Plan: AI-Native Book Project

**Branch**: `001-ai-native-book-project` | **Date**: 2025-11-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-ai-native-book-project/spec.md`

## Summary

Build and deploy an **AI-Native Interactive Book** using Docusaurus, powered by **Gemini CLI**, **Claude Code workflows**, **Spec-Kit Plus**, and a fully working **RAG Chatbot** backed by FastAPI, Qdrant, and Neon. This plan covers everything needed to complete the project **in one day**.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: Docusaurus, Gemini CLI, Claude Code, Spec-Kit Plus, FastAPI, Qdrant, Neon, OpenAI Agents/ChatKit SDK
**Storage**: Qdrant Cloud, Neon Postgres
**Testing**: NEEDS CLARIFICATION
**Target Platform**: Web (Docusaurus), Serverless (FastAPI)
**Project Type**: Web application
**Performance Goals**: NEEDS CLARIFICATION
**Constraints**: Complete project in one day (10-hour hackathon).
**Scale/Scope**: 1 book, 1 RAG chatbot

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. AI/Spec-Driven Book Creation**: All book content is generated using Gemini CLI + Claude Code + Spec-Kit Plus.
- **II. Integrated RAG Chatbot**: Built with OpenAI Agents / ChatKit, FastAPI backend, Qdrant vector storage, Neon Postgres, and embedded chat widget inside Docusaurus.
- **III. Point-Based Evaluation**: Full base functionality = 100 points.
- **IV. Bonus: Reusable Intelligence**: Up to 50 points for Claude Code Subagents + Agent Skills.
- **V. Bonus: Auth & Personalization**: Up to 50 points using `better-auth`.

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-native-book-project/
├── plan.md              # This file
├── research.md          # To be created
├── data-model.md        # To be created
├── quickstart.md        # To be created
├── contracts/           # To be created
└── tasks.md             # To be created
```

### Source Code (repository root)

```text
# Web application
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/
```

**Structure Decision**: The project will be structured as a web application with a separate frontend (Docusaurus) and backend (FastAPI).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
|           |            |                                     |
