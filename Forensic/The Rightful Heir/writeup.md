## The Rightful Heir - Writeup

We have been given an image - key.jpg. On examing its exif, we see a comment that says its passphrase is weak.

This suggests the use of steghide, but we have no idea what the passphrase is. Since it's weak, there's a good chance we can brute force it referring to rockyou.txt .  Use [Stegseek](https://github.com/RickdeJager/stegseek) to achieve this: `stegseek key.jpg rockyou.txt` . (passphrase turns out to be `!!!Jackson`)

The extracted message contains a [pastebin link](https://pastebin.com/Et4fCUEg), which contains the text: `I hａtｅ tｈis flｙiｎｇ ｂⅰrｄ aｐp... Peοpｌe saｙ ｏnｅ thіngｂutyoｕ ａｌｗayｓ gοtta reａd bｅtｗeen thｅliｎeｓ ｔο interpret them right ://` <br>
but displayed as `I hａtｅ tｈis flｙiｎｇ ｂⅰrｄ aｐp... Peοpｌe saｙ ｏnｅ thіngｂutyoｕ ａｌｗayｓ gοtta reａd bｅtｗeen thｅliｎeｓ ｔο interpret them right ://`

A bit of digging around regarding twitter and steganography yields this:  https://holloway.nz/steg/. On decoding the string, we get an [tinyurl link](https://tinyurl.com/4rjfn876) redirecting to [imgur](https://imgur.com/a/R3e58hS) - to obtain a lock.jpg. The lock.jpg seems to resemble key.jpg. 

There's a [link in its description](https://imgur.com/a/D1QwAqn) with the description "In this world, we are either both '1's or both '0's", suggesting the use of the XOR operation.

The flag can be obtained by XORing lock.jpg and key.jpg.
```
convert lock.jpg key.jpg -fx "(((255*u)&(255*(1-v)))|((255*(1-u))&(255*v)))/255" img.jpg
```

The flag is 
```
p_ctf{r3N3G0t1aT3_tH3_4gR33m3Nt}
```
