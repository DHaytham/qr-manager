# QR Code Manager

QR Code Manager is a web app for creating **dynamic QR codes**: codes whose destination can be changed at any time, without reprinting them.

## How it works

Each QR code doesn't point straight to a website. It points to a short link on this app (`/r/<id>`), and the app forwards the visitor to whatever website is currently assigned to that code. Changing the destination in the dashboard updates every printed copy instantly.

## Features

- **Generate QR codes**: with a destination right away, or as blank cards to link to a website later
- **Change destinations**: point any existing QR code to a new website, or deactivate it
- **Scan counter**: see how many times each code has been scanned
- **Download**: save any QR code as a PNG, ready to print
- **Search**: find codes by ID or destination
- **Admin login**: the dashboard is password protected, while scanning a code works for everyone
- **Safe redirects**: only valid `http://` and `https://` addresses are accepted

## Tech stack

- **Frontend:** React with Material UI
- **Backend:** Node.js with Express
- **Database:** PostgreSQL, accessed through Sequelize
- **QR generation:** the `qrcode` library

In production, a single Node.js service serves both the API and the React app.

## Project structure

```
client/   React dashboard (login, list, generate, edit)
server/   Express API, QR redirects and database models
```
