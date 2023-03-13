inp = "eajfniPJKzz0UnMY"

inp_bytes = [ ord(i) for i in inp ]

for i in range(len(inp_bytes)):
    if chr(inp_bytes[i]).isupper():
        inp_bytes[i] = ord('A') + (inp_bytes[i] - ord('A') - 23 + 26) % 26
    elif chr(inp_bytes[i]).islower():
        inp_bytes[i] = ord('a') + (inp_bytes[i] - ord('a') - 12 + 26) % 26
    else:
        inp_bytes[i] = ord('0') + (inp_bytes[i] - ord('0') - 6 + 10) % 10

original = inp_bytes.copy()
shuffle = [7, 1, 11, 9, 13, 4, 0, 14, 6, 10, 15, 3, 8, 5, 2, 12]

for i in range(len(shuffle)):
    inp_bytes[shuffle[i]] = original[i]

inp_bytes = "".join(map(chr, inp_bytes))
inp_bytes = inp_bytes.swapcase()
print(inp_bytes)
