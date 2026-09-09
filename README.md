# Real-Time Tic-Tac-Toe Backend (Laravel Reverb)

This is the backend for the Real-Time Tic-Tac-Toe game. It is built with Laravel and provides an API and a WebSocket server using Laravel Reverb to synchronize game state across multiple players in real-time.

## Tech Stack

*   **Framework:** Laravel 11
*   **Real-time Server:** Laravel Reverb (WebSockets)
*   **Database:** SQLite
*   **Infrastructure:** Render (via Docker)

## Deployment Details

*   **Backend Base URL:** `https://real-time-tic-tac-toe-backend-w1o4.onrender.com`
*   **API Base URL:** `https://real-time-tic-tac-toe-backend-w1o4.onrender.com/api`
*   **WebSocket Host (Reverb):** `real-time-tic-tac-toe-backend-w1o4.onrender.com`

> **Note:** The backend is deployed on Render's free tier. This means the instance spins down when inactive. The first request after a period of inactivity might experience a delay of 50 seconds or more.

## API Endpoints

The following API endpoints are available (prefixed with `/api`):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/rooms` | Create a new game room. |
| `POST` | `/rooms/join` | Join an existing game room (returns current state). |
| `GET` | `/rooms/{name}` | Get the current state of a room. |
| `POST` | `/rooms/{name}/move` | Submit a player move. |
| `POST` | `/rooms/{name}/reset` | Reset a game board in a room. |
| `DELETE` | `/rooms/{name}` | Delete a room. |

## WebSocket (Reverb) Integration

The backend broadcast events to clients connected to specific room channels. Clients should subscribe to the following private channel:

`private-room.{roomName}`

It broadcasts the following event:

`App\Events\MovePlayed`

## Local Setup

1.  Clone the repository.
2.  Install dependencies: `composer install`
3.  Copy the `.env.example` to `.env`.
4.  Generate an app key: `php artisan key:generate`
5.  Set up the SQLite database: `touch database/database.sqlite`
6.  Run migrations: `php artisan migrate --seed`
7.  Run the Laravel server: `php artisan serve`
8.  Run the Reverb server: `php artisan reverb:start`

## Environment Variables (.env)

Make sure the following environment variables are set correctly:

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Reverb (Local)
REVERB_SERVER_HOST=0.0.0.0
REVERB_SERVER_PORT=8080
REVERB_APP_ID=myreverb
REVERB_APP_KEY=mykey
REVERB_APP_SECRET=mysecret
REVERB_SCHEME=http


Created with ❤️ by IT. Aya
