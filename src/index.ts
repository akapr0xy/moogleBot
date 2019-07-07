import * as Discord from "discord.js";
import * as ConfigFile from "./config";
import { IBotCommand } from "./api";

const client: Discord.Client = new Discord.Client();

let commands: IBotCommand[] = [];

loadCommands(`${__dirname}/commands`);

client.on("ready", () => {
    //Informs if bot launched successfully
    console.log("Ready to launch");
})

client.on("message", msg => {

    //Ignore the message if it was sent by the bot
    if (msg.author.bot) { return; }

    //Ignore message if it was sent in dm's
    if (msg.channel.type == "dm") { return; }

    //Ignore messages that don't start with the prefix
    if (!msg.content.startsWith(ConfigFile.config.prefix)) { return; }

    //Handle the command
    handleCommand(msg);
})

async function handleCommand(msg: Discord.Message) {
    //Split the string into the command and all of the args
    let command = msg.content.split(" ")[0].replace(ConfigFile.config.prefix, "");
    let args = msg.content.split(" ").slice(1);

    //Loop through all loaded commands
    for (const commandClass of commands) {
        //Attempt to execute code but ready in case of possible error
        try {
            //Check if command class is the correct one
            if (!commandClass.isThisCommand(command)) {
                //Go to next iteration of the loop if this isn't the correct command class
                continue;
            }

            //Pause execution while commands code is ran
            await commandClass.runCommand(args, msg, client);
        }
        catch (exception) {
            //If there is an error, log exception
            console.log(exception);
        }
    }
}

function loadCommands(commandsPath: string) {
    //Exit if there are no commands
    if (!ConfigFile.config || (ConfigFile.config.commands as string[]).length === 0) { return; }

    //Loop through all commands in config
    for (const commandName of ConfigFile.config.commands as string[]) {
        const commandsClass = require(`${commandsPath}/${commandName}`).default;

        const command = new commandsClass() as IBotCommand;

        commands.push(command);
    }
}

client.login(ConfigFile.config.token);