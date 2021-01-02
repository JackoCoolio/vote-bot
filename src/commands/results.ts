import { CommandState } from "../command";
import { PollManager } from "../poll/pollmanager";

export function ResultsCommand(state: CommandState): void {
    
    const { message, parameters } = state;

    const id = parameters.get('id');

    if (!id || typeof(id) != 'string') {
        
        message.channel.send(`You must specify the ID of the poll!`).then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);

        return;
    }

    if (!(state.pollManager instanceof PollManager)) {

        message.channel.send(`Something went wrong!`).then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);

        return;
    }

    const pollManager = state.pollManager as PollManager;

    const poll = pollManager.getPoll(id);

    if (!poll) {
        message.channel.send(`I couldn't find a poll with ID \`${id}\`!`).then(res => {
            message.delete().catch(console.error);

            setTimeout(() => {
                res.delete().catch(console.error);
            }, 5000);
        }).catch(console.error);

        return;
    }

    const embed = poll.buildResultsEmbed();
    message.channel.send(embed).then(resultsMessage => {
        if (poll.getResultsMessage()) {
            poll.getResultsMessage().delete().catch(console.error);
        }
        poll.setResultsMessage(resultsMessage);
    }).catch(console.error);

    message.delete().catch(console.error);

}