require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const axios = require('axios');

const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(cors({
  origin: "https://theburningjournal.abandontheworld.com"
}));
app.use(express.json());


app.get("/tbj_games", async (req, res) => {
  const { offset = 0, limit = 20 } = req.query;

  try {
    // 1. Get games from the lib table
    const libResult = await pool.query(
      "SELECT * FROM lib ORDER BY vg_id LIMIT $1 OFFSET $2;",
      [limit, offset]
    );

    const games = libResult.rows;

    // 2. For each game, try to get from game_details
    const enrichedGames = await Promise.all(
      games.map(async (game) => {
        const detailResult = await pool.query(
          "SELECT * FROM game_details WHERE name = $1;",
          [game.vg_name]
        );

        if (detailResult.rows.length > 0) {
          return {
            ...game,
            ...detailResult.rows[0],
          };
        } else {
          // 3. If not found, query IGDB
          console.log(`Fetching IGDB for game: ${game.vg_name}`);
          const igdbData = await fetchFromIGDB(game.vg_name);

          if (igdbData) {
            // 4. (Optional) Save it to the database
            await pool.query(
              `INSERT INTO game_details (id, name, summary, game_art_url)
               VALUES ($1, $2, $3, $4);`,
              [game.vg_id, igdbData.name, igdbData.summary, igdbData.game_art_url]
            );

            return {
              ...game,
              ...igdbData,
            };
          } else {
            return {
              ...game,
              name: game.name,
              summary: null,
              game_art_url: [],
            };
          }
        }
      })
    );

    console.log(enrichedGames)
    res.json(enrichedGames);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


app.get("/tbj_games/completed", async (req, res) => {
  const { offset = 0, limit = 20 } = req.query;

  try {
    // 1. Get only completed games from the lib table
    const libResult = await pool.query(
      "SELECT * FROM lib WHERE completed = true ORDER BY vg_id LIMIT $1 OFFSET $2;",
      [limit, offset]
    );

    const games = libResult.rows;

    // 2. Enrich games with details if available
    const enrichedGames = await Promise.all(
      games.map(async (game) => {
        const detailResult = await pool.query(
          "SELECT * FROM game_details WHERE name = $1;",
          [game.vg_name]
        );

        if (detailResult.rows.length > 0) {
          return {
            ...game,
            ...detailResult.rows[0],
          };
        } else {
          // 3. Fallback to IGDB
          console.log(`Fetching IGDB for game: ${game.vg_name}`);
          const igdbData = await fetchFromIGDB(game.vg_name);

          if (igdbData) {
            // 4. Optional: cache in game_details
            await pool.query(
              `INSERT INTO game_details (id, name, summary, game_art_url)
               VALUES ($1, $2, $3, $4);`,
              [game.vg_id, igdbData.name, igdbData.summary, igdbData.game_art_url]
            );

            return {
              ...game,
              ...igdbData,
            };
          } else {
            return {
              ...game,
              name: game.name,
              summary: null,
              game_art_url: [],
            };
          }
        }
      })
    );

    res.json(enrichedGames);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


app.get("/tbj_games/finished", async (req, res) => {
  const { offset = 0, limit = 20 } = req.query;

  try {
    // 1. Get only completed games from the lib table
    const libResult = await pool.query(
      "SELECT * FROM lib WHERE finished = true ORDER BY vg_id LIMIT $1 OFFSET $2;",
      [limit, offset]
    );

    const games = libResult.rows;

    // 2. Enrich games with details if available
    const enrichedGames = await Promise.all(
      games.map(async (game) => {
        const detailResult = await pool.query(
          "SELECT * FROM game_details WHERE name = $1;",
          [game.vg_name]
        );

        if (detailResult.rows.length > 0) {
          return {
            ...game,
            ...detailResult.rows[0],
          };
        } else {
          // 3. Fallback to IGDB
          console.log(`Fetching IGDB for game: ${game.vg_name}`);
          const igdbData = await fetchFromIGDB(game.vg_name);

          if (igdbData) {
            // 4. Optional: cache in game_details
            await pool.query(
              `INSERT INTO game_details (id, name, summary, game_art_url)
               VALUES ($1, $2, $3, $4);`,
              [game.vg_id, igdbData.name, igdbData.summary, igdbData.game_art_url]
            );

            return {
              ...game,
              ...igdbData,
            };
          } else {
            return {
              ...game,
              name: game.name,
              summary: null,
              game_art_url: [],
            };
          }
        }
      })
    );

    res.json(enrichedGames);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});





app.get("/top10", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM lib ORDER BY hours_played DESC LIMIT 10"
    );
    const gameResult = result.rows;

    const gamenames = gameResult.map((i) => i.vg_name);
    const whereClause = gamenames.map((name) => `name = "${name}"`).join(" | ");

    const gamesQuery = `
      fields id, name, cover.image_id;
      where ${whereClause};
      limit 10;
    `;

    const gamesResponse = await axios.post(
      "https://api.igdb.com/v4/games",
      gamesQuery,
      {
        headers: {
          "Client-ID": process.env.CLIENT_ID,
          "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "text/plain",
        },
      }
    );

    const enrichedGames = gamesResponse.data.map((game) => {
      const imageUrl = game.cover?.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
        : null;
      return {
        ...game,
        image_url: imageUrl,
      };
    });
    console.log([gameResult, enrichedGames]);
    res.json([gameResult, enrichedGames]);
  } catch (err) {
    console.error("Full error: ", err.response?.data || err.message);
    res.status(500).send("Server error");
  }
});


//gets a random game of the day
let cachedGOTD = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours in ms

app.get("/GOTD", async (req, res) => {
  const now = Date.now();

  if (cachedGOTD && now - cacheTimestamp < CACHE_DURATION) {
    // Serve cached data
    return res.json(cachedGOTD);
  }

  try {
    const result = await pool.query("SELECT * FROM lib ORDER BY RANDOM() LIMIT 1;");
    const gameResult = result.rows[0];

    const queryBody = `
      fields name,cover.url,summary;
      search "${gameResult.vg_name}";
      limit 1;
    `;

    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      queryBody,
      {
        headers: {
          "Client-ID": process.env.CLIENT_ID,
          "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "text/plain",
        },
      }
    );

    cachedGOTD = [gameResult, response.data];
    cacheTimestamp = now;

    console.log("Fetched new GOTD:", cachedGOTD);
    res.json(cachedGOTD);

  } catch (err) {
    console.error("Full error:", err.response?.data || err.message);
    res.status(500).send("Server Error");
  }
});


async function fetchFromIGDB(name) {
  name = cleanGameName(name);

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID,
      "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: `
      fields name, summary, cover.image_id;
      where name = *"${name}"*;
      limit 1;
    `,
  });

  let data;

  try {
    data = await response.json();
  } catch (e) {
    console.error("Failed to parse IGDB response as JSON:", e);
    return null;
  }

  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No valid game data returned from IGDB for:", name, data);
    return null;
  }

  const game = data[0];

  return {
    name: game?.name ?? name,
    summary: game?.summary ?? null,
    game_art_url: game?.cover?.image_id
      ? [
          `https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover.image_id}.jpg`,
          `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`,
        ]
      : [],
  };
}


function cleanGameName(name) {
  return name
    .replace(/\(.*?\)/g, "")        // remove things in parentheses, e.g. (PS4), (Vita)
    .replace(/[™©®]/g, "")          // remove trademark symbols
    .replace(/[:;'"“”‘’]/g, "")     // remove punctuation like colon, semicolon, quotes
    .replace(/\s+/g, " ")           // collapse extra spaces
    .trim();                        // remove leading/trailing spaces
}



app.get("/surprise-me", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM lib WHERE hours_played = 0 ORDER BY RANDOM() LIMIT 1;");
    const gameResult = result.rows[0];

    const queryBody = `
      fields name,cover.url,summary;
      search "${gameResult.vg_name}";
      limit 1;
    `;

    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      queryBody,
      {
        headers: {
          "Client-ID": process.env.CLIENT_ID,
          "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "text/plain",
        },
      }
    );

    surprised = [gameResult, response.data];


    console.log("Fetched new GOTD:", surprised);
    res.json(surprised);

  } catch (err) {
    console.error("Full error:", err.response?.data || err.message);
    res.status(500).send("Server Error");
  }
});



// Start server
app.listen(5099, () => {
    console.log("Server is running on port 5099");
});

