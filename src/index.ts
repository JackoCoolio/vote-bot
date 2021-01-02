import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

import { CommandManager } from './command';
import { StartPollCommand } from './commands/start-poll';
import { ResultsCommand } from './commands/results';
import { PollManager } from './poll/pollmanager';

const client = new Discord.Client();

const commandManager = new CommandManager('v!');
const pollManager = new PollManager();

commandManager.registerCommand(['startpoll', 'start'], StartPollCommand);
commandManager.registerCommand('results', ResultsCommand);

client.on('ready', () => {
    console.log('Vote bot online.');
});

client.on('message', msg => {

    if (msg.author.bot) return;
    
    commandManager.setState({
        pollManager: pollManager
    });

    // if the command wasn't found send an error message
    if (!commandManager.parse(msg, client)) {
        msg.channel.send('That command doesn\'t exist!').catch(console.error);
    }

});

client.on('messageReactionAdd', (reaction, user) => {
    pollManager.onReactionAdd(reaction, user);
});

client.login(process.env.TOKEN);