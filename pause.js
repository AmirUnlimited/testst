const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause or Unpause the playing music!'),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!.`, ephemeral: true});

        const success = queue.setPaused(true);
        if (!success) queue.setPaused(false);

        await interaction.reply('✅ Paused the music');
    }
}