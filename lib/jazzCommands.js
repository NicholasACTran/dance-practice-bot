const { moves } = require('./jazzMoves.json');
const videoLink = 'https://www.youtube.com/watch?v=jAIwJd2tQo0'

module.exports = {

    jazzMove: () => {
        const move = moves[Math.floor(Math.random() * moves.length)];
        const returnString = `__**Daily Jazz Move**__ \n` +
        `${move} \n\n*Instructions:* Try dancing a full song, or multiple songs, using just ${move} \n` +
        `For more clarification on moves, check out this video: ${videoLink}`;
        return returnString;
    },

    jazzCombo: () => {
        const move1 = moves[Math.floor(Math.random() * moves.length)];
        let move2 = moves[Math.floor(Math.random() * moves.length)];

        while (move2 === move1) {
            move2 = moves[Math.floor(Math.random() * moves.length)];
        }

        const returnString = `__**Jazz Combo**__ \n` +
        `${move1}, ${move2} \n\n*Instructions:* Try dancing a full song, or multiple songs, using just ${move1} and ${move2} \n` +
        `For more clarification on moves, check out this video: ${videoLink}`;

        return returnString;
    }
}