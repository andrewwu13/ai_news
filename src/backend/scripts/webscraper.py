import requests
from bs4 import BeautifulSoup
import schedule
import time
import json
import psycopg2
from datetime import datetime
from dotenv import load_dotenv
import os

#roughly 2k tokens per article

#load environment variables
load_dotenv() 

db_password = os.getenv("db_password")

#Connect to PostgreSQL
conn = psycopg2.connect(
    dbname="ai_news",
    user="andrewwu",
    password=db_password,
    host="127.0.0.1",
    port="5432"
)
cur = conn.cursor()


def run_scraper_vb(url, amount):
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.text, 'html.parser')

    print(page.status_code)

    article_titles = soup.find_all("a", class_='ArticleListing__title-link')
    article_info = soup.find_all(class_="ArticleListing__byline")
    article_img = soup.find_all(class_="ArticleListing__image wp-post-image")

    div_avoid = ['post-boilerplate', 'boilerplate-before', 'boilerplate-after']

    for art,info,im in zip(article_titles[:amount], article_info[:amount], article_img[:amount]):
        href = art.get('href')
        title = art.get_text(strip=True)
        author_date = info.get_text(strip=True, separator=' | ')
        #Seperate author and date
        for i in range(len(author_date)-3): 
            if author_date[i:i+3] == " | ":
                author = author_date[:i]
                date = author_date[i+3:]  
        img = im.get('src')

        article_page = requests.get(href, headers=headers)
        article_soup = BeautifulSoup(article_page.text, 'html.parser')
        main_content_soup = article_soup.find('div', class_='article-content')
        
        if main_content_soup:
            paragraphs = main_content_soup.find_all('p')
        else:
            print("Content not found. Skipping...")
            continue

        #remove unwanted elements
        filtered_paragraphs = []
        for p in paragraphs:
            if not any(
                parent.name == 'div' and any(
                    avoid in cls for cls in (parent.get('class') or []) for avoid in div_avoid
                ) for parent in p.parents):
                filtered_paragraphs.append(p)
            
        content = '\n'.join(p.get_text(separator=' ', strip=True) for p in filtered_paragraphs)

        #insert into database
        cur.execute("SELECT id FROM articles WHERE url = %s", (href,))
        if cur.fetchone():
            print(f"skipping duplicate: {title}")
            continue

        cur.execute("""
            INSERT INTO articles (title, summary, url, image_url, category, date_published, author)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            title,
            content, #store full text in summary for now
            href,
            img,
            'AI', #static for now
            date,
            author
        ))
        print(f"Inserted article: {title}")

    conn.commit()
    print("Database updated with new articles")


### Scheduled scrape everyday
"""
try:
    while True: 
        schedule.run_pending()
        time.sleep(1)
except KeyboardInterrupt:
    print('\nScraper stopped.\n')"""

run_scraper_vb('https://venturebeat.com/category/ai/', 5)

cur.close()
conn.close()