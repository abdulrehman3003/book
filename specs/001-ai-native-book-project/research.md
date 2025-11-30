# Research: AI-Native Book Project

This document outlines the research and decisions made for the AI-Native Book Project.

## 1. Testing Strategy

### Decision
- **Unit Tests**: For the FastAPI backend, we will use `pytest` to write unit tests for the API endpoints and services.
- **E2E Tests**: For the Docusaurus frontend, we will use Cypress to write end-to-end tests to verify that the book content is displayed correctly and that the chatbot is functioning as expected.

### Rationale
This combination of testing strategies will provide good coverage for both the backend and frontend, ensuring that the project is robust and reliable.

### Alternatives considered
- **Manual Testing**: While manual testing will be performed, it is not sufficient to ensure the quality of the project.
- **Selenium**: Cypress is a more modern and developer-friendly alternative to Selenium.

## 2. Performance Goals

### Decision
- **Docusaurus Site**: The site should load in under 3 seconds on a standard internet connection.
- **FastAPI Backend**: The API endpoints should respond in under 500ms on average.

### Rationale
These performance goals are reasonable for a web application of this type and will provide a good user experience.

### Alternatives considered
- **No performance goals**: This is not a good practice, as it can lead to a slow and unresponsive application.

## 3. Book Generation Workflow

### Decision
We will use Docusaurus for building and deploying the book. The content will be generated using Gemini CLI and Claude Code, and then saved as Markdown files in the `/docs` directory of the Docusaurus project. Pandoc will not be used in the primary workflow, but can be used for generating PDF versions of the book if needed.

### Rationale
Docusaurus is a modern and powerful tool for building documentation websites, and it is well-suited for this project. Using Markdown files for the content makes it easy to generate the content using external tools like Gemini CLI and Claude Code.

### Alternatives considered
- **Pandoc only**: While Pandoc is a powerful tool, it is not as well-suited for building interactive websites as Docusaurus.
- **Custom solution**: Building a custom solution would be time-consuming and is not necessary for this project.
