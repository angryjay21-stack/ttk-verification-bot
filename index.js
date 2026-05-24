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
      option
        .setName('role')
        .setDescription('Verification role')
        .setRequired(true)
    )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Slash commands registered.');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`${client.user.tag} online`);
});

client.on('interactionCreate', async interaction => {

  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === 'setupverify') {

      await interaction.deferReply({ ephemeral: true });

      const role = interaction.options.getRole('role');

      const embed = new EmbedBuilder()
        .setTitle('TTK 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍✅ BOT')
        .setDescription('Please Verify To Get Access To TTK RZ')
        .setColor('#8000ff')
        .setImage('attachment://TTKRZ_LOGO.png');

      const button = new ButtonBuilder()
        .setCustomId(`verify_${role.id}`)
        .setLabel('Verify')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(button);

      await interaction.channel.send({
        embeds: [embed],
        components: [row],
        files: ['./TTKRZ_LOGO.png']
      });

      await interaction.editReply({
        content: '✅ Verification panel created.'
      });
    }
  }

  if (interaction.isButton()) {

    if (interaction.customId.startsWith('verify_')) {

      const roleId = interaction.customId.split('_')[1];

      const role = interaction.guild.roles.cache.get(roleId);

      if (!role) {
        return interaction.reply({
          content: 'Role not found.',
          ephemeral: true
        });
      }

      try {

        await interaction.member.roles.add(role);

        await interaction.reply({
          content: `✅ Verified successfully!`,
          ephemeral: true
        });

      } catch (err) {

        console.error(err);

        await interaction.reply({
          content: '❌ Bot cannot give role. Move bot role above verified role.',
          ephemeral: true
        });
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
