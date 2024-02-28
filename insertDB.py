from firebase_admin import db
from firebase_admin import credentials
import firebase_admin
import csv

def insert_to_firebase(user, hash_map, index):
    if (index == 0):
        databaseURL = 'https://rotasia-tech-default-rtdb.firebaseio.com/'
        cred_obj = credentials.Certificate('./rotasia-tech-firebase-adminsdk-6kzjs-e8b851a764.json')
        default_app = firebase_admin.initialize_app(cred_obj, {'databaseURL': databaseURL})
        ref_users_date = db.reference("/date")
        date = {'28-02-2024': 'Day1', '29-02-2024': 'Day2', '01-03-2024': 'Day3', '02-03-2024': 'Day4'}
        ref_users_date.update(date)

        ref_users_food = db.reference("/food")
        ref_users_food.update({"food_type": "Breakfast"})
    print(user)
    ref_users = db.reference("/delegates")
    ref_users.update(user)
    ref_users_map = db.reference("/map")
    ref_users_map.update(hash_map)

# def map_hash_id(user, index):
#     if (index == 0):
#         databaseURL = 'https://rotasia-tech-default-rtdb.firebaseio.com/'
#         cred_obj = credentials.Certificate('./rotasia-tech-firebase-adminsdk-6kzjs-e8b851a764.json')
#         default_app = firebase_admin.initialize_app(cred_obj, {'databaseURL': databaseURL})
#     else:
#         ref_users = db.reference("/map")
#         ref_users.update(user)


i = 0

with open('Rotasia App.csv', mode ='r') as file:    
    csvFile = csv.DictReader(file)
    for lines in csvFile:
        create_val = {lines['Delegate ID']: {'tshirt': lines['T-Shirt Size'], 'district': lines['RI District'], 'name': lines['Full Name'], 'room_details': {'roomNo': lines['Room No.'], 'accomodationName': lines['Accommodation Name'], 'accomodationLocation': lines['Accommodation Location']}, 'logistics': {'IDCard': 'No', 'GenericKit': 'No', 'Caricature': 'No', 'T-Shirt (' + lines['T-Shirt Size'] + ')': 'No'}, 'Day1': {'Checkedin': 'No', 'Breakfast': 'No', 'Lunch': 'No', 'HighTea': 'No', 'Dinner': 'No'}, 'Day2': {'Checkedin': 'No', 'Breakfast': 'No', 'Lunch': 'No', 'HighTea': 'No', 'Dinner': 'No'}, 'Day3': {'Checkedin': 'No', 'Breakfast': 'No', 'Lunch': 'No', 'HighTea': 'No', 'Dinner': 'No'}, 'Day4': {'Checkedin': 'No', 'Breakfast': 'No', 'Lunch': 'No', 'HighTea': 'No', 'Dinner': 'No'}}}
        hash_map = {lines['QR Code Content']: lines['Delegate ID']}
        print(lines['Delegate ID'], i)
        insert_to_firebase(create_val, hash_map, i)
        # map_hash_id(hash_map, i)
        i += 1