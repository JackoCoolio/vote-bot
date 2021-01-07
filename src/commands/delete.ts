import { CommandState } from "../command";
import { PollManager } from "../poll/pollmanager";

export function DeleteCommand(state: CommandState): void {

    const { parameters, message } = state;

    const id = parameters.get('id');
    if (!id || typeof id != 'string') {
        message.channel.send('You must specify the ID of the poll!').then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);

        return;
    }

    if (!(state.pollManager instanceof PollManager)) {
        message.channel.send('There was an issue deleting the poll!').then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);

        return;
    }

    const pollManager = state.pollManager as PollManager;

    const poll = pollManager.getActivePolls().get(id);

    if (!poll) {
        message.channel.send(`Couldn't find a poll with ID ${id}!`).then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);

        return;
    }

    // poll does exist

    const promises = [];
    if (poll.getPollMessage()) promises.push(poll.getPollMessage().delete());
    if (poll.getResultsMessage()) promises.push(poll.getResultsMessage().delete())

    Promise.all(promises).then(() => {
        pollManager.inactivatePoll(id);

        message.channel.send(`Deleted the poll with ID ${id}!`).then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);
    }).catch(console.error);

}