# Toddler Games

Simple, big-button games for toddlers. Works in any modern browser on PC, Android and iPhone/iPad.
There's no build step: it's plain HTML, CSS and JavaScript.

## Games

- **Animals**: scroll through farm and zoo animals. Tap an animal once to hear its name, and tap it again to hear the sound it makes.
- **Colors**: big color tiles. Tap a tile once to hear the color name. Tap it again to see something of that color and hear it named, such as "red apple" or "blue whale".
- **Numbers**: number tiles from 1 to 10. Tap a tile once to hear the number. Tap it again to see that many pictures appear one by one while they are counted aloud ("one, two, three... three ducks!").
- **Shapes**: circle, square, triangle, star, heart and more. Tap once to hear the shape. Tap again to see a real thing with that shape ("Pizza is a triangle!").
- **Fruits & Food**: tap once to hear the name. Tap again to take a bite, with a munching sound and "Yum yum!".
- **Vehicles**: tap once to hear the name. Tap again to hear the real sound: horns, sirens, engines, a bicycle bell.
- **My Body**: eyes, ears, nose, mouth, hands, feet and more. Tap once to hear the name. Tap again to hear what it does ("I see with my eyes!").
- **Music**: tap once to hear the instrument's name. Tap again to hear it play.

## Run locally

Any static file server works, for example:

```sh
python -m http.server 8000
```

Then open http://localhost:8000.

## Add an animal, vehicle or instrument

1. Add a picture as `images/<name>.svg`.
2. Add a sound as `sounds/<name>.mp3`. Use MP3 because it plays on every device, including iPhone.
3. Add `["<name>", "<tile color>"]` to the `ANIMALS`, `VEHICLES` or `INSTRUMENTS` list in `app.js`.
4. Add the attribution to `CREDITS.md`.

## Add a game

Add an entry to the `GAMES` list at the bottom of `app.js`. Its home card and screen are created automatically.

## On a phone

Open the site and use **Add to Home Screen** (Safari share menu on iPhone, or the ⋮ menu in Chrome on Android).
The games then open full-screen like an app.

Tip: if you hear nothing on an iPhone, check the volume and the ring/silent switch.

See [CREDITS.md](CREDITS.md) for picture and sound licenses.
