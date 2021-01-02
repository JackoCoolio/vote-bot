/**
 * The base class for every Poll.
 */
export class Poll {

    /**
     * The title of the poll.
     */
    title: string;

    /**
     * The options for the poll.
     */
    options: Array<string>;

    /**
     * Constructs a new PollManager with the specified title and options.
     * 
     * @param title the title of the poll
     * @param options the options for the poll
     */
    constructor(title: string, options: Array<string>) {
        this.title = title;
        this.options = options;
    }

}