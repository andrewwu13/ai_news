# 📰 NewKnew - AI-powered News Scraper % Summarizer
 
## CURRENTLY UNDER DEVELOPMENT

This project fetches the latest AI-related news articles from 
- [VentureBeat](https://venturebeat.com/category/ai/)

It parses the content using a Python web scraper, and displays them in a styled frontend interface. 
## About 

I was recently inspired by my Instagram reels FYP which has been bombarding me with videos on the latest developments in AI. I've been binging content about startup launches, research updates, and funding rounds. So I thought: 
> "All of this is way too much to keep up with, why not build something to keep track for me?"

That's why I'm building **NewKnew** - a personal tool that **scrapes, organizes, and summarizes daily AI tech news** into ultra-condensed insights.


Author: Andrew Wu
- [LinkedIn](https://www.linkedin.com/in/andrew-wu-3a7842241/)  
- [andrewwuca@gmail.com](mailto:andrewwuca@gmail.com)

---
## Features
- Scrapes titles, authors, dates, images, and content from articles
- Summarizes and outputs articles into informative 30-sec reads
- Watchlist for any major headlines, breakthroughs, and rising startups
- Responsive frontend with interactive elements
---
## How to Run
### 1. Install dependencies
```bash
pip install beautifulsoup4 requests schedule 
```
Must be using LiveServer plugin to run
### 2. Start server
```bash
node src/backend/server.js
```
### 3. Open Website
Open hero.html with LiveServer:
> If no articles are intially loaded, please use refresh button on the bottom left

## Notes
- Articles are locally stored within a PostgreSQL db, so there will be no initial articles stored
 

## Plans
- Live update with auto-scheduling
- Pagination
- Integrate OpenAI API to summarize articles
