const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('./music_library.txt'),
    output: process.stdout,
    terminal: false
});

let type;
const artists = [];
const songs = [];
const output = {
    topics: []
};

file.on('line', (line) => {
    if (line == 'ARTISTS') {
        type = 'artists';
    } else if (line == 'SONGS') {
        type = 'songs';
    } else {
        if (type == 'artists') artists.push(line);
        else songs.push(line);
    }
});

file.on('close', () => {
    shuffle(artists);
    shuffle(songs);
    for (let i = 0; i < artists.length; i++) {
        output.topics.push({
            type: 'artist',
            artist: artists[i],
            songLink: ''
        });

        output.topics.push({
            type: 'song',
            song: songs[i],
            songLink: ''
        });
    }

    fs.writeFileSync('../lib/music.json', JSON.stringify(output, null, "\t"));
});

function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }