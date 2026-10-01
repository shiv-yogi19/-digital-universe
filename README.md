# Shiv Yogi · Digital Universe

A static personal site: live canvas wallpaper, animated intro, rotating messages and glass social buttons.
No backend, no build step, no npm. Works on GitHub Pages.

## Structure
```
shiv-yogi-digital-universe/
├── index.html
├── css/style.css
├── js/config.js     <- edit this one
├── js/messages.js   <- welcome + home messages
├── js/engines.js    <- wallpaper, text, button, transition, UI, sound engines
├── js/main.js       <- wires everything together
└── README.md
```

## Upload to GitHub
1. Create a new repository on github.com (public).
2. Click **Add file → Upload files** and drag in `index.html`, `css`, `js` and `README.md`. Keep the folders.
3. Click **Commit changes**.

## Enable GitHub Pages
1. Repository **Settings → Pages**.
2. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
3. After about a minute your site is at `https://USERNAME.github.io/REPOSITORY/`.

## Everything you edit is in `js/config.js`
- **Name / subtitle / avatar / footer:** `SITE_CONFIG` (`name`, `subtitle`, `avatar`, `footer`).
- **Social links:** `SOCIAL_LINKS`. Paste a URL between the quotes.
- **Show a button:** add its name to `ACTIVE_BUTTONS` (for example `"youtube"`) and put a URL in `SOCIAL_LINKS`.
- **Hide a button:** delete its name from `ACTIVE_BUTTONS`. It disappears completely.
- **Animation intensity:** `animationIntensity` = `"low"`, `"medium"`, `"high"` or `"ultra"`. `animationEnabled: false` turns animations off.
- **Wallpaper:** `wallpaperEnabled` (true/false) and `wallpaperIntensity` (`"low"`, `"medium"`, `"high"`).
- **Sound:** off by default. The Sound button starts a soft generated tone only after a tap.
- **Colours:** `colors` in `SITE_CONFIG`.
- **Messages:** add lines to `js/messages.js`.

Visitors with "reduce motion" turned on get a calm version automatically.
