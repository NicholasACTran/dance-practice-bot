require('dotenv').config(); //initialize dotenv

const { 
    Client, 
    ThreadAutoArchiveDuration,
} = require('discord.js');
const cron = require('cron');
const dayjs = require('dayjs');

const Cache = require('./lib/cache.js');
const { jazzMove, jazzCombo } = require('./lib/jazzCommands');
const { musicTopic } = require('./lib/musicTopics.js');

const token = process.env.CLIENT_TOKEN;
const practiceChannelId = process.env.PRACTICECHANNEL;
const musicChannelId = process.env.MUSICCHANNEL;

let cache;

const client = new Client({
    intents: []
}); //create new client

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    cache = new Cache();

    // Cron job for 20:00 every Wednesday
    // Creates thread in practice channel
    const scheduledWeeklyPracticeThread = new cron.CronJob('00 20 * * WED', async () => {
        const channel = await client.channels.fetch(practiceChannelId);
        const date = dayjs().format('YYYY-MM-DD');
        
        const thread = await channel.threads.create({
            name: `Wednesday Weekly Whatcha Working On? ${date}`,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            reason: "Keep yourself accountable"
        }).catch(console.error);

        await thread.send("Share whatcha've been working on! <a:ablobwobwork:1002344417040015421>");
        await thread.send(jazzCombo());
    });

    scheduledWeeklyPracticeThread.start();

    // Cron job for 20:00 every Monday
    // Creates thread in music channel
    const scheduleWeeklyMusicThread = new cron.CronJob('00 20 * * MON', async () => {
        const channel = await client.channels.fetch(musicChannelId);

        const res = musicTopic();
        
        let topic = res.type === 'artist' ? res.artist : res.song;
        let message = res.type === 'artist' ? `What's your favourite song from ${topic}?` : `What's your favourite version of ${topic}?`;
        message = message + ` Mine is ${res.songLink}`;
        
        const thread = await channel.threads.create({
            name: `Music Share Monday: ${topic}`,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            reason: "Learn and Share New Music"
        }).catch(console.error);

        await thread.send(message);
    });

    scheduleWeeklyMusicThread.start();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'dailyjazzmove') {
        const date = dayjs().format('YYYY-MM-DD');
        const jazzCache = cache.getCache().dailyJazz;
        
        if (jazzCache.hasOwnProperty(date)) {
            await interaction.reply(jazzCache[date]);
        } else {
            const move = jazzMove();
            cache.writeDailyJazz(date, move);
            await interaction.reply(move);
        }
    } else if (commandName === 'jazzcombo') {
        const date = dayjs().format('YYYY-MM-DD');
        const comboCache = cache.getCache().jazzCombo;
        
        if (comboCache.hasOwnProperty(date)) {
            await interaction.reply(comboCache[date]);
        } else {
            const combo = jazzCombo();
            cache.writeJazzCombo(date, combo);
            await interaction.reply(combo);
        }
    } else if (commandName === 'adminmusicmonday') {
        const channel = await client.channels.fetch(musicChannelId);

        const res = musicTopic();
        
        let topic = res.type === 'artist' ? res.artist : res.song;
        let message = res.type === 'artist' ? `What's your favourite song from ${topic}?` : `What's your favourite version of ${topic}?`;
        message = message + ` Mine is ${res.songLink}`;
        
        const thread = await channel.threads.create({
            name: `Music Share Monday: ${topic}`,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            reason: "Learn and Share New Music"
        }).catch(console.error);

        await thread.send(message);
    }
})

//make sure this line is the last line
client.login(token); //login bot using token