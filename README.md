# 🎵 Spotify Player App(still in development)

A full-stack web application that integrates with the official **Spotify Web API**. Users can log in with their Spotify account, authenticate via OAuth 2.0, have their sessions managed securely, and interact with Spotify services.

---

## 🚀 Key Features

- **OAuth 2.0 Authentication:** Complete authorization code flow with automatic access and refresh token handling.
- **Database & ORM Integration:** User data, tokens, and application state are stored in **PostgreSQL** using the **Sequelize ORM**.
- **Session Management:** Secure user sessions powered by `express-session`, persisted in PostgreSQL via `connect-pg-simple`.
- **Email Notifications:** Automated email dispatch via **Nodemailer**.
- **RESTful Architecture:** Express.js routing organized into modular controllers and middlewares.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** - doesnt exists for now ,there is a change i will try to do it in react
- **Database:** PostgreSQL, Sequelize ORM
- **Authentication:** OAuth 2.0 (Spotify Web API)
- **Libraries & Tools:**
  `bcrypt`, `connect-pg-simple`, `cookie-parser`, `dotenv`, `express`, `express-session`, `nodemailer`, `pg`, `sequelize`

---

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (installed automatically with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (running locally or remotely, with an empty database created for the app)
- A Spotify Developer account to obtain API credentials ([Spotify Developer Dashboard](https://developer.spotify.com/dashboard))
- An SMTP account for sending emails

### Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Create a `.env` file in the root directory and add your application settings:

   | Variable         | Description                                                                    |
   | ---------------- | ------------------------------------------------------------------------------ |
   | `PORT`           | Port on which the app runs                                                     |
   | `DB_NAME`        | Name of the database                                                           |
   | `DB_USER`        | Database user                                                                  |
   | `DB_PASSWORD`    | Password of the database user                                                  |
   | `CLIENT_ID`      | Client ID generated for your app in the Spotify Developer Dashboard            |
   | `CLIENT_SECRET`  | Client secret generated for your app in the Spotify Developer Dashboard        |
   | `REDIRECT_URI`   | URI to redirect to after Spotify OAuth 2.0 authorization                       |
   | `SESSION_SECRET` | Secret used to sign session cookies                                            |
   | `SMTP_HOST`      | SMTP server host                                                               |
   | `SMTP_PORT`      | SMTP server port                                                               |
   | `SMTP_USER`      | Email address / username for the SMTP server                                   |
   | `SMTP_PASS`      | Password for the SMTP user                                                     |
   | `EMAIL_FROM`     | Address the emails are sent from                                               |

   Example `.env`:

   ```env
   PORT=3000
   DB_NAME=spotify_app
   DB_USER=postgres
   DB_PASSWORD=your_password
   CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   REDIRECT_URI=http://localhost:3000/callback
   SESSION_SECRET=your_long_random_secret
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=user@example.com
   SMTP_PASS=your_smtp_password
   EMAIL_FROM=no-reply@example.com
   ```

   > ⚠️ Never commit your `.env` file to version control. Make sure it is listed in `.gitignore`.

3. **Run the application:**

   For production / standard start:

   ```bash
   npm start
   ```

   For development mode (with auto-reload):

   ```bash
   npm run dev
   ```
