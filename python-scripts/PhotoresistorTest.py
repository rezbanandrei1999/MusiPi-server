import RPi.GPIO as GPIO
import time
from firebase import firebase

firebase = firebase.FirebaseApplication('https://musipi-default-rtdb.firebaseio.com', None) # get firebase reference
GPIO.setmode(GPIO.BOARD)

resistorPin1 = 11
resistorPin2 = 13

speakersPin1 = 8
speakersPin2 = 10

GPIO.setup(speakersPin1, GPIO.OUT)
GPIO.setup(speakersPin2, GPIO.OUT)

GPIO.output(speakersPin1, GPIO.LOW) # starting the script with the speakers turned off
GPIO.output(speakersPin2, GPIO.LOW)

try:
    while True:
        GPIO.setup(resistorPin1, GPIO.OUT)
        GPIO.setup(resistorPin2, GPIO.OUT)
        GPIO.output(resistorPin1, GPIO.LOW)
        GPIO.output(resistorPin2, GPIO.LOW)
        time.sleep(0.01)
        
        if (firebase.get('/rooms', 1).get('active', None) == True): #if room is active, turn on the speakers, else turn them off
            GPIO.output(speakersPin1, GPIO.HIGH)
        else:
            GPIO.output(speakersPin1, GPIO.LOW)
        if (firebase.get('/rooms', 2).get('active', None) == True):
            GPIO.output(speakersPin2, GPIO.HIGH)
        else:
            GPIO.output(speakersPin2, GPIO.LOW)
            
        GPIO.setup(resistorPin1, GPIO.IN)
        GPIO.setup(resistorPin2, GPIO.IN)
        
        acoperit1 = 0
        acoperit2 = 0
        
        while GPIO.input(resistorPin1) == GPIO.HIGH or GPIO.input(resistorPin2) == GPIO.HIGH:
            if GPIO.input(resistorPin1) == GPIO.HIGH: # if first sensor is covered
                acoperit1 = 1
                if acoperit2 == 1:
                    acoperit1 = 2
            elif GPIO.input(resistorPin2) == GPIO.HIGH: # if second sensor is covered
                acoperit2 = 1
                if acoperit1 == 1:
                    acoperit2 = 2
            else: # if GPIO.input(resistorPin1) == GPIO.HIGH and GPIO.input(resistorPin1) == GPIO.HIGH:
                continue
        if(acoperit1 == 1 and acoperit2 == 2):
            print("Dioda 1 -> Dioda 2")
            noPeople1 = firebase.get('/rooms', 1).get('people', None)
            noPeople1 += 1
            firebase.put('/rooms/1/', 'people', noPeople1) # increase de number of people in that room
            if firebase.get('/rooms', 2).get('active', None) == True:
                GPIO.output(speakersPin2, GPIO.HIGH)
            else:
                GPIO.output(speakersPin2, GPIO.LOW)
            time.sleep(2)
                
        if(acoperit1 == 2 and acoperit2 == 1):
            print("Dioda 2 -> Dioda 1")
            noPeople2 = firebase.get('/rooms', 2).get('people', None)
            noPeople2 += 1
            firebase.put('/rooms/2/', 'people', noPeople2) # increase de number of people in that room
            if (firebase.get('/rooms', 1).get('active', None) == True):
                GPIO.output(speakersPin1, GPIO.HIGH)
            else:
                GPIO.output(speakersPin1, GPIO.LOW)
            time.sleep(2)
        time.sleep(0.1)
 
except KeyboardInterrupt:
    print("Program is done.")
    GPIO.cleanup()
    