import { Poll } from "./poll";

/**
 * Manages the active polls in a guild.
 */
export class PollManager {

    /**
     * The currently running Polls.
     */
    private polls: Map<string, Poll>;

    /**
     * The now-inactive Polls.
     */
    private inactivePolls: Map<string, Poll>;

    /**
     * Constructs a new PollManager with an empty array of Polls.
     */
    constructor() {
        this.polls = new Map<string, Poll>();
    }

    /**
     * Adds a Poll to the list of active Polls.
     * 
     * @param poll the Poll to add
     */
    addPoll(poll: Poll) {
        this.polls.set(this.generateID(), poll);
    }

    /**
     * Returns the Poll with the specified ID.
     * 
     * @param id the ID of the Poll
     */
    getPoll(id: string) {
        return this.polls.get(id);
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