# maculate-grid

An Immaculate Grid clone built with Next.js and Typescript. This project was primarily just a way for me to play around with the new Cursor IDE. At the moment the database contains all QBs, RBs, WRs, and TEs since 1999.

**Live Demo:** [maculate-grid-production.up.railway.app](https://maculate-grid-production.up.railway.app)

## Features

- Interactive 3x3 grid interface
- Real-time answer validation
- Player search with autocomplete
- Database containing QBs, RBs, WRs, and TEs since 1999

## Quick Start

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Database Setup

The application uses SQLite for storing player data. There is a powershell script that you can run to setup the DB file. If you are not on windows, you can also just run the `setup_db.py` file. You can find the required python modules in `requirements.txt`:

```bash
# Windows
./setup.ps1

# Unix/Linux
python setup_db.py
```

## Deployment

The application is containerized with Docker:

```bash
# Build the Docker image
docker build -t maculate-grid .

# Run the container locally
docker run -p 8080:8080 maculate-grid
```

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind
- **Backend**: Next.js API Routes
- **Database**: SQLite
- **Deployment**: Docker, Railway (for the live demo)

## Upcoming Features

- Rarity scoring system
- Players from all positions
- UI improvements (team logos, player headshots, etc.)
- User stat tracking

## License

MIT

## References
The data that ths Maculate Grid relies on comes from a public repo provided by nflverse. I use the player season stats data specifically for this project but the repo has even more detailed data from current and past seasons. All of this data can be accessed and downloaded from [here](https://github.com/nflverse/nflverse-data/releases).

Here is a link to nflverse's main GitHub page as well: https://github.com/nflverse
