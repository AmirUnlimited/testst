const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear Queue!'),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return await interaction.reply({ content: `❌ ${interaction.user}, No music currently playing.`, ephemeral: true });
        if (!queue.tracks[0]) return await interaction.reply({ content: `❌ ${interaction.user}, There is already no musics in the queue after the current one`, ephemeral: true });
        
        await queue.clear();
        await interaction.reply({ content: `✅ The queue has been cleared.` });
    }
}