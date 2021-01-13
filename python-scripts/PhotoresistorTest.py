import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)

resistorPin1 = 11
resistorPin2 = 13

acoperit1 = 0
acoperit2 = 0

try:
    while True:
        GPIO.setup(resistorPin1, GPIO.OUT)
        GPIO.setup(resistorPin2, GPIO.OUT)
        GPIO.output(resistorPin1, GPIO.LOW)
        GPIO.output(resistorPin2, GPIO.LOW)
        time.sleep(0.01)
        
        GPIO.setup(resistorPin1, GPIO.IN)
        GPIO.setup(resistorPin2, GPIO.IN)
        currentTime = time.time()
        count1 = 0
        count2 = 0
        
        
        acoperit1 = 0
        acoperit2 = 0
        
        while GPIO.input(resistorPin1) == GPIO.HIGH or GPIO.input(resistorPin2) == GPIO.HIGH:
            if GPIO.input(resistorPin1) == GPIO.HIGH:
                acoperit1 = 1
                if acoperit2 == 1:
                    acoperit1 = 2
            elif GPIO.input(resistorPin2) == GPIO.HIGH:
                acoperit2 = 1
                if acoperit1 == 1:
                    acoperit2 = 2
            else: # if GPIO.input(resistorPin1) == GPIO.HIGH and GPIO.input(resistorPin1) == GPIO.HIGH:
                continue
                    
        if(acoperit1 == 1 and acoperit2 == 2):
            print("Dioda 1 -> Dioda 2")
        if(acoperit1 == 2 and acoperit2 == 1):
            print("Dioda 2 -> Dioda 1")
        
        # print("Acoperit1 : ", acoperit1, " - Acoperit2 : ", acoperit2, "\n")
        time.sleep(0.1)
 
except KeyboardInterrupt:
    print("Program is done.")
    GPIO.cleanup()
    