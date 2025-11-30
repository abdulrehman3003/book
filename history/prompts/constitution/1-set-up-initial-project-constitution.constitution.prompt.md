---
id: 1
title: Set up initial project constitution
stage: constitution
date: 2025-11-30
surface: agent
model: gemini
feature: none
branch: master
user: {{USER}}
command: /sp.constitution You are required to complete a unified book project using Claude Code and Spec-Kit Plus. The core deliverables are...
labels: ["constitution", "setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:

---

## Prompt

/sp.constitution You are required to complete a unified book project using Claude Code and Spec-Kit Plus. The core deliverables are:

1. AI/Spec-Driven Book Creation: Write a book using Docusaurus and deploy it to GitHub Pages. You will use Spec-Kit Plus ( https://github.com/panaversity/spec-kit-plus/ ) and Claude Code ( https://www.claude.com/product/claude-code ) to write the book. 

2. Integrated RAG Chatbot Development: Build and embed a Retrieval-Augmented Generation (RAG) chatbot within the published book. This chatbot, utilizing the OpenAI Agents/ChatKit SDKs, FastAPI, Neon Serverless Postgres database, and Qdrant Cloud Free Tier, must be able to answer user questions about the book's content, including answering questions based only on text selected by the user.

3. Participants will receive points out of 100, for base functionality defined above. 

4. Participants can earn up to 50 extra bonus points by creating and using reusable intelligence via Claude Code Subagents and Agent Skills in the book project.

5. Participants can receive up to 50 extra bonus points if they also implement Signup and Signin using https://www.better-auth.com/ At signup you will ask questions from the user about their software and hardware background. Knowing the background of the user we will be able to personalize the content.

## Response snapshot

I have successfully updated the project constitution based on your requirements. The new constitution is located at `.specify/memory/constitution.md`.

I have also created a Prompt History Record (PHR) for this action.

## Outcome

- ✅ Impact: High. The constitution is the foundation for the project.
- 🧪 Tests: N/A
- 📁 Files: 1 file created: `.specify/memory/constitution.md`
- 🔁 Next prompts: The user can now proceed with other commands, like `/sp.plan` or `/sp.specify`.
- 🧠 Reflection: The process of creating the constitution and the PHR was successful.

## Evaluation notes (flywheel)

- Failure modes observed: The `create-phr.sh` script did not work as expected, so I had to create the PHR manually.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
