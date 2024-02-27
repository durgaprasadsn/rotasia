import requests
import time

url = "http://127.0.0.1:5000/get_user_delegate?date=26/02/2024&name=RABLR0678"

for i in range(100):
    res = requests.get(url)
    print(i, res.text)
    time.sleep(2)
