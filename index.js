require('dotenv').config(); //initialize dotenv

const { 
    Client, 
    ThreadAutoArchiveDuration,
} = require('discord.js');
const cron = require('cron');
const moment = require('moment');

const Cache = require('./lib/cache.js');
const jazzCommands = require('./lib/jazzCommands');

const token = process.env.CLIENT_TOKEN;
const channelId = process.env.TESTCHANNEL;

let cache;

const client = new Client({
    intents: []
}); //create new client

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  cache = new Cache();

  // Cron job for 20:00 every Wednesday
  // Creates thread in practice channel
  const scheduledWeeklyThread = new cron.CronJob('00 20 * * WED', async () => {
      const channel = await client.channels.fetch(channelId);
      const date = moment().format('YYYY-MM-DD');
      
      const thread = await channel.threads.create({
          name: `Wednesday Weekly Whatcha Working On? ${date}`,
          autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
          reason: "Keep yourself accountable"
      }).catch(console.error);

      await thread.send("Share whatcha've been working on! <a:ablobwobwork:1002344417040015421>");
  });

  scheduledWeeklyThread.start();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'dailyjazzmove') {
        const date = moment().format('YYYY-MM-DD');
        const jazzCache = cache.getCache().dailyJazz;
        
        if (jazzCache.hasOwnProperty(date)) {
            await interaction.reply(jazzCache[date]);
        } else {
            const jazzMove = jazzCommands.jazzMove();
            cache.writeDailyJazz(date, jazzMove);
            await interaction.reply(jazzMove);
        }
    } else if (commandName === 'jazzcombo') {
        const date = moment().format('YYYY-MM-DD');
        const comboCache = cache.getCache().jazzCombo;
        
        if (comboCache.hasOwnProperty(date)) {
            await interaction.reply(comboCache[date]);
        } else {
            const jazzCombo = jazzCommands.jazzCombo();
            cache.writeJazzCombo(date, jazzCombo);
            await interaction.reply(jazzCombo);
        }
    }
})

//make sure this line is the last line
client.login(token); //login bot using token