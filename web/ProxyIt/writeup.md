# Proxy It

1) Go to `sitemap.xml` and check all of the links. Among those, the route `/YXR0ZW5kYW5jZVNoZWV0` will contain the first half of the flag `p_ctf{w0rk1ng_0n_`.

2) When you look at the landing page, you will be asked to look at the `/flag` route, but access to it will be forbidden.

3) To bypass this, we will be using `Request Smuggling` attack.

4) Let the challenge URL be `{URL}`, Instead of using `{URL}/flag`, we can use


```
{URL}/%0d%0a/../flag
```

to bypass the proxy and hence get the second half of the flag `Pr0xy_1$_d1ff1c8lt}`.

```
Flag - p_ctf{w0rk1ng_0n_Pr0xy_1$_d1ff1c8lt}
```