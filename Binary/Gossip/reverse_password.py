rows = [4940341, 6375013, 6959992]
cols = [4940138, 6440499, 3499384]

pass_bytes = [0 for i in range(16)]

for i in range(3):
    row = rows[i]

    for j in range(3):
        pass_bytes[3 * i + 2 - j] = row & 0xff
        row //= 0x100

for i in range(3):
    col = 0

    for j in range(3):
        col = col * 0x100 + pass_bytes[i + 3 * j]

    assert(col == cols[i])

shuffle = [1, 0, 3, 6, 5, 2, 4]
numbs = [79, 56, 109, 105, 118, 89, 55]

for i in range(7):
    pass_bytes[9 + i] = numbs[shuffle[i]]

print("".join(map(chr, pass_bytes)))
