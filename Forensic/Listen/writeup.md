# Writeup

We are given a secret.pcap file.

Going through the secret.pcap file.
We find that a Bluetooth Conversation using wireshark.
When we follow it we get this.
So when we analyse the secret.pcap file we find that it is a bluetooth stream.

Filtering the bluetooth packets and with guesswork assuming it as Morse Code.

Writing a script to read the bluetooth packets with k as . and m as - and others as space.
```
#! /bin/python3
from scapy.all import *


packets = rdpcap('./onlyBluetooth.pcapng')
for i in range(0,len(packets),2):
    a=packets[i][5].value
    if(chr(a[2]-4+97)=='k'):
        print(".",end="")
    elif(chr(a[2]-4+97)=='m'):
        print("-",end="")
    else:
        print(" ",end="")

print()
```

We get ```-... .---- ..- ...-- - ----- ----- - .... ..--.- -.-. ....- -. ..--.- -... ...-- ..--.- .---- -. - ...-- .-. -.-. ...-- .--. - ...-- -.. ..--.- .- ... .--- .... ...- -.-. .-.. -.- ..-```


Decoding this Morse Code 

```B1U3T00TH_C4N_B3_1NT3RC3PT3D_ASJHVCLKU```
