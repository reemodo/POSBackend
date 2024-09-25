Node.js & PostgreSQL Application with Docker

This repository contains a Node.js backend connected to a PostgreSQL database using Docker Compose. It is set up to run in a containerized environment, making it easy to deploy and run on any machine.

Features

Node.js Backend: A simple Node.js application that connects to a PostgreSQL database.
PostgreSQL Database: A PostgreSQL database running inside a Docker container.
Docker Compose: Orchestrates both the Node.js app and the PostgreSQL database.
Database Backup and Restore: Includes a restore-db.sh script that automates restoring the PostgreSQL database from an attached backup file.
Prerequisites

Docker and Docker Compose installed on your system.
Installation

1. Clone the Repository
bash
Copy code
git clone https://github.com/your-username/your-repo.git
cd your-repo

2. Build and Run with Docker Compose
To build and start the app along with the database, run:

bash
Copy code
docker-compose up --build
This will:

Build the Node.js application.
Start the PostgreSQL container.
The app will be accessible at http://localhost:8080.
3. Restoring the PostgreSQL Backup
To restore the database from the backup file, use the provided restore-db.sh script:

bash
Copy code
./restore-db.sh
This will:

Restore the database specified in the .env file from the ./backups/backup.sql file.
6. Accessing the Application
Once everything is up and running, you can access your Node.js application at:

arduino
Copy code
http://localhost:8080
The database is running on localhost:5432 by default.

Usage

The app will automatically connect to the PostgreSQL database using the environment variables specified in the .env file.
To stop the containers, run:
bash
Copy code
docker-compose down
File Structure

plaintext
Copy code
.
├── backups/                # Folder to store PostgreSQL backups
│   └── backup.sql          # PostgreSQL backup file (attached)
├── app/             # Node.js application code
│   ├── controller/         # API controllers
│   ├── server.js           # Main server file
├── restore-db.sh           # Bash script to restore the PostgreSQL database
├── .env                    # Environment variables
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile               # Dockerfile for Node.js app
└── README.md                # This README file

This project is licensed under the MIT License - see the LICENSE file for details.
