const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const clientId = 'CLIENT_ID';
module.exports = (client) => {
    client.handleCommands = async (slashCommandFolders, path) => {
        client.slashCommandArray = [];
        for (folder of slashCommandFolders) {
            const slashCommandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of slashCommandFiles) {
                const command = require(`../slashcommands/${folder}/${file}`);
                client.slashCommandArray.push(command.data.toJSON());
                client.slashcommands.set(command.data.name, command)
            }

            const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

            (async () => {
                try {
                    console.log('Started refreshing application (/) commands.'); // in khat ra pas az avalin run kardan comment konid
                    rest.put(Routes.applicationCommands(clientId), { // in khat ra pas az avalin run kardan comment konid
                        body: client.slashCommandArray // in khat ra pas az avalin run kardan comment konid
                    }) // in khat ra pas az avalin run kardan comment konid
                    console.log('Started refreshing application (/) commands.'); // in khat ra pas az avalin run kardan comment konid
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    }
}