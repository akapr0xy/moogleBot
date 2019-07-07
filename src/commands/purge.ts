import * as Discord from "discord.js";
import { IBotCommand } from "../api";

export default class purge implements IBotCommand {

    private readonly _command = "purge"

    help(): string {
        return "(Admin Only) Deletes the desired number of messages from the channel";
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): void {
        //Clean up messages
        msgObject.delete();

        //Check if user has administrator privileges
        if (!msgObject.member.hasPermission("ADMINISTRATOR")) {
            msgObject.channel.send(`Sorry ${msgObject.author.username} but this command is only for Admins, kupo!`)
                .then(msg => {
                    (msg as Discord.Message).delete(5000);
                });
            return;
        }
        //Check for message count to be deleted
        if(!args[0]){
            msgObject.channel.send(`Sorry ${msgObject.author.username} but you must supply a number of messages to be deleted, kupo!`)
                .then(msg => {
                    (msg as Discord.Message).delete(5000);
                });
            return;        
        }

        //Convert args[0] into a number
        let numberOfMessagesToDelete = Number(args[0]);

        //Make sure the args[0] is a number
        if(isNaN(numberOfMessagesToDelete)){
            msgObject.channel.send(`Sorry ${msgObject.author.username} but that isn't a valid number, kupo!`)
                .then(msg => {
                    (msg as Discord.Message).delete(5000);
                });
            return; 
        }
        //Make sure number is an integer
        numberOfMessagesToDelete = Math.round(numberOfMessagesToDelete);

        //Delete the desired number of messages
        msgObject.channel.bulkDelete(numberOfMessagesToDelete)
            .catch(console.error);
    }
}