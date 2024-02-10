from flask import Flask, request
from flask_cors import CORS
import datetime
import gspread
from oauth2client.service_account import ServiceAccountCredentials

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)
CORS(app)

# Define the scope and credentials
scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('./linear-facet-242304-699938d565e1.json', scope)

# Authorize the client
client = gspread.authorize(creds)
# Open the Google Sheets spreadsheet by its title
sheet = client.open('Rotasia Testing')

# Access a specific worksheet by its title
data_sheet = sheet.worksheet('Data')
date_sheet = sheet.worksheet('Date')

def column_name_to_index(column_name):
    index = 0
    for char in column_name:
        index = index * 26 + (ord(char) - ord('A') + 1)
    print("Index here:", index)
    return index

location = [['AI', 'AJ', 'AK', 'AL'], ['AM', 'AN', 'AO', 'AP'], ['AQ', 'AR', 'AS', 'AT'], ['AU', 'AV', 'AW', 'AX']]
days = ['Day1', 'Day2', 'Day3', 'Day4']
location_logistics = 'AH'
delegate_column = 'C'

# Route for seeing a data
@app.route('/get_user', methods=['GET'])
def get_user():
    try:
        id = request.args.getlist('name')[0]
        date = request.args.getlist('date')[0]
        dates = date_sheet.col_values(1)
        delegate_id = data_sheet.col_values(column_name_to_index(delegate_column))
        date_index = dates.index(str(date))
        delegate_id_index = delegate_id.index(id) + 1
        print(delegate_id.index(id))
        row_values = data_sheet.row_values(delegate_id_index)
        # print(data_sheet.row_values(delegate_id_index))
        print("success")
        return {
            "success": True,
            "day": days[date_index],
            "response": row_values
            }
    except:
        print("Exception")
        return {
            "success": False,
            "day": "Something went wrong"
            }

@app.route('/update_user', methods=['POST'])
def update_user():
    try:
        id = request.args.getlist('user')[0]
        date = request.args.getlist('date')[0]
        dates = date_sheet.col_values(1)
        delegate_id = data_sheet.col_values(column_name_to_index(delegate_column))
        date_index = dates.index(str(date))
        delegate_id_index = delegate_id.index(id) + 1
        print(delegate_id_index, request.args)
        if 'checkedin' in request.args:
            checkedin_index = column_name_to_index(location[date_index][0])
            print("Checkdin update ", delegate_id_index, checkedin_index)
            data_sheet.update_cell(delegate_id_index, checkedin_index, "Yes")
        if 'logistics' in request.args:
            logistics_index = column_name_to_index(location_logistics)
            print("Checkdin update ", delegate_id_index, logistics_index)
            data_sheet.update_cell(delegate_id_index, logistics_index, "Yes")
        if 'food_type' in request.args:
            food_type = request.args.getlist('food_type')[0]
            if (food_type == 'breakfast'):
                food_index = column_name_to_index(location[date_index][1])
                data_sheet.update_cell(delegate_id_index, food_index, "Yes")
            elif (food_type == 'lunch'):
                food_index = column_name_to_index(location[date_index][2])
                data_sheet.update_cell(delegate_id_index, food_index, "Yes")
            elif (food_type == 'dinner'):
                food_index = column_name_to_index(location[date_index][3])
                data_sheet.update_cell(delegate_id_index, food_index, "Yes")
        return {
            'success': True,
            'response': "Data updated successfully"
        }
    except Exception as e:
        print("Exception")
        return {
            'success': False,
            'response': "Something went wrong"
        }
# Running app
if __name__ == '__main__':
	app.run(debug=True, port=5000)
