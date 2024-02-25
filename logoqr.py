import segno
from PIL import Image

URL = 'text'
LOGO = './src/splash.png'
# OUTPUT = 'qrcode.png'

# Make QR code

def generate_qr(value, filename):
    qrcode = segno.make_qr(value)
    filename = filename + ".png"
    qrcode.save(
        filename,
        scale = 80,
        border = 1
        )
    img = Image.open(filename).convert("RGBA")

    width, height = img.size
    print(width, height)
    logo_size = 250

    # Open the logo image
    logo = Image.open(LOGO).convert("RGBA")

    # Calculate xmin, ymin, xmax, ymax to put the logo
    xmin = ymin = int((width / 2) - (logo_size / 2))
    xmax = ymax = int((width / 2) + (logo_size / 2))

    # resize the logo as calculated
    logo = logo.resize((xmax - xmin, ymax - ymin))

    # put the logo in the qr code
    img.paste(logo, (xmin, ymin, xmax, ymax))

    #img.show()
    img.save(filename)
    return filename



# qr = segno.make_qr(URL, error='H')
# qr.save(OUTPUT, finder_dark='#df2037', scale=100)

# # Now open that png image to put the logo
# img = Image.open(OUTPUT).convert("RGBA")

# width, height = img.size

# # How big the logo we want to put in the qr code png
# logo_size = 1100

# # Open the logo image
# logo = Image.open(LOGO).convert("RGBA")

# # Calculate xmin, ymin, xmax, ymax to put the logo
# xmin = ymin = int((width / 2) - (logo_size / 2))
# xmax = ymax = int((width / 2) + (logo_size / 2))

# # resize the logo as calculated
# logo = logo.resize((xmax - xmin, ymax - ymin))

# # put the logo in the qr code
# img.paste(logo, (xmin, ymin, xmax, ymax))

# #img.show()
# img.save(OUTPUT)
generate_qr("Durga", "durga")