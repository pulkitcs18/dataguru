# DataGuru marketing site

Static pages for DataGuru, an independent company that prepares sports scores and sports data for professional desks. The site is read-only: no login, no live feed, no checkout, and no backend.

## Open locally

From the repository root:

```bash
python3 -m http.server 8765 --directory sites/dataguru
```

Then open [http://127.0.0.1:8765/](http://127.0.0.1:8765/).

Pages:

- `index.html` — home
- `sports.html` — sports coverage
- `products.html` — data products clients can request
- `how-it-works.html` — email, scope, delivery
- `contact.html` — request form

The request form does not submit to a server. With JavaScript, it shows the composed letter on the page, and a second control opens the visitor's email app. Without JavaScript, the form uses `method="get"` and `action="mailto:hello@dataguru.com"`.

## Contact address

`hello@dataguru.com` is printed in the HTML and set as `CONTACT_EMAIL` in `js/site.js`. Keep those the same.

Newsreader and Outfit are included under the SIL Open Font License. See `fonts/Newsreader-OFL.txt` and `fonts/Outfit-OFL.txt`.
