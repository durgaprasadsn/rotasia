from firebase_admin import db
from firebase_admin import credentials
import firebase_admin

def insert_to_firebase(value):
    databaseURL = 'https://rotasia-tech-default-rtdb.firebaseio.com/'
    cred_obj = credentials.Certificate('./rotasia-tech-firebase-adminsdk-6kzjs-e8b851a764.json')
    default_app = firebase_admin.initialize_app(cred_obj, {'databaseURL': databaseURL})

    ref_users_food = db.reference("/food")
    ref_users_food.update({"food_type": value})

insert_to_firebase("Lunch")