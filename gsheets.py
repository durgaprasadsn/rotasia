import gspread
from oauth2client.service_account import ServiceAccountCredentials
import hashlib
import segno
import time

def generate_qr(value, filename):
    qrcode = segno.make_qr(value)
    filename = "./QR/" + filename + ".png"
    qrcode.save(
        filename,
        scale = 80,
        border = 1
        )
    return filename

def hash_string(input_string):
    # Use SHA-256 hashing algorithm
    hash_object = hashlib.sha256(input_string.encode())
    # Take the hexadecimal digest and get the first 16 characters
    hashed_string = hash_object.hexdigest()[:16]
    return hashed_string

def column_name_to_index(column_name):
    index = 0
    for char in column_name:
        index = index * 26 + (ord(char) - ord('A') + 1)
    return index - 1  # Adjust index to be 0-based


# Define the scope and credentials
scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('./linear-facet-242304-699938d565e1.json', scope)

# Authorize the client
client = gspread.authorize(creds)

hashed_id_location = 'AY'
delegate_id_location = 'C'

# Open the Google Sheets spreadsheet by its title
sheet = client.open('Rotasia Testing')

# Access a specific worksheet by its title
worksheet = sheet.worksheet('Data')

nrows = worksheet.row_count
ncols = worksheet.col_count
print(nrows, ncols)
# # Read data from a specific cell
# cell_value = worksheet.cell(1, 1).value
# print("Value in cell A1:", cell_value)

delegate_id_index = column_name_to_index(delegate_id_location) + 1
index_to_be_updated = column_name_to_index(hashed_id_location) + 1

for i in range(2, nrows):
    time.sleep(5)
    delegate_id = worksheet.cell(i, delegate_id_index).value
    hashed_id = hash_string(delegate_id)
    print(delegate_id, hashed_id)

    worksheet.update_cell(i, index_to_be_updated, hashed_id)
    generate_qr(hashed_id, delegate_id)
print("Column index ", column_name_to_index(hashed_id_location))

