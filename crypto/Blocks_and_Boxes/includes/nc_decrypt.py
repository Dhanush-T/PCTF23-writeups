import sys
from hashlib import sha256
from Crypto.Util.Padding import unpad
from Crypto.Cipher import AES
from Crypto.Util.number import *

def decrypt(ct, key):
    block_size = AES.block_size
    assert len(ct)==block_size
    cipher = AES.new(key, AES.MODE_ECB)
    pt = cipher.decrypt(ct)
    if pt[-1]<10:
        pt = unpad(pt, block_size)
    return pt

def main(key, ct):
    try:
        p = 115770653180247035084224043056959953464927879539755139306693966328921103598249626044527695935814265151642491380090766196084342116035569518351493697874365720458862422295807069614138627608757466311739637710087540806085774972488821584383163998085838169701510360871263592688194734260871681440432780719664235420343
        q = 93253239885841125780524854326366777697153877837203476569535471446196716666386380033271944752537501845924139826370575497646517355661536525831338566612128712175201038018879339289645302440978152489396530408203396132758140156571885232740411056867599682155397571146016442119057217351662120667759818510706342116981
        n = p*q
        t = (p-1)*(q-1)
        e = 65537
        d = inverse(e, t)
        byte_ct = bytes.fromhex(ct)
        key = int(key)
        if key != d:
            print("Incorrect key")
            exit()
        aes_key = sha256(long_to_bytes(key)).digest()
        ppt = decrypt(byte_ct, aes_key)
        return ppt
    except:
        print("Invalid input")
        exit()


if __name__ == "__main__":
    key = input("Enter key: ")
    for _ in range(7):
        ct = input("Enter ct in hex: ") # in hex format
        p_pt = main(key, ct)
        print(p_pt.hex())
