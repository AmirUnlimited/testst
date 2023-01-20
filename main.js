//~ <--- Discord Stuff --->

const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const client = new Discord.Client(
  { intents: 32767 },
  { partials: ["MESSAGE", "CHANNEL", "REACTION"] }
);

module.exports = client;

//~ <--- Discord Stuff --->

//? Other Stuff

const { readdirSync } = require("fs");
require("dotenv").config();
const fs = require("fs");

//? Other Stuff

client.on("ready", async () => {

  client.guilds.cache.forEach((guild) => {
    console.log(`${guild.name} | ${guild.id}`);
    console.log(`${client.user.tag} ( ${client.user.id} ) is online!`);
  });

  const activities = [
    `Guitar Music 🎸`,
    `Guitar`,
  ];

  const status = activities[Math.floor(Math.random() * activities.length)];
  client.user.setPresence(
    { status: "online", activities: [{ name: `${status}`, type: "LISTENING" }] },
    15000
  );
})

client.slashcommands = new Discord.Collection();


// Slash Commands

fs.readdir("./slashcommands", (err, files) => {
  if (err) console.error(err);
  else {
    client.scategories = files;
  }
});

const slashCommandFolders = fs.readdirSync("./slashcommands")
const slashEventFiles = fs.readdirSync("./slashEvents").filter(file => file.endsWith(".js"));
const functions = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));

for (const file of functions) {
  require(`./functions/${file}`)(client);
}

client.handleEvents(slashEventFiles, "./slashEvents");
client.handleCommands(slashCommandFolders, "./slashcommands");

//* <--- Music System --->

const { Player } = require("discord-player");
client.config = require("./config");
client.player = new Player(client, client.config.opt.discordPlayer);
const player = client.player;

player.on("trackAdd", (queue, track) => {
  const embed = new MessageEmbed()
    .setTitle("⏭ Queued")
    .setColor('RED')
    .setDescription(`[**${track.title}**](${track.url})`)
    .setImage(track.thumbnail)
    .setTimestamp()
    .setFooter({ text: "PDM Playlist" });
  queue.metadata.send({ embeds: [embed] }).then(msg => {
    global.queue_message = msg;
  })
});

player.on("botDisconnect", (q) => {

  const queue = client.player.getQueue(interaction.guild.id);

  if (!queue || !queue.playing) return interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!` });

  queue.destroy();

});


player.on("channelEmpty", (q) => {

  const queue = client.player.getQueue(interaction.guild.id);

  if (!queue || !queue.playing) return interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!` });

  queue.destroy();

});

player.on("queueEnd", (queue) => {
  //
});

player.on("trackStart", (queue, track) => {

  //! let time_int = track.duration.replace(":", "");
  // let time = time_int * 1000;
  // setTimeout(() => {
  //   queue_message.edit({ components: [] })
  // }, time);

  const embed5 = new MessageEmbed()
    .setTitle("▶ Now Playing")
    .setDescription(
      `[**${track.title}**](${track.url})  (\`${queue.current.duration}\`) `
    )
    .setColor('RED')
    .setImage(track.thumbnail)
    .setTimestamp();
  if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;

  const music_row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('volume_down')
        .setEmoji('🔉')
        .setStyle('DANGER'),
      new MessageButton()
        .setCustomId('queue_stop')
        .setEmoji('⏹')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('queue_pause')
        .setEmoji('⏯')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('queue_next')
        .setEmoji('⏭')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('volume_up')
        .setEmoji('🔊')
        .setStyle('SUCCESS'),
    )
  queue_message.edit({ embeds: [embed5], components: [music_row] });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId == 'volume_down') {
    const queue = client.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) return interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!`, ephemeral: true });

    if (queue.volume == 0) return await interaction.reply({ content: '❌ You can\'t decrease the volume more than this!', ephemeral: true });

    queue.setVolume(queue.volume - 5);
    await interaction.reply({ content: `🔉 <@${interaction.user.id}> Decreased Volume by 5: ${queue.volume}` });
  }

  if (interaction.customId == 'volume_up') {
    const queue = client.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) return interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!`, ephemeral: true });

    if (queue.volume == 100) return await interaction.reply({ content: '❌ You can\'t increase the volume more than this!', ephemeral: true });

    queue.setVolume(queue.volume + 5);
    await interaction.reply({ content: `🔊 <@${interaction.user.id}>, Increased Volume by 5: ${queue.volume}` });
  }

  if (interaction.customId == 'queue_stop') {
    const queue = client.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) return interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!`, ephemeral: true });

    queue.destroy();
    interaction.reply({ content: `⏹ <@${interaction.user.id}>, Stopped the Queue.` });
  }

  if (interaction.customId == 'queue_pause') {
    const queue = client.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) return interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!`, ephemeral: true });

    const success = queue.setPaused(true);
    if (!success) queue.setPaused(false);
    return interaction.reply({ content: `${success ? `⏸ <@${interaction.user.id}>, The Queue has been Paused Successfuly.` : `▶ <@${interaction.user.id}>, The Queue has been Resumed Successfuly`}`});
  }

  if (interaction.customId == 'queue_next') {
    const queue = client.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) return interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!`, ephemeral: true });
    const success = queue.skip();

    return interaction.reply({ content: success ? `⏭ <@${interaction.user.id}>` : `❌ <@${interaction.user.id}>, Something went wrong!` });
  }
});

//* <--- Music System End --->

process.on("unhandledRejection", (reason, p) => {
  console.log(" [antiCrash] :: Unhandled Rejection/Catch");
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch");
  console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
  console.log(err, origin);
});

client.login(process.env.DISCORD_TOKEN);