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
  Routes,
  PermissionsBitField,
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const VERIFY_CHANNEL_ID = "1508238876404092938";

const commands = [
  new SlashCommandBuilder()
    .setName('setupverify')
    .setDescription('Create verification panel')
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('Role to give after verification')
        .setRequired(true)
    ),
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
  console.log(`${client.user.tag} is online!`);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'setupverify') {

      const role = interaction.options.getRole('role');

      const channel = await client.channels.fetch(VERIFY_CHANNEL_ID);

      if (!channel) {
        return interaction.reply({
          content: 'Verification channel not found.',
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('TTK VERIFICATION ✅')
        .setDescription('Click the button below to verify.')
        .setColor('#00ff88');

      const button = new ButtonBuilder()
        .setCustomId(`verify_${role.id}`)
        .setLabel('Verify')
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(button);

      await channel.send({
        embeds: [embed],
        components: [row],
      });

      await interaction.reply({
        content: 'Verification panel sent.',
        ephemeral: true,
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
          ephemeral: true,
        });
      }

      try {
        await interaction.member.roles.add(role);

        await interaction.reply({
          content: `You are now verified with ${role.name}!`,
          ephemeral: true,
        });

      } catch (err) {
        console.error(err);

        await interaction.reply({
          content: 'Bot cannot assign that role. Move my role above it.',
          ephemeral: true,
        });
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
