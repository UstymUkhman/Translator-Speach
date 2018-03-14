#!/usr/bin/python

import serial
import struct
import cgi

data = cgi.FieldStorage()
print data

# need to change here the path to serial interface
ard = serial.Serial('/dev/tty.usbserial-DN01DN2M')
print(ard.readline())

# eg: http://localhost:8000/cgi-bin/setup-arduino.py?pin=12,8&action=1
# we need to pass in pin the number of which pin we want to active

# then, we iterate on the value splitted by ',' and we send the signal to arduino
#for pin in data['pin'].value.split(','):
#	ard.write(struct.pack('bb', int(data['action'].value), int(pin)))
#	print(ard.readline())

pins = data['pin'].value.split(',')
# ard.write(struct.pack('>3B', 0, 0, 0))
ard.write(struct.pack('>3B', int(pins[0]), int(pins[1]), int(pins[2])))
print ard.readline()

ard.close()
