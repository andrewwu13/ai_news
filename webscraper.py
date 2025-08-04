import requests
from bs4 import BeautifulSoup

url = 'https://venturebeat.com/category/ai/'
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
}
page = requests.get(url, headers=headers)
soup = BeautifulSoup(page.text, 'html.parser')

print(page.status_code)

article_titles = soup.find_all("a", class_='ArticleListing__title-link')
article_info = soup.find_all(class_="ArticleListing__byline")

articles = []
div_avoid = ['post-boilerplate', 'boilerplate-before', 'boilerplate-after']

#Set amount of articles to look for
amount = 3

for art,info in zip(article_titles[:amount], article_info[:amount]):
    href=art.get('href')
    title=art.get_text(strip=True)
    author = info.get_text(strip=True, separator=' | ')

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
        
    content = '\n'.join(p.get_text(strip=True) for p in filtered_paragraphs)

    article_dict = {"title": title,
                    "link": href,
                    "author_date": author,
                    "content": content}
    
    articles.append(article_dict)
    
for article in articles:
    print(f"TITLE: \n{article['title']}\n")
    print(f"{article['content']}\n")
    print("\n----------------------------------\n")

#roughly 2k tokens per article