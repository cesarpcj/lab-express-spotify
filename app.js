require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const path = require("path");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// require spotify-web-api-node package here:
const spotifyWebAPI = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

// setting the spotify-api goes here:
const spotifyApi = new spotifyWebAPI({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: "http://www.example.com/callback",
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      const result = data.body.artists.items;
      res.render("artist-search-results", { result });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
});

app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      const result = data.body;
      res.render("albums", { results: result.items });
    })
    .catch((err) => console.log("The error while searching albuns occurred: ", err));
});

app.get("/tracks/:id", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then((data) => {
      const result = data.body;
      console.log("The received data from the API: ", { results: result.items });

      res.render("album", { results: result.items });
    })
    .catch((err) => console.log("The error while searching album tracks: ", err));
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
