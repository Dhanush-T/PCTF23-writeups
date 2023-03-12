# CustomAESed

## Decrypting ciphertext

Given script has two functions, `data_encoder` and `encryption`. The plaintext is first encoded and then encrypted, So ciphertext has to be first decrypted and then decoded.

### decrypting encryption

The `encryption` function is performing AES encryption with [CTR mode](https://www.ieee802.org/3/efm/public/jul02/p2mp/haran_p2mp_2_0702.pdf). The counter is composed as:

64bit_prefix | 32bit_counter | 32bit_suffix

```python
from Crypto.Util import Counter
from Crypto.Cipher import AES
from Crypto.Util.number import *
from Crypto.Util.Padding import unpad
from hashlib import sha256
from base64 import b64decode

ct = b64decode("FnDcmg7UYwKOGn1ouDH/nxv55SuZ82NdZzh4IZoMs5q0PXEQu0wTJVF3uT2/IkK4ep2P3tFPyWRp+vSm4TOUhVXOn9EouV4BjaqfCHVM0/i8kPcWE2Ek2wziCCYS66XTrZRkS8T+/kRyqx6dEmUAWqyYKrVrCuGOR1hof1W1ApuX0xYVny+oZZFOH7xzsDKoW6sF7L0zv5R3iGBEo2+cSMRi5alzx2PMcPskGvS0edMFNSm0CpRndYnxb96MSF6cPIsqY8y1QngddCFR9xP7PRCYS3q4GExa844l9DJvAn613RSHNzbWuJaDuEjSil9EOuYxP9+vfCRZ2gKm3SEQqgk9F8a11ag4Yg04WLjgHaXjjU29hH1XJAzgAQ7IAtVQpL/2a0hwc3X9ugzyIZN1cC22eq5W8kb3DZMH2nzVFZBNe9+h/eYpSsy8wVOZt8CkV8JTqFt7hN4rL/zuFUTuDqCUhsCC9ELeJYHCYZgYW7r6M5AigTf4xC8ILlYga8kGPeAGjEsckhygJxLNvBy+YzplDDbygmc9gtymPyaX75EKJ/mLOJFdSq/BlMZi6C+1C5xFsCxcJ14zEH8oqWrUFlRj1wVWMvkCLDLvejP5DO42yN0MP5cHP+Fi4n2KF/cREcpIcLog1bvKBHzAyznV6IAfFHDXc2B2UDf9v6fI9k3USGSb/kBpWVjNYrvI05R50KtnLGLRCYYY349c5MjABYJDFXSvlMQNkJQqjcbts3aM0V3tXgMNyWzurahC/ZrUc3Ex2mAFOULtcWqSHHK4gWq5atZ1tpSGTMhhi5h+66AUK+5xFgBcWEB+g0R/a9MBBgS1lsZdA5gud1K91tk1gbrGV32hdUWjIpKsgDRW2cZfg8nM5wsWVjSTc9o7uoTqsAKkONf2EsEn228ih7XTig5DSkXqgT4/ArX4gaEQzB1px9mNSdMZG7pNfbq6/VNLTDnQdcRlB6uGYp99rOk8HjgYXun7hrB6WWcuTkgi0G54MrjPMpMbmTCuPSnWGG+LnmxkhqR6hd1PK26HpEwt62WD10OlKiJ6LilI/5RsQMDnhf4i+Bel7ZeYltIy9M09rKLa2i7+ZjiigUpuCudJNiv7OjxuQSH2YTiY3tHmcPgnQ5ycWUPdwEhT20ElvB3umlbjiI77FkiswUHjI2jXGn7xmOy46MYFBwt6aju2OxSy+fTyzAxIM4olurcWDOBt/0m1Xc3VQrwphr70eTIgGcx7a4MK9WIZciccGkD7tFE8kM6jvnYRi0Ib5W/xuXZkaJT3KVydI05NOUfUOGasxxOw4M3qGM1/nQifCqATrx4znVylUNixhM4WN26gl9XAQXqQewcdDA7/Hnc8aNmcBuSOgZs4gJjE8S9MyngdnZvUrU6owB5gU0O+1ZPKAjP6rq6hmyllHOd2MS9T8jaB0Z+PVnTfo7Y0jmdUeF/fyUZuC/I+EUGRFIQ927pWLYxVj1gMmSLDCFoJ5CYw7WaWnMdTff0nYr+Y3BcQtxAZLB2mXTIlagM9CP+GexkawrdKap5dDGgprG87XwbVOlELR/d/2wHiLHcpm9TRO9o4IZ85UVNLH6H/qk1Kp2vauS1DDNPuV3xsSQxoySIHY7/YJ/z0uoH5CghjFdBNfd+iXcecwxkA7VQVfuW+jcwXGm31NSMzH3oqWo2FcVY3uRIkjoRovBp7wbZwCF7TftCFhMLyfzOgHVe50aXoulTOX3e7j/3exMTSZWE9OgqaxmLKw8V+4ycMB0KcUx69q8I0AoUYkS0ltCp5xqgZmU+Nu6TqQ+0qaXiGGKq9q4YktxUwQoC22i6wStSowU3m1pnbZeUTVI6PdZnFEBd2TTUfEG0SImHOB/xwpxD3etFe4Vmf5vhf0rDHTtBIKAhUXVxUYe6tfQy6HhF6D8cUbWyB6twrbgDZ9XbJtYIy/QoSGi7M8P0QPlWTmeQuo60VHPo2Y3bzprHUedLQLUB6bQrF6UdZ26OD8EkAq9SyLh/QqBWeIM61xE2+mD2lxc/u9/YH8KmQuEre9yrXR58zaYOrCKZCUk8Bz8+BUr1jRqvk+CW1/ALnDpbHfAo/Sn1+Tf7DA5BGudK8scLQxM7bXBGeesaR9bWggxZXbbRqZmJzx5sODhwbh6Qw/nyi/m0Zo51keJPJoWLLaKFKWGmJzrUpHAAzGZO8yaPvi2v993NJJoA2PTg+X9LzMmVY6/OI/eEptBIBL+7wLBRj6ssw1nxrN861jpFK3Tspnb+8w9dnuiO4YZnGqmt9R1D1CfLTnmL3c4R9ENQjsyCfA2ZkZQ55JYHM9cpjcdLTPxE/nhdS8mua8NRlq0C5+aNtvHYyhkDPCLRZy4B5Q7uNMzriZ8MIjpzr9TO+h1vXW6DXOIkFa5gD+8AM0GGM3t8ThPJiePPhEz2JLk3Dcc42/gg1nP129sC7xdt1AbF3MarNEp7CYiRI5LXYrdZ7RzOh3aYRQeMA+ZvKjKCSkw+q3UT3jiBDH15vb9EtZf4/iVgASv+Zf1pYbH6PUTmtVLlj8D0fo3CIigSwWp8TuTRUKL2cxngPYuxomnpMmqhTsDtZwalXNaMqOzkaSQDkkmaTOiPJs4ADxEiYi1cUcYozKLVemE3R5ucV0xmCPsxFldD+gdJqaqpzDnmcyGAA/5AYa53YO6gH9o753TUFu8UtQ6z5Gmkce7SnaSyibrsSa6w79Vkqp7oLILFBv6RI+Uxi9GGJ++y/Dtk9Af0InBcUCuOqB6OBiP5ygyoQ48JXQTJ32ifRtFxkEd+bT9prqE7mLQEoyTAjb+rf0IDtFO2JLez8kMWWczTsnZCZDa2HK0YHWpP3W2KH72cYyju8h1ZEWt0f/RIOKcy6WJfegqF5QyU2C1lyRWwAOXQQ4jpXeTjurEAhBUFuIX/QQa9k4fKfMTzZlfIijL+bxp7iz/V1nJ3ale60zWj8GShP5pI0vi0ZyAmjczTjMUXgMlULzAtAoJd/BehK0mV1ACKnjrqMTDsWzhU=")
iv = ct[:12]
ct = ct[12:]
block_size = AES.block_size
ctr = Counter.new(nbits=32, prefix=iv[:8], suffix=iv[8:], initial_value=1)
key = sha256("128bit_secretkey".encode()).digest()
cipher = AES.new(key, AES.MODE_CTR, counter=ctr)
pt = cipher.decrypt(ct)
pt = unpad(pt, block_size)
print(pt.decode())
```

### decoding data_encoder

The `data_encoder` function is [Hamming code](https://en.wikipedia.org/wiki/Hamming_code#General_algorithm) encoder. We need to decode it and perform error correction if any.

```python
from Crypto.Util.number import *
from math import log2

# pt is same as in above code
bin_text = pt.decode()
txt_len = len(bin_text)
decoded_text = ''
parity_bits = ''
n_parity_bits = int(log2(txt_len))+1
for x in range(n_parity_bits):
    parity_bit = 0
    for bit in range(1, txt_len+1):
        if bit & (2**x) == 2**x:
            parity_bit ^= int(bin_text[bit-1])
    parity_bits = str(parity_bit) + parity_bits
err_pos = int(parity_bits, 2)
if err_pos != 0:
    err_bit = '1' if bin_text[err_pos-1]=='0' else '0'
    bin_text = bin_text[:err_pos-1] + err_bit + bin_text[err_pos:]
x = 0
for bit in range(1, txt_len+1):
    if bit == (2**x):
        x += 1
        continue
    decoded_text += bin_text[bit-1]
decoded_text = long_to_bytes(int(decoded_text, 2))
print(decoded_text.decode())
```

It will give:

> p_ctf{this_is_not_the_flag} ... Use Evariste's help after visiting the colosseum for iv to encrypt the plaintext using same key and iv='gd3fecb6gf15cde8679b6d:e'. Give the authentication code as flag after encoding (base64) it.

Evariste refers to Évariste Galois (and hence the authentication code implies GMAC) and colosseum refers to Caesar (Caesar cipher). So, we have to find the [GMAC](https://en.wikipedia.org/wiki/Galois/Counter_Mode) of the text using given iv but after decoding it.

## getting the GMAC and encoding

GCM mode of AES can be used to encrypt and get the GMAC

The iv is supposed to be 12 bytes long, and we have 24 characters, so it has to be hex after Caesar decoding. On shifting by 1 and 2, we see that only a shift of 1 gives a hex.

```python
from Crypto.Cipher import AES
from Crypto.Util.number import *
from hashlib import sha256
from base64 import b64encode

key = sha256("128bit_secretkey".encode()).digest()
temp_iv = "gd3fecb6gf15cde8679b6d:e"
iv = ""
for i in range(len(temp_iv)):
    iv += chr(ord(temp_iv[i]) - 1)
iv = bytes.fromhex(iv)
cipher = AES.new(key, AES.MODE_GCM, nonce=iv)

# decoded_text is obtained in the above code
ct, tag = cipher.encrypt_and_digest(decoded_text)
encoded_tag = b64encode(tag)
print(encoded_tag.decode())
```

flag: `p_ctf{abJOd6K9aQYOrtl69D79rA==}`
