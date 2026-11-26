# Luxury Christian Wedding Invitation

A complete, responsive, cinematic wedding invitation website built with HTML5, CSS3 and vanilla JavaScript.

## Preview

Open `index.html` directly in a browser, or run a local server:

```powershell
cd wedding-invitation
python -m http.server 5500
```

Then visit `http://localhost:5500`.

## Personalization

Edit the `wedding` configuration near the top of `js/script.js`:

- `groom`
- `bride`
- `dateLabel`
- `dateTime` — use ISO format, for example `2027-06-12T14:00:00`

Edit the `RSVP_CONFIG.whatsappRecipients` array in `js/script.js` to update the two WhatsApp recipient names and international-format phone numbers. After validating the form, guests choose which contact to open; they must press Send in WhatsApp to deliver the RSVP.

Names and wedding details can also be replaced throughout `index.html`. The following placeholders remain where specific information was not supplied:

- `[GROOM'S NAME]`
- `[BRIDE'S NAME]`
- `[WEDDING DATE]`
- `[CEREMONY TIME]`
- `[CHURCH NAME]`
- `[FULL CHURCH ADDRESS]`
- `[RECEPTION TIME]`
- `[RECEPTION VENUE]`
- `[FULL VENUE ADDRESS]`
- `[DRESS CODE]`
- `[SPECIAL INSTRUCTIONS]`
- `[GOOGLE_MAPS_URL]`

## Image assets

Actual photographs from the supplied shoot are already mapped under `assets/images`:

- `hero-section.jpg`
- `story-meeting.jpg`
- `story-beginning.jpg`
- `story-journey.jpg`
- `story-forever.jpg`
- `gallery-01.jpg` through `gallery-07.jpg`
- `closing.jpg`

Replace each file using the same filename to update the website without changing the HTML.

Add the couple's wedding music to `assets/music/background-music.mp3`.
