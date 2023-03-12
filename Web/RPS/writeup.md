# RPS

From the question, we infer that we need to login as admin to get the flag.

Logging in as guest and going through all the routes, the ones that will most probably catch your eye are the `Change Username` and `Change Email` routes as they are plain input fields, a prime prey to XSS.

Given that the admin checks the `leaderboard` every minute and the only things in the leaderboard page are `usernames` and `scores`, we can think of putting ourselves on the leaderboard and then changing our `username` to a payload in order to execute XSS.

We see that in the `/pass` route, on sending a simple `POST` request, sends the password to our email.

We also notice that the `/email` route, again with a simple `POST` request, changes our email.

Let the challenge URL be `{URL}`

Hence, we can think of getting to the leaderboard by winning against the computer a few consecutive times and changing our username to a crafty payload like  
`"<script> const xhr = new XMLHttpRequest(); xhr.open('POST', '{URL}/email');xhr.setRequestHeader('Content-Type', 'application/json');xhr.send(JSON.stringify({email: "your_email_here"})); </script>"`

Now, the admin's email will be our email. Now, we can send another payload, but this time we send it to the `/pass` route inorder to get the admin password.
`"<script> const xhr = new XMLHttpRequest(); xhr.open('POST', '{URL}/pass');xhr.send()</script>"`

And Voila! You will have the `admin password`, which is `E05kGsVPZjtG1m4dhjshfda`, sent to your email, logging in with which, you will get the flag,

```
p_ctf{X5S_g0e5_w3l1_wit2_rp5}
```
