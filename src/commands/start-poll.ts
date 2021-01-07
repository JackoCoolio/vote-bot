import { CommandState } from "../command";
import { ApprovalPoll } from "../poll/approval";
import { SimplePoll } from '../poll/simple';
import { PollManager } from '../poll/pollmanager';
import { Poll } from "../poll/poll";
import { RankedChoicePoll } from "../poll/ranked-choice";

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

    var poll: Poll;

    switch (type) {
        case 'approval':

            poll = new ApprovalPoll(title, options);

            break;
        case 'simple':

            poll = new SimplePoll(title, options);

            break;
        case 'ranked':
        case 'ranked-choice':
        case 'rc':

            poll = new RankedChoicePoll(title, options, 3);

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

    if (poll) {

        const id = pollManager.addPoll(poll);

        const embed = pollManager.buildPollEmbed(id);

        message.channel.send(embed).then(embedMessage => {
            poll.populateReactions(embedMessage);

            poll.setPollMessage(embedMessage);
        }).catch(console.error);

    }

}