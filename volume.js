const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const maxVol = require("../../config").opt.maxVol;

module.exports = {
  category: "Music",
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Stop the music!')
    .addNumberOption(option => option.setName('vol').setDescription('Enter a number from 0 to 100')),
  async execute(interaction, client) {

    const queue = client.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) return await interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!`, ephemeral: true });

    const vol = interaction.options.getNumber('volume');
    if (vol == 'e') return await interaction.reply({ content: 'This number is not supported!', ephemeral: true });

    if (queue.volume === vol) return await interaction.reply({ content: `❌ <@${interaction.user.id}>, The volume you want to change is already the current volume.`, ephemeral: true });

    if (vol < 0 || vol > maxVol) return await interaction.reply({ content: `❌ <@${interaction.user.id}>, **Type a number from \`1\` to \`${maxVol}\` to change the volume .**`, ephemeral: true });

    const success = queue.setVolume(vol);
    return await interaction.reply({ content: success ? `🔉 Volume changed: **%${vol}**/**${maxVol}**` : `❌ <@${interaction.user.id}>, Something went wrong!`, ephemeral: true });
  },
};