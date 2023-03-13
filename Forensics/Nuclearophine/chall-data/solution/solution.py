from scapy.all import *
from pprint import pprint
import os

# Read the pcap file
packets = rdpcap("../../includes/chall.pcap")
audio = bytearray()
zip = bytes()

# Get the respective packets
audio_packets = packets[7:137]
zip_packet = packets[139]

# Load Audio Packet data
for packet in audio_packets:
    audio += packet.load

# Fix Audio data
audio[36:40] = 'data'.encode('utf-8')

# write to file
with open("corrected/audio.wav", "wb") as f:
    f.write(bytes(audio))

# Making encrypted file
with open("corrected/encrypted.zip", "wb") as f:
    f.write(zip_packet.load)

# Extracting first half of password
os.system("yes | stegolsb wavsteg -r -i corrected/audio.wav -o corrected/first_half.txt -n 1 -b 100")


# Extracting second half of password
os.system("yes | unzip -P D65B85C1B657DC2BCD54CB89D7C -: corrected/encrypted.zip -d corrected")
