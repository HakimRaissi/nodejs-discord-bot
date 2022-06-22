/* Requires */

const { Client, Intents } = require("discord.js");

/* Config */

require("dotenv").config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: ["USER", "MESSAGE", "REACTION"],
});

/* Constants */

const PREFIX = "!";

const MESSAGE_REACTION_ROLE_ID = "988879419508686879";

const EMOJI_REACTION_MAP = new Map([
    ["⚙️", "988873695357440030"],
    ["🍌", "988873112655384656"],
    ["🍇", "988873281333514260"],
    ["🐍", "988873157815447632"],
]);

/* Event Listeners */

client.once("ready", () => {
    console.log(`${client.user.tag} is online!`);
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);

        // Kick Command
        if (CMD_NAME === "kick") {
            const member = message.mentions.members.first();
            const permission = message.member.permissions.has("KICK_MEMBERS");

            if (!permission)
                return message.reply(
                    "You don't have permission to use this command"
                );

            if (!args[0]) return message.reply(`Please specify someone`);

            if (!member) return message.reply(`Cannot find that member...`);

            if (member.id === message.author.id)
                return message.reply(`You cannot ban yourself!`);

            if (
                message.member.roles.highest.position <
                member.roles.highest.position
            )
                return message.reply(
                    `You cannot ban user who have higher role than you...`
                );

            member
                .kick()
                .then((member) => message.channel.send(`${member} was kicked.`))
                .catch((err) =>
                    message.channel.send("I cannot kick that user")
                );
        }

        // Ban Command
        if (CMD_NAME === "ban") {
            const member = message.mentions.members.first();
            const permission = message.member.permissions.has("BAN_MEMBERS");

            if (!permission)
                return message.reply(
                    "You don't have permission to use this command"
                );

            if (!args[0]) return message.reply(`Please specify someone`);

            if (!member) return message.reply(`Cannot find that member...`);

            if (member.id === message.author.id)
                return message.reply(`You cannot ban yourself!`);

            if (
                message.member.roles.highest.position <
                member.roles.highest.position
            )
                return message.reply(
                    `You cannot ban user who have higher role than you...`
                );

            if (!member.bannable)
                return message.reply(`I cannot ban that member`);

            member
                .ban()
                .then(() => {
                    console.log("User banned");

                    message.channel.send("User banned");
                })
                .catch((err) => {
                    console.err(err);
                    message.channel.send("I cannot ban that user");
                });
        }
    }
});

client.on("messageReactionAdd", (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);

    if (reaction.message.id === MESSAGE_REACTION_ROLE_ID) {
        for (const [key, value] of EMOJI_REACTION_MAP.entries()) {
            if (key === name) member.roles.add(value);
        }
    }
});

client.on("messageReactionRemove", (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);

    if (reaction.message.id === MESSAGE_REACTION_ROLE_ID) {
        for (const [key, value] of EMOJI_REACTION_MAP.entries()) {
            if (key === name) member.roles.remove(value);
        }
    }
});

/* Login */

client.login(process.env.DISCORD_BOT_TOKEN);
