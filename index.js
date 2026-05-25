require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`${client.user.tag} is online`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.startsWith('!setupverify')) {
    const role = message.mentions.roles.first();

    if (!role) {
      return message.reply('Tag the role like this: `!setupverify @Verified`');
    }

    const embed = new EmbedBuilder()
      .setTitle('TTK 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍✅ BOT')
      .setDescription('Please Verify To Get Access To TTK RZ')
      .setColor('#8000ff');

    const button = new ButtonBuilder()
      .setCustomId(`verify_${role.id}`)
      .setLabel('Verify')
      .setEmoji('✅')
      .setStyle(ButtonStyle.Success);

    await message.channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(button)]
    });

    await message.reply('✅ Verification panel created.');
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId.startsWith('verify_')) {
    const roleId = interaction.customId.replace('verify_', '');

    try {
      await interaction.member.roles.add(roleId);

      await interaction.reply({
        content: '✅ You are now verified!',
        ephemeral: true
      });
    } catch (err) {
      console.error(err);

      await interaction.reply({
        content: '❌ Bot cannot give role. Put bot role above Verified role.',
        ephemeral: true
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
