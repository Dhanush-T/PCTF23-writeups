# Compromised

This challenge is a subgroup confinement attack on Diffie-Hellman. ([Explanation](https://crypto.stackexchange.com/questions/27584/small-subgroup-confinement-attack-on-diffie-hellman))

There is a script given which runs at the server. On analyzing the script, it can be seen that one is supposed to enter the value of `k` in hexadecial format and they will get the flag encrypted with AES using the hash of shared secret.

The factors can be obtained from [factodb](http://factordb.com).

```python
from hashlib import sha256
from Crypto.Cipher import AES
from Crypto.Util.number import long_to_bytes
from Crypto.Util.Padding import unpad


p = 143631585913210514235039010914091901837885309376633126253342809551771176885137171094877459999188913342142748419620501172236669295062606053914284568348811271223549440680905140640909882790482660545326407684050654315851945053611416821020364550956522567974906505478346737880716863798325607222759444397302795988689
g = 65537
prime_fac = [2, 4335281, 2070678721765822593665771188103088096219791020706517153290392386787776514445331961971978575310183373092521978673650294701725639224173214693498019049238262629682329713473376071829454117139158057824371818171224862872959461186186904911993659565500520150465830609918173958630318077973573212768091681907453]
w = prime_fac[1]
k = (p-1)//w

# the ciphertext given by server
ct = bytes.fromhex('0123456789abcdef')
iv = ct[:AES.block_size]
ct = ct[AES.block_size:]

# generator for subgroup
sub_gen = pow(g, k, p)
m = 1
while m <= w:
    key = pow(sub_gen, m, p)
    key = sha256(long_to_bytes(key)).digest()
    print('Key:', key.hex(), end='\r')
    aes = AES.new(key, AES.MODE_CBC, iv)
    try:
        flag = aes.decrypt(ct)
        flag = unpad(flag, AES.block_size).decode()
        if flag.startswith('p_ctf{'):
            break
    except ValueError:
        pass
    finally:
        m += 1

print('Key:', key.hex())
print('Flag:', flag)
```

flag : `p_ctf{7hi5_1s_su86r0up_6on51nem3n7_a774ck_on_DH}`
