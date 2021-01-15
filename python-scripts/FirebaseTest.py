import pyrebase


config = {
    "apiKey" : "AIzaSyAIUJlB4DCB_3Wz1iWxXO87465lvVWKIGw",
    "authDomain" : "musipi.firebaseapp.com",
    "databaseURL" : "https://musipi-default-rtdb.firebaseio.com",
    "storageBucket" : "musipi.appspot.com"
}

firebase = pyrebase.initialize_app(config)

database = firebase.database()
name1 = database.child('rooms').child('1').child('name').get().val()
name2 = database.child('rooms').child('2').child('name').get().val()
print('Name 1: ', name1, 'Name 2: ', name2)
