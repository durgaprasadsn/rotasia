import requests
import time

url = "https://flask-gqwgb9yu9-durgaprasadsns-projects.vercel.app/get_user_delegate?date=26/02/2024&name=RABLR0060"
for i in range(100):
    res = requests.get(url)
    print(i, res.text)
    time.sleep(2)
