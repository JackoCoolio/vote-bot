import { Client, Message } from "discord.js";
import { CommandState } from "../command";
import { ApprovalPoll } from "../poll/approval";
import { PollManager } from '../poll/pollmanager';

export function StartPollCommand(state: CommandState): void {

    const { message, parameters } = state;

    const title = parameters.get('title');

    if (!title || title.length == 0 || typeof title != 'string') {
        message.channel.send('You must specify a title for the poll!').then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);

        return;
    }

    const options = parameters.get('options');

    if (!options) {
        message.channel.send('You must specify a list of options for the poll!').then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);

        return;
    }

    if (typeof options == 'string' || options.length == 0) {
        message.channel.send('Options must be a non-empty list!').then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);

        return;
    }

    const type = parameters.get('type');

    if (!type) {
        message.channel.send('You must specify the type of poll to run!').then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);

        return;
    }

    switch (type) {
        case 'approval':

            if (!(state.pollManager instanceof PollManager)) {
                message.channel.send('There was an issue creating the poll!').then(res => {
                    message.delete().catch(console.error);

                    setTimeout(() => {
                        res.delete().catch(console.error);
                    }, 5000);
                }).catch(console.error);

                return;
            }

            const pollManager = state.pollManager as PollManager;

            const poll = new ApprovalPoll(title, options);

            const id = pollManager.addPoll(poll);

            const embed = poll.buildPollEmbed(id);

            message.channel.send(embed).then(embedMessage => {
                poll.populateReactions(embedMessage);
            }).catch(console.error);

            break;
        default:
            message.channel.send(`There is no poll of type \`${type}\``).then(res => {
                message.delete().catch(console.error);

                setTimeout(() => {
                    res.delete().catch(console.error);
                }, 5000);
            }).catch(console.error);

            break;
    }

}