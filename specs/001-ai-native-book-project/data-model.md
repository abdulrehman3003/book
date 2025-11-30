# Data Model: AI-Native Book Project

This document describes the data model for the AI-Native Book Project.

## Book

The root object of the book.

- **sections**: An array of `Section` objects.

## Section

A section of the book.

- **title**: The title of the section (e.g., "Concepts", "Labs", "Assessment").
- **items**: An array of `Chapter`, `Lab`, or `Assessment` objects.

## Chapter

A chapter in the "Concepts" section.

- **title**: The title of the chapter.
- **content**: The content of the chapter in Markdown format.

## Lab

A lab in the "Labs" section.

- **title**: The title of the lab.
- **content**: The content of the lab in Markdown format.

## Assessment

An assessment in the "Assessment" section.

- **title**: The title of the assessment.
- **questions**: An array of `Question` objects.

## Question

A question in an assessment.

- **text**: The text of the question.
- **choices**: An array of `Choice` objects.

## Choice

A choice for a question.

- **text**: The text of the choice.
- **isCorrect**: A boolean indicating whether the choice is the correct answer.
