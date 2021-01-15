from firebase import firebase

firebase = firebase.FirebaseApplication('https://musipi-default-rtdb.firebaseio.com', None) # get firebase reference

name1 = firebase.get('/rooms', 1).get('name', None)
name2 = firebase.get('/rooms', 2).get('name', None)
print('Name 1: ', name1, 'Name 2: ', name2)
