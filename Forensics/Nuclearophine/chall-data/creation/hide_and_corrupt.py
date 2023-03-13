import os

os.system("stegolsb wavsteg -h -i sussy.wav -s ../flags/first_half.txt -o hidden_sussy.wav -n 1")

with open("hidden_sussy.wav", "rb") as f:
    x = f.read()
    a = bytearray(x)
    a[36:40] = 'nooo'.encode('utf-8')
    # a[40:44] = bytes.fromhex('{:08x}'.format(new_size))

# D65B85C1B657DC2
os.system("cp ../flags/second_half.txt . && zip -P D65B85C1B657DC2BCD54CB89D7C encrypted.zip second_half.txt && rm second_half.txt")

with open("corrupted_hidden_sussy.wav", "wb") as f:
    f.write(bytes(a))