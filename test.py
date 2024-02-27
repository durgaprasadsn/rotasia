import requests
import time

url = "https://flask-d78134906-durgaprasadsns-projects.vercel.app/get_user_delegate?date=26/02/2024&name=RABLR0068"
for i in range(100):
    res = requests.get(url)
    print(i, res.text)
    time.sleep(2)
