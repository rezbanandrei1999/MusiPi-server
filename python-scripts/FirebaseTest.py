import pyrebase
from firebase import firebase

config = {
    "apiKey" : "AIzaSyAIUJlB4DCB_3Wz1iWxXO87465lvVWKIGw",
    "authDomain" : "musipi.firebaseapp.com",
    "databaseURL" : "https://musipi-default-rtdb.firebaseio.com",
    "storageBucket" : "musipi.appspot.com"
}

firebase = pyrebase.initialize_app(config)