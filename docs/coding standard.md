```mermaid
flowchart TD

Player --> Input

Input --> Engine

Engine --> Physics

Physics --> Collision

Collision --> Score

Score --> HUD

Engine --> Renderer

Renderer --> Browser

Engine --> Audio

Engine --> EventBus

EventBus --> Backend

Backend --> PostgreSQL
```