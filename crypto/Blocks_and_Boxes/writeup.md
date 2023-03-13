# Blocks and Boxes

The question and it's title seem to be pointing towards propagating cipher block chaining ([PCBC](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Propagating_cipher_block_chaining_(PCBC))) mode. We are given 7 space separated blocks as cipher text and a key.

Now, to decrypt using PCBC, one needs reverse of the encryption function and an initialization vector (IV).

Connecting to the netcat service, we get output of the decryption function. The IV is given as hexadecimal value in the question itself.

To decrypt the blocks, they are passed as hex to the nc.

```python
from base64 import b64decode
hex_ct = b64decode(text).decode()
```

XOR-ing these with xor of ct and text of previous block, we get the decrypted plaintext.

```python
from pwn import xor
from base64 import b64decode

encrypted_blocks = ['MTMzODNhNjY2N2JmMjEyYTI1N2U3OGIxMjFlODk0YWE=', 'YWM1MzkzY2M0NDI1MmFlMjM0OGMzNTY3Y2U4OTk5OTU=', 'Yzc5MjdmMzI5YTczMmY3OGM5NzMzOGJiNjM0ZmFiYzU=', 'ZTg4NmU5MGY2NmQxODcxMWI0NDk5MzYwMjE5OGFlZDM=', 'YTEwYjI5MzAyMjk0YmZkZjc2YTdmYzk3MDk4NmMwYjg=', 'MWEyZmY4ZGFiYTY3YjBhZDRjNWJlNDg1MTJhYTk5YTI=', 'YmFmZDllM2ZjYzRkYzUzN2M2MzlhM2IxYzc1OGFjNTY=']
encrypted_blocks = [b64decode(i).decode() for i in encrypted_blocks]
iv = '49766563'
ct = ['39351757210450', '3c393d263fbf6d05247938e921a4bbab', '905296d901323cde35892022d99fa594', 'd08e380c9b75326fd53406ba6552bcd9', 'fabaad274d85bc03880dbb4b75a3bcef', 'bc5805761efca0c2258bbaab6199ddeb', '316dc3dce9539b860e60e2d62681b2e0']
text = []

text.append(xor(bytes.fromhex(ct[0]), bytes.fromhex(iv)))

for val in range(1, len(ct)):
    pt = xor(bytes.fromhex(ct[val]), text[val-1], bytes.fromhex(encrypted_blocks[val-1]))
    text.append(pt)
decrypted_text = "".join(i[:7].decode() for i in text)
```

Using these, we get the plaintext `pCr4hr5_But0rycCpaueot_7_tcrfcsw_7I{0_1c_VPrd70k}`.

It resembles a flag but looks jumbled. It has 49 characters, which is a square number. Since the characters appear jumbled and the count is a square, we try Caesar's box cipher.

```
p _ c t f { P
C B C _ c 0 r
r u p 7 s _ d
4 t a _ w 1 7
h 0 u t _ c 0
r r e c 7 _ k
5 y o r I V }
```

flag: `p_ctf{PCBC_c0rrup7s_d4ta_w17h0ut_c0rrec7_k5yorIV}`
