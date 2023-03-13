# Quotify

The website seems to generate quotes on clicking the `get quote` button. Inspecting the source code, we see that it actually calls a `callback` function to get the quote from the server using a `JSONP` route.

![jsonp image](./images/Screenshot%20from%202023-03-01%2001-06-21.png)

Trying different values of `feedback` and `id`, we see that some restrictions are applied on feedback.

The question also gives the `source code` of the admin page, from which we see how our `feeback `and `quote_id` is displayed to the admin.
```html
<body>
    <!-- Get user feedback and quote_id from server and display it here for admin -->
    <div class="feedback"></div> <!-- const clean = purify.sanitize(feedback, {FORBID_TAGS: ['math']) -->
    <div class="quote_id"></div>
</body>
```

The source code of the admin page also shows us that to get the `flag`, we need to call the function `sus` and set `document.cookie.has_flag == true` and
`FRUITS.bananas == true`.
```js
window.FRUITS = window.FRUITS || {
        bananas: false,
        apples: false,
        oranges: false
    } 
    
    function sus(info){
        if(document.cookie.has_flag){
            console.log("Hmmmmm");  
            if(FRUITS.bananas) {
                console.log("Got flag woohooo. Pretty simple right?");
            }
        }
    }
```


We can achieve this by exploiting `JSONP` vulnerability, `mXSS` and `DOM Clobbering`.

Let the challenge URL be `{URL}`

First, we can call the function `sus` by passing `quote_id` as `1?callback=sus#` which will load the script with `src = '{URL}/quotes/1?callback=sus#?callback=formatQuote'`, making the part of the url after the `#` useless, hence calling `sus` function with arguments as json object of a `quote`.

Next we can put the following payload to exploit the `DOM Clobbering` and `mXSS` vulnerability.
 ```html
    <form name="cookie"> 
    <input id="has_flag">
    <a name="bananas" id="FRUITS">
    <p>
    <a>
```
Thus, we get the flag `p_ctf{mx55_w17h_d0m_cl08ber1n6_i5_wi1d}`
