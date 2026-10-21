# Toddler Games

Simple, big-button games for toddlers. Works in any modern browser on PC, Android and iPhone/iPad.
There's no build step: it's plain HTML, CSS and JavaScript.

## Games

- **Animals**: scroll through farm and zoo animals. Tap an animal once to hear its name, and tap it again to hear the sound it makes.
- **Colors**: big color tiles. Tap a tile once to hear the color name. Tap it again to see something of that color and hear it named, such as "red apple" or "blue whale".
- **Numbers**: number tiles from 1 to 10. Tap a tile once to hear the number. Tap it again to see that many pictures appear one by one while they are counted aloud ("one, two, three... three ducks!").

## Run locally

Any static file server works, for example:

```sh
python -m http.server 8000
```

Then open http://localhost:8000.

## Add an animal

1. Add a picture as `images/<name>.svg`.
2. Add a sound as `sounds/<name>.mp3`. Use MP3 because it plays on every device, including iPhone.
3. Add `<name>` to the `ANIMALS` list in `app.js`.
4. Add the attribution to `CREDITS.md`.

## On a phone

Open the site and use **Add to Home Screen** (Safari share menu on iPhone, or the ⋮ menu in Chrome on Android).
The games then open full-screen like an app.

Tip: if you hear nothing on an iPhone, check the volume and the ring/silent switch.

See [CREDITS.md](CREDITS.md) for picture and sound licenses.
