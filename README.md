# The Burning Journal

A personal, full-stack game library and backlog tracker. Catalog your games, track your progress, and enrich your collection with real-time metadata from IGDB.

---

## Features

- **Game Catalog:** Store and organize your video game collection.
- **Batch Metadata Fetching:** Automatically pulls game summaries, genres, and cover art from IGDB in batches.
- **Data Cleaning:** Cleans and normalizes game names for accurate API lookups.
- **PostgreSQL Integration:** Persists game details and user library data.
- **Self-Hosting:** Runs on your own server, with Nginx reverse proxy for secure web access.
- **Learning Focus:** Built as a learning project to explore full-stack development, API integration, and server deployment.

---

## Tech Stack

- **Frontend:** React (see `/frontend`)
- **Backend:** Node.js, Express (see `/backend`)
- **Database:** PostgreSQL
- **APIs:** IGDB (for game metadata)
- **Deployment:** Self-hosted on a home server, proxied with Nginx

---

## Setup & Usage

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/TheBurningJournal.git
    cd TheBurningJournal
    ```

2. **Backend Setup:**
    - Install dependencies:
        ```sh
        cd backend
        npm install
        ```
    - Copy and edit environment variables:
        ```sh
        cp .env.example .env
        # Fill in your DATABASE_URL, IGDB CLIENT_ID, and ACCESS_TOKEN
        ```
    - Start the backend:
        ```sh
        npm start
        ```

3. **Frontend Setup:**
    - Install dependencies:
        ```sh
        cd ../frontend
        npm install
        ```
    - Start the frontend:
        ```sh
        npm start
        ```

4. **Database:**
    - Ensure PostgreSQL is running and your tables are set up (see `/backend` for schema).

5. **Self-Hosting (optional):**
    - Deploy on your home server.
    - Use Nginx as a reverse proxy for HTTPS and public access.

---

## Learning & Development

This project is a work in progress and a learning experience in:
- Full-stack JavaScript development
- API integration and batch data processing
- Database design and SQL
- Server setup, networking, and Nginx configuration

---

## Roadmap

See [`whatdoiwantforthesitemaybe.txt`](whatdoiwantforthesitemaybe.txt) for ideas and planned features.

---

## License

MIT

---

## Acknowledgments

- [IGDB API](https://api-docs.igdb.com/)
- [Node.js](https://nodejs.org/)
- [React](https://react.dev/)
- [PostgreSQL](https://www.postgresql.org/)
