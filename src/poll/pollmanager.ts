import { MessageEmbed, MessageReaction, PartialUser, User } from "discord.js";
import { Poll } from "./poll";

/**
 * Manages the active polls in a guild.
 */
export class PollManager {

    /**
     * The currently running Polls.
     */
    private polls: Map<string, Poll> = new Map<string, Poll>();

    /**
     * The now-inactive Polls.
     */
    private inactivePolls: Map<string, Poll> = new Map<string, Poll>();

    /**
     * Adds a Poll to the list of active Polls.
     * 
     * @param poll the Poll to add
     * 
     * @returns the ID of the Poll
     */
    addPoll(poll: Poll): string {
        const id = this.generateID();
        this.polls.set(id, poll);
        return id;
    }

    /**
     * Returns the Poll with the specified ID.
     * 
     * @param id the ID of the Poll
     */
    getPoll(id: string) {
        return this.polls.get(id);
    }

    inactivatePoll(id: string) {
        let poll = this.polls.get(id);
        if (poll) {

            // move poll from active to inactive poll array
            this.polls.delete(id);
            this.inactivePolls.set(id, poll);
        }
    }

    /**
     * Returns a list of all active Polls.
     * 
     * @returns a list of Polls
     */
    getActivePolls() {
        return this.polls;
    }

    /**
     * Returns a list of all inactive Polls.
     * 
     * @returns a list of Polls
     */
    getInactivePolls() {
        return this.inactivePolls;
    }

    onReactionAdd(messageReaction: MessageReaction, user: User | PartialUser): void {
        const message = messageReaction.message;

        if (message.author.id != message.client.user.id) return;

        // ignore bot reactions
        if (user.bot) return;

        if (message.embeds.length != 1) {
            message.channel.send(`Couldn't register a vote from <@${message.author.id}>!`).then(res => {
                setTimeout(() => {
                    res.delete().catch(console.error);
                }, 5000);
            }).catch(console.error);

            return;
        }

        const embed = message.embeds[0];
        const id = embed.footer.text.split(' ')[1];

        if (!this.polls.has(id)) {
            message.channel.send(`Couldn't register a vote from <@${message.author.id}>!\nPoll **${id}** doesn't exist!`).then(res => {
                setTimeout(() => {
                    res.delete().catch(console.error);
                }, 5000);
            }).catch(console.error);

            return;
        }

        console.log(`Someone voted on a poll with ID ${id}`);

        const poll = this.polls.get(id);

        // pass reaction to the poll
        poll.onReactionAdd(message, messageReaction, user.id);

    }

    buildPollEmbed(id: string): MessageEmbed {

        const poll = this.getPoll(id);

        if (!poll) return undefined;

        const embed = poll.buildPollEmbed();

        poll.addOptionFields(embed);

        embed.setFooter(`ID: ${id}`)
            .setAuthor('Vote Bot')
            .setDescription(embed.description + '\n\nUse 🗑️ to clear your vote(s).\n');

        return embed;

    }

    /**
     * The currently used IDs.
     */
    private liveIDs: Array<string> = [];

    /**
     * Generates a unique 5-character ID for a poll.
     * 
     * @returns a 5-character lowercase string
     */
    private generateID(): string {
        var id = '';
        do {
            const chars = 'abcdefghijklmnopqrstuvwxyz';
            for (let i = 0; i < 5; i++) {
                id += chars[Math.floor(26 * Math.random())];
            }
        } while (this.liveIDs.includes(id));

        this.liveIDs.push(id);
        return id;
    }

}