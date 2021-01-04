import { Message, MessageEmbed, MessageReaction } from "discord.js";
import { Poll } from "./poll";
import { convertEmojiToNumber, isTrashEmoji } from '../tools';

export class ApprovalPoll extends Poll {

    counts: Map<string, Array<string>>;

    constructor(title: string, options: Array<string>) {
        super(title, options);

        this.clearCounts();
    }

    private clearCounts(id?: string): void {
        if (id) {
            for (const option of this.options) {
                this.counts.set(option, this.counts.get(option).filter(v => v != id));
            }
        } else {
            this.counts = new Map<string, Array<string>>();
            for (const option of this.options) {
                this.counts.set(option, []);
            }
        }
    }

    buildPollEmbed(): MessageEmbed {
        const embed = new MessageEmbed();

        embed.setTitle(this.title)
            .setDescription('Vote for as many options as you want.')
            .setColor('#ffff00');

        return embed;
    }

    buildResultsEmbed(): MessageEmbed {
        const embed = new MessageEmbed();

        embed.setTitle(`Results for **${this.title}**`)
            .setAuthor('Vote Bot')
            .setColor('#ffff00');

        this.counts.forEach((voters, option) => {
            embed.addField(`${option}: ${voters.length} vote${voters.length == 1 ? '' : 's'}`, '\u200b');
        });

        return embed;
    }

    onReactionAdd(message: Message, messageReaction: MessageReaction, userID: string): void {

        if (isTrashEmoji(messageReaction)) {
            // clear counts
            this.clearCounts(userID);

            this.updateResultsMessage();
        } else {
            const num = convertEmojiToNumber(messageReaction.emoji.name);
    
            if (num != undefined) {
                if (!this.counts.get(this.options[num]).includes(userID)) {
                    this.counts.get(this.options[num]).push(userID);
                }

                this.updateResultsMessage();
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