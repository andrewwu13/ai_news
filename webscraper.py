import requests
from bs4 import BeautifulSoup
import lxml
import schedule
import pyautogui
from selenium import webdriver

"""response = requests.get('https://www.geeksforgeeks.org/python/python-programming-language-tutorial/')
soup = BeautifulSoup(response.content, 'html.parser')

content_div = soup.find('div', class_='article--viewer_content')
if content_div:
    for para in content_div.find_all('p'):
        print(para.text.strip())
else:
    print("Article content not found.")
"""

# create webdriver object 
driver = webdriver.Firefox() 

# get google.co.in 
driver.get("https://www.google.com/search?sca_esv=ad5ca00f88d0df3b&sxsrf=AE3TifOeFjycoTW8PW_YRC4dnH0LNw97Cw:1754260474357&q=ai+news&tbm=nws&source=univ&tbo=u&sa=X&ved=2ahUKEwiYt6vD2e-OAxX0lokEHUYUL9IQt8YBKAF6BAgZEAM&biw=1920&bih=968&dpr") 
