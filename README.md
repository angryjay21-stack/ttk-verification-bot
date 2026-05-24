# TTK RZ Verification Bot

Discord verification bot for Railway. It posts a verification embed with the TTK RZ logo and gives a selected role when users click the ✅ button.

## Files
- `index.js` - bot code
- `package.json` - dependencies
- `TTKRZ_LOGO.png` - logo used in the verification embed

## Environment Variables

Add these in Railway:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_client_id
GUILD_ID=your_discord_server_id
```

`GUILD_ID` is optional, but recommended because slash commands appear faster.

## Discord Setup

1. Go to the Discord Developer Portal and create a new application.
2. Name it: `TTK 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍✅ BOT`
3. Go to **Bot** and create/reset the token. Put that token in Railway as `DISCORD_TOKEN`.
4. Turn on **Server Members Intent** in the Bot page.
5. Go to **OAuth2 > URL Generator**.
6. Select scopes:
   - `bot`
   - `applications.commands`
7. Select bot permissions:
   - Manage Roles
   - Send Messages
   - Embed Links
   - Attach Files
   - Read Message History
   - View Channels
8. Open the generated invite link and add the bot to your server.
9. In Discord server settings, drag the bot role ABOVE the role it needs to give.
10. Create a role like `Verified`.
11. Lock your private channels so `@everyone` cannot view them, then allow the `Verified` role to view them.
12. In the verify channel, run:

```text
/setupverify role:@Verified
```

The bot will post the verification message. When users click ✅, they get the role.

## Railway Setup

1. Upload this folder to GitHub.
2. In Railway, create a new project from that GitHub repo.
3. Add the environment variables from above.
4. Railway should run `npm start` automatically.
5. Keep the project deployed so the bot stays online.
