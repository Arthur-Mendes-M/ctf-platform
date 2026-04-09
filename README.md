# CTF Platform

A full-stack Capture the Flag platform designed for academic use, where students solve
security challenges and take exams in a gamified environment. Built collaboratively
with a team at a banking security company as a side initiative for a university partner.

**Live demo:** [ctfv2.vercel.app](https://ctfv2.vercel.app)

---

## Overview

The platform was built to bring cybersecurity education into the classroom in a
practical way. A professor can create challenges and exams; students compete,
earn XP, and spend it in a shop — all inside a single interface.

Each challenge or exam question can spin up an isolated Linux virtual machine
directly in the browser. The student connects to it, investigates the environment,
and finds a flag to submit. This infrastructure runs on a separate backend with
Docker container orchestration.

---

## Features

**Challenges**
- Students can instantiate an isolated Linux VM per challenge
- Submit flags captured from inside the virtual environment
- Earn XP on correct submissions

**Exams**
- Mixed format: multiple choice questions and flag-based questions
- Flag questions follow the same VM-based flow as challenges
- Results and reviews available after completion

**Ranking**
- Global leaderboard based on XP earned across challenges and exams
- Per-exam ranking for individual competitions
- Podium display for top 3 players

**Shop**
- Students spend earned Rubies on in-game powers
- Powers include: challenge hints, half-flag reveal, extra attempts,
  remove wrong alternatives, exam hints, question swap
- Each item has a per-user purchase limit

**Dashboard**
- Individual performance tracking
- XP history and challenge progress

---

## Tech stack

**Frontend** *(this repository)*

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn--ui-000000?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

**Backend & Infrastructure** *(separate repository, developed by the team)*
- REST API with authentication and game logic
- Docker container orchestration for VM provisioning per user
- Hosted database

---

## Screenshots

Improving UI ... Screenshoots coming soon 😎

---

## Running locally

```bash
git clone https://github.com/Arthur-Mendes-M/ctf-platform
cd ctf-platform
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_API_URL with your backend URL
npm run dev
```

---

## Context

Developed as a voluntary initiative alongside colleagues at work for a university
cybersecurity course. The full stack — frontend, backend, and VM infrastructure —
was built and deployed. The public rollout was paused due to administrative
constraints on the institution's side, not technical ones.

The platform is functional and accessible at the live demo link above.

---

*Frontend by [Arthur Martins](https://github.com/Arthur-Mendes-M)*  
*Backend and infrastructure by others but are being rewritten!*
