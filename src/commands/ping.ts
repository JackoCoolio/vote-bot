import { Client, Message } from 'discord.js';

export function PingCommand(client: Client, message: Message, parameters: Map<string, string | Array<string>>): void {

    message.channel.send('Pong!').then(res => {

        message.delete().catch(console.error);

        setTimeout(() => {
            res.delete().catch(console.error);
        }, 5000);
    }).catch (console.error);

}