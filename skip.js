const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the music to the next one!'),
    async execute(interaction, client) {

        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return await interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!` });

        const success = queue.skip();
        return await interaction.reply({ content: success ? `⏭ ` : `❌ <@${interaction.user.id}>, Something went wrong!`, ephemeral: true });

    }
}