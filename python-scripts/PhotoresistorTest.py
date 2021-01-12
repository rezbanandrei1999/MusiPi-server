import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)

resistorPin1 = 11
resistorPin2 = 13

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
        
        while GPIO.input(resistorPin1) == GPIO.LOW or GPIO.input(resistorPin2) == GPIO.LOW:
            if GPIO.input(resistorPin1) == GPIO.LOW:
                count1 += 1
            if GPIO.input(resistorPin2) == GPIO.LOW:
                count2 += 1
        
        print("Fotoresistor1 : ", count1, " - Fotoresistor2 : ", count2)
        time.sleep(0.2)
 
except KeyboardInterrupt:
    print("Program is done.")
    GPIO.cleanup()
    