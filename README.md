# Gator

A CLI tool that fetches RSS feeds and stores recent published posts in the database. built to learn how to create a CLI in typescript, and database modeling using drizzle ORM.

## Why I Built This

This project was built to strengthen my understanding of SQL queries, constraints, and relational database design.

## Features

- Register/login users
- Add, follow, and unfollow feeds
- browse recent published posts that the logged in user follows
- Aggregate: a long running process that continuously fetches posts from RSS feeds and stores them in the db: 

## Usage

Clone the repo and install dependencies

```bash
cd gator
npm install
```
Register a new user

```bash
npm run start register mohamed
```

Add a new feed

```bash
npm run start addfeed "lane's blog" "https://blog.boot.dev/index.xml"
```

<img width="1056" height="355" alt="Screenshot from 2025-12-19 17-55-43" src="https://github.com/user-attachments/assets/5fc7fac4-fad7-4734-b4e7-f02951ea03b1" />

Fetch posts and store them

```bash
npm run start agg 1m
```
