# Pages of Turmoil

The question hints to some kind of password existing in the `/pass` route.
When we try to navigate to it, it says that only the bot is allowed here.
> Only bot is allowed here not you! 

The `/bot` allows us to give a url, on providing which, we get a screenshot of a part of the page. Now, if we take a screenshot of the `/pass` route, we just see some lorem ipsum text. We must also realise that, by analysing the requests that the bot makes by making it take a screenshot of a website that we control (like [webhooks](https://webhook.site/)), it uses headless-chrome.

 Now, using Chrome's [Text Fragments](https://developer.mozilla.org/en-US/docs/Web/Text_fragments), we can take a screenshot of the  route, `/pass#:~:text=password` and we will get the password `dfjhasdklfjhakbdjfbljas`. 
 
 ![password image](./images/Screenshot%20from%202023-03-01%2000-44-02.png)

Using the password to login, we will be redirected to the homepage where we will see a list of books and nothing really interesting.
On going to the search route and searching for a book that already exists, we can see that the `ObjectId` of the book is returned along with the name, author and description.

Checking out the [ObjectId Documentation](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) and seeing the question, we can understand that we need to increase the 4 byte timestamp (in hex)
by 60 and increase the 3 byte code by 1 (again in hex), from the last public book that was inserted.

Hence, on finding the new ObjectId, we can intercept the search request with Burp and search by `_id` parameter and put our ObjectId as `value` and we will get the flag `p_ctf{m0n90_1D5_4r3_n1c3_t00_r16h7}`.
