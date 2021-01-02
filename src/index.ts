import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

import { CommandManager } from './command';

const client = new Discord.Client();

const manager = new CommandManager('v!');

client.on('ready', () => {
    console.log('Vote bot online.');
});

client.on('message', msg => {

    if (msg.author.bot) return;
    
    // if the command wasn't found send an error message
    if (!manager.parse(msg, client)) {
        msg.channel.send('That command doesn\'t exist!').catch(console.error);
    }

});

client.login(process.env.TOKEN);