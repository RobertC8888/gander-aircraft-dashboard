# Gander Aircraft Dashboard

[Vercel Deployment](https://gander-aircraft-dashboard-9vys72ly0.vercel.app/)

link: https://gander-aircraft-dashboard-9vys72ly0.vercel.app/

A single-page web application built with React and Next.js to monitor and manage aircraft readiness. This project was developed as part of the Gander Internship take-home assignment. To update status, click on plane module.

## Features

- Display aircraft on an interactive map
- Filter aircraft by tail number, model, and readiness status
- Edit and update aircraft readiness status
- Persist changes using a mock backend (`json-server`) or localStorage

## Tech Stack

- Next.js 15
- React 19
- Tailwind CSS 4
- json-server (mock backend)
- Leaflet and React-Leaflet (interactive map)


## Installation and Setup

Follow these steps to set up and run the project locally:


### 1. Install dependencies

npm install


### 3. Start the dev server

npm run dev

The app will be available at:  
http://localhost:3000



### 4. (Optional) Start the backend server

npm run backend

This runs `json-server` at:  
http://localhost:4000/aircraft


> If you're using localStorage for persistence only, this step is optional.


## Notes

- On first load, data is fetched from `db.json` (via `json-server`) if the backend is running.
- If not, the app defaults to localStorage for data persistence.
- Changes to aircraft status will persist across refreshes.
