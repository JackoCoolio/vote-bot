import { Client, Message } from "discord.js";

export function StartPollCommand(client: Client, message: Message, parameters: Map<string, string | Array<string>>): void {

    if (!parameters.has('title') || parameters.get('title').length == 0) {
        message.channel.send('You must specify a title for the poll!').then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);

        return;
    }

    const title = parameters.get('title');

    if (!parameters.has('options')) {
        message.channel.send('You must specify a list of options for the poll!').then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);

        return;
    }

    const options = parameters.get('options');
    
    if (typeof options == 'string' || options.length == 0) {
        message.channel.send('Options must be a non-empty list!').then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);
        
        return;
    }

}