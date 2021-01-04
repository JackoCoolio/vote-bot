import { Message, MessageEmbed, MessageReaction } from "discord.js";
import { Poll } from "./poll";
import { convertEmojiToNumber, isTrashEmoji } from '../tools';

export class SimplePoll extends Poll {

    /**
     * Map from user ID to option index.
     */
    voters: Map<string, number>;

    constructor(title: string, options: Array<string>) {
        super(title, options);

        this.voters = new Map<string, number>();
    }

    buildPollEmbed(): MessageEmbed {
        const embed = new MessageEmbed().setTitle(this.title)
            .setDescription('Vote for one option.')
            .setColor('#689bed');

        return embed;
    }

    buildResultsEmbed(): MessageEmbed {

        const embed = new MessageEmbed()
            .setTitle(`Results for **${this.title}**`)
            .setAuthor('Vote Bot')
            .setColor('#ffff00');

        const counts = new Map<string, number>();
        for (const option of this.options)
            counts.set(option, 0);

        this.voters.forEach(vote => {
            const option = this.options[vote];

            counts.set(option, counts.get(option) + 1);
        });

        counts.forEach((numVotes, option) => {
            embed.addField(`${option}: ${numVotes} vote${numVotes == 1 ? '' : 's'}`, '\u200b');
        });

        return embed;

    }

    onReactionAdd(message: Message, messageReaction: MessageReaction, userID: string): void {

        if (isTrashEmoji(messageReaction)) {
            this.voters.delete(userID);
        } else {
            const vote = convertEmojiToNumber(messageReaction.emoji.name);

            if (vote != undefined) {
                this.voters.set(userID, vote);
            }
        }

        message.guild.members.fetch(userID).then(user => {
            messageReaction.users.remove(user);
        }).catch(console.error);

        if (this.resultsMessage) {
            this.resultsMessage.edit(this.buildResultsEmbed()).catch(console.error);
        }

    }

}