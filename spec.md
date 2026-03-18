# GlowGrid - Territory Capture Game

## Current State
New project. No existing application.

## Requested Changes (Diff)

### Add
- Multiplayer territory capture game on a grid map
- Players join with a username and are assigned a neon color
- Players move a character on the grid; cells they visit become their territory
- Other players can recapture territory by running over it
- Live leaderboard showing territory percentage per player
- Game timer; when it ends, player with most territory wins
- Ability to start a new game

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- Game state: grid (20x20), cell ownership map, list of players with positions/colors/scores
- Player registration: joinGame(username) -> playerId + color
- Move action: movePlayer(playerId, direction) -> updates position, captures cell
- Query game state: getGameState() -> full grid, players, scores, timer
- Start new game / reset: newGame()
- Game timer logic (round-based, ~3 minute rounds)

### Frontend (React)
- Landing/home page with neon cyber aesthetic matching design preview
- Join game form (username input)
- Live game grid (20x20 colored cells, player avatars)
- Arrow key / WASD controls for movement
- Live leaderboard sidebar
- Game HUD: timer, player count, current player's score
- Victory screen when game ends
- Polling every 300ms for live game state updates
