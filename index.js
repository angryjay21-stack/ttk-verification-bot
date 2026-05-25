require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`${client.user.tag} is online`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!setupverify')) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('You need admin.');
    }

    const role = message.mentions.roles.first();

    if (!role) {
      return message.reply('Mention a role.');
    }

    const embed = new EmbedBuilder()
      .setTitle('TTK Verification')
      .setDescription('Click the button below to verify.')
      .setColor('Green');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`verify_${role.id}`)
        .setLabel('Verify')
        .setStyle(ButtonStyle.Success)
    );

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId.startsWith('verify_')) {

    const roleId = interaction.customId.split('_')[1];

    try {
      await interaction.member.roles.add(roleId);

      await interaction.reply({
        content: 'You are now verified.',
        ephemeral: true
      });

    } catch (err) {
      console.log(err);

      await interaction.reply({
        content: 'Role error.',
        ephemeral: true
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
