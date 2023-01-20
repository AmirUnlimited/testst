const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Loop the music!')
        .addSubcommand(
            subcommand => subcommand
                .setName('track')
                .setDescription('Loop the track!'))
        .addSubcommand(
            subcommand => subcommand
                .setName('queue')
                .setDescription('Loop the queue!'))
        .addSubcommand(
            subcommand => subcommand
                .setName('disable')
                .setDescription('Disable the track loop!')),

    async execute(interaction, client) {
        if (interaction.options.getSubcommand() === 'queue') {

            const queue = client.player.getQueue(interaction.guild.id);

            if (!queue || !queue.playing) return await interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!. `, ephemeral: true });
    
            const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);
    
            return await interaction.reply({ content: '🔂' });

        } else if (interaction.options.getSubcommand() === 'disable') {

            const queue = client.player.getQueue(interaction.guild.id);

            if (!queue || !queue.playing) return await interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!. `, ephemeral: true });

            const success = queue.setRepeatMode(QueueRepeatMode.OFF);

            return await interaction.reply({ content: '✅ Disabled the Loop Mode' });

        } else {
            const queue = client.player.getQueue(interaction.guild.id);

            if (!queue || !queue.playing) return await interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!. `, ephemeral: true });

            const success = queue.setRepeatMode(QueueRepeatMode.TRACK);

            return await interaction.reply({ content: '🔁' });
        }

    }
}