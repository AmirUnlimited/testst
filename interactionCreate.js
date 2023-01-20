const { Permissions } = require("discord.js");
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.slashcommands.get(interaction.commandName);
        if (!command) return;

        try {

            // if (command.permissions && command.permissions.lenght > 0) {
            //     if (!interaction.member.permissions.has(command.permissions)) return await interaction.reply({ content: '❌ You do not have permissions to use this command!', ephemeral: true });
            // }

            await command.execute(interaction, client);

        } catch (e) {
            console.log(e);
            await interaction.reply({
                content: `❌ There was an error while executing this command!`,
                ephemeral: true
            })
        }
    }
}