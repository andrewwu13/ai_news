import requests
from bs4 import BeautifulSoup
import schedule
import time
import json

#roughly 2k tokens per article


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

    articles = []
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
            
        content = '\n'.join(p.get_text(seperators=' ', strip=True) for p in filtered_paragraphs)

        article_dict = {"title": title,
                        "link": href,
                        "author": author,
                        "date": date,
                        "img": img,
                        "content": content}
        
        articles.append(article_dict)

    for article in articles:
        print(f"TITLE: \n{article['title']}")
        print(f"AUTHOR: \n{article['author']}")
        print(f"DATE: \n{article['date']}")
        print(f"img: \n{article['img']}\n")
        print(f"{article['content']}\n")
        print("\n----------------------------------\n")
    
    #schedule.every().day.at("09:00").do(run_scraper_vb('https://venturebeat.com/category/ai/', 5))

    return articles


### Scheduled scrape everyday
"""
try:
    while True: 
        schedule.run_pending()
        time.sleep(1)
except KeyboardInterrupt:
    print('\nScraper stopped.\n')"""

articles = run_scraper_vb('https://venturebeat.com/category/ai/', 5)


with open("articles.json", "w", encoding="utf-8") as f:
    json.dump(articles, f, ensure_ascii=False, indent=2)
