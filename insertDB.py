from firebase_admin import db
from firebase_admin import credentials
import firebase_admin

def insert_to_firebase():
    databaseURL = 'https://rotasia-default-rtdb.firebaseio.com/'
    cred_obj = credentials.Certificate('./dta3191-bc03e-firebase-adminsdk-emm8x-e4527853d4.json')
    default_app = firebase_admin.initialize_app(cred_obj, {'databaseURL': databaseURL})
    ref_users = db.reference("/delegates")

    user = {"UMANG_692" : {"name": "Durga", "food": {"breakfast": "No", "lunch":"No", "dinner":"No"}, "checkedin": "No"}, "UMANG_796" : {"name": "Chintu", "food": {"breakfast": "No", "lunch":"No", "dinner":"No"}, "checkedin": "No"}}
    ref_users.update(user)

insert_to_firebase()