require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  REST,
  Routes
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const commands = [
  new SlashCommandBuilder()
    .setName('setupverify')
    .setDescription('Create verification panel')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role users get when verified')
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Slash commands registered.');
  } catch (err) {
    console.error(err);
  }
})();

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isChatInputCommand() && interaction.commandName === 'setupverify') {
      await interaction.deferReply({ ephemeral: true });

      const role = interaction.options.getRole('role');
      const channel = await interaction.guild.channels.fetch(interaction.channelId);

      const embed = new EmbedBuilder()
        .setTitle('TTK 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍✅ BOT')
        .setDescription('Please Verify To Get Access To TTK RZ')
        .setColor('#8000ff');

      const button = new ButtonBuilder()
        .setCustomId(`verify_${role.id}`)
        .setLabel('Verify')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(button);

      await channel.send({
        embeds: [embed],
        components: [row]
      });

      await interaction.editReply('✅ Verification panel created.');
    }

    if (interaction.isButton() && interaction.customId.startsWith('verify_')) {
      const roleId = interaction.customId.replace('verify_', '');
      const role = interaction.guild.roles.cache.get(roleId);

      await interaction.member.roles.add(role);

      await interaction.reply({
        content: '✅ You are now verified!',
        ephemeral: true
      });
    }
  } catch (err) {
    console.error(err);

    if (interaction.deferred) {
      await interaction.editReply('❌ Error. Check Railway logs.');
    } else if (!interaction.replied) {
      await interaction.reply({
        content: '❌ Error. Check Railway logs.',
        ephemeral: true
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
