import { Message, MessageEmbed, MessageReaction } from 'discord.js';
import { convertNumberToEmoji } from '../tools';

/**
 * The base class for every Poll.
 */
export abstract class Poll {

    /**
     * The title of the poll.
     */
    title: string;

    /**
     * The options for the poll.
     */
    options: Array<string>;

    /**
     * The Message that displays the results of the poll.
     */
    resultsMessage: Message;

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

    getTitle(): string {
        return this.title;
    }

    getOptions(): Array<string> {
        return this.options;
    }

    getResultsMessage(): Message {
        return this.resultsMessage;
    }

    setResultsMessage(message: Message): void {
        this.resultsMessage = message;
    }

    populateReactions(message: Message) {

        message.react('🗑️').catch(console.error);

        for (let i = 0; i < this.options.length; i++) {
            message.react(convertNumberToEmoji(i)).catch(console.error);
        }
    }

    addOptionFields(embed: MessageEmbed): MessageEmbed {

        for (let i = 0; i < this.options.length; i++) {
            embed.addField(`${convertNumberToEmoji(i)}    ${this.options[i]}`, '\u200b');
        }

        return embed;
    }

    /**
     * Returns whether or not the reaction is a trash emoji.
     * 
     * @param messageReaction the MessageReaction object
     */
    protected isTrashEmoji(messageReaction: MessageReaction): boolean {
        return messageReaction.emoji.name == '🗑️';
    }

    abstract buildPollEmbed(): MessageEmbed;

    abstract buildResultsEmbed(): MessageEmbed;

    abstract onReactionAdd(message: Message, reaction: MessageReaction, userID: string): void;

}