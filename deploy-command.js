// https://discordjs.guide/creating-your-bot/creating-commands.html#replying-to-commands
// Deployment script for commands

require('dotenv').config(); //initialize dotenv
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const token = process.env.CLIENT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD;

const commands = [
    new SlashCommandBuilder().setName('dailyjazzmove').setDescription('Gives you a daily jazz move to practice!'),
    new SlashCommandBuilder().setName('jazzcombo').setDescription('Gives you a daily jazz combo to practice!'),
    new SlashCommandBuilder().setName('adminmusicmonday').setDescription('ForceMusicMonday')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);