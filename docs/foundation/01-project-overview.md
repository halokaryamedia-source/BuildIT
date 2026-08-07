# BlockIT — Product Intent Overview

**Status:** Draft  
**Version:** 1.0

## 1. Project Name

BlockIT

## 2. Project Summary

BlockIT is a system that lets Codex create Minecraft Bedrock models in Blockbench through MCP.

The user provides a simple request and a visual reference prepared in advance. Codex turns those inputs into a structured Blockbench project and saves the result as a `.bbmodel` file.

## 3. Problem Statement

Creating Minecraft Bedrock models in Blockbench requires form control, proportion control, hierarchy management, UV planning, and texturing discipline.

Non-technical users struggle with that process. Without a clear workflow, Codex may:

- misread the intended shape;
- produce a model that is structurally valid but visually weak;
- repeat unnecessary steps;
- waste tokens;
- claim completion without visual evidence.

## 4. Product Goal

Help non-technical users produce a structured Blockbench project that can be reopened, continued, and validated.

## 5. Target User

The primary user is someone who:

- does not understand MCP;
- does not understand Blockbench in depth;
- does not understand 3D modelling;
- wants to give a simple request and receive a `.bbmodel` file.

## 6. Success Criteria

BlockIT is successful when:

- the user can give a simple request;
- Codex can execute the modelling flow through MCP;
- the result is saved as a `.bbmodel`;
- the model includes geometry, hierarchy, UV, texture, and animation when required;
- the project can be reopened and continued;
- structural validation is honest;
- visual quality is not claimed without visual evidence.

## 7. Constraints

- Any Blockbench or MCP capability that has not been verified must be treated as unconfirmed.
- A saved file does not prove visual correctness.
- Reference quality strongly affects output quality.
- The initial scope must stay small.
