const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  PermissionFlagsBits,
  REST,
  Routes
} = require("discord.js");
require("dotenv").config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // optional, faster slash command updates
const BOT_NICKNAME = "TTK 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍✅ BOT";

if (!TOKEN || !CLIENT_ID) {
  console.error("Missing DISCORD_TOKEN or CLIENT_ID in environment variables.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel]
});

const commands = [
  new SlashCommandBuilder()
    .setName("setupverify")
    .setDescription("Post the TTK RZ verification message in this channel.")
    .addRoleOption(option =>
      option
        .setName("role")
        .setDescription("Role members get after clicking verify")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON()
];

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  if (GUILD_ID) {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("Registered guild slash commands.");
  } else {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log("Registered global slash commands. These can take up to 1 hour to appear.");
  }
}

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  for (const guild of client.guilds.cache.values()) {
    try {
      const me = await guild.members.fetchMe();
      await me.setNickname(BOT_NICKNAME).catch(() => {});
    } catch {}
  }
});

client.on("guildCreate", async guild => {
  try {
    const me = await guild.members.fetchMe();
    await me.setNickname(BOT_NICKNAME).catch(() => {});
  } catch {}
});

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isChatInputCommand() && interaction.commandName === "setupverify") {
      const role = interaction.options.getRole("role");

      const logo = new AttachmentBuilder("./TTKRZ_LOGO.png", { name: "TTKRZ_LOGO.png" });

      const embed = new EmbedBuilder()
        .setTitle("Please Verify To Get Access To TTK RZ")
        .setDescription("Click the ✅ button below to verify and unlock the server.")
        .setImage("attachment://TTKRZ_LOGO.png")
        .setColor(0x2b2d31)
        .setFooter({ text: "TTK RZ Verification" });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`verify:${role.id}`)
          .setLabel("Verify")
          .setEmoji("✅")
          .setStyle(ButtonStyle.Success)
      );

      await interaction.channel.send({
        embeds: [embed],
        files: [logo],
        components: [row]
      });

      await interaction.reply({
        content: `Verification message posted. Users who click it will get ${role}.`,
        ephemeral: true
      });
      return;
    }

    if (interaction.isButton() && interaction.customId.startsWith("verify:")) {
      const roleId = interaction.customId.split(":")[1];
      const role = interaction.guild.roles.cache.get(roleId);

      if (!role) {
        await interaction.reply({ content: "Verification role was not found. Ask an admin to remake the verify message.", ephemeral: true });
        return;
      }

      const member = await interaction.guild.members.fetch(interaction.user.id);

      if (member.roles.cache.has(roleId)) {
        await interaction.reply({ content: "You are already verified ✅", ephemeral: true });
        return;
      }

      await member.roles.add(role);
      await interaction.reply({ content: "You are verified ✅ You now have access.", ephemeral: true });
    }
  } catch (error) {
    console.error(error);
    const message = "Something went wrong. Make sure my bot role is above the verification role and I have Manage Roles permission.";
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: message, ephemeral: true }).catch(() => {});
    } else {
      await interaction.reply({ content: message, ephemeral: true }).catch(() => {});
    }
  }
});

(async () => {
  await registerCommands();
  await client.login(TOKEN);
})();
