const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music!'),
    async execute(interaction, client) {

        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return await interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!` });

        queue.destroy();
        const embed6 = new MessageEmbed()
            .setTitle('Stopped the music')
            .setDescription('✅ Left the voice, See you later')
            .setTimestamp()
            .setColor('RED')
            .setFooter({ text: 'Guitar' })
        await interaction.reply({ embeds: [embed6] });
    }
}