import { MessageEmbed, Message, MessageReaction } from "discord.js";
import { convertEmojiToNumber, isTrashEmoji } from "../tools";
import { Poll } from "./poll";

export class RankedChoicePoll extends Poll {

    maxVotes: number;

    votes: Map<string, Array<number>>;

    constructor(title: string, options: Array<string>, maxVotes: number) {
        super(title, options);

        this.maxVotes = maxVotes;

        this.votes = new Map<string, Array<number>>();
    }

    buildPollEmbed(): MessageEmbed {

        const embed = new MessageEmbed()
            .setTitle(this.title)
            .setDescription(`Vote for the ${this.maxVotes} best options in order.`)
            .setColor('#f25b3d');

        return embed;

    }

    buildResultsEmbed(): MessageEmbed {

        const embed = new MessageEmbed()
            .setTitle(`Results for **${this.title}**`)
            .setAuthor('Vote Bot')
            .setColor('#f25b3d');

        const results = this.calculateRankings();
        results.forEach((result, index) => {
            // embed.addField(`${option}: ${voters.length} vote${voters.length == 1 ? '' : 's'}`, '\u200b');
            embed.addField(`**#${index + 1}**: ${this.options[result]}`, '\u200b');
        });

        return embed;
    }

    onReactionAdd(message: Message, reaction: MessageReaction, userID: string): void {

        if (isTrashEmoji(reaction)) {

            // clear votes for the given user
            this.votes.set(userID, []);

            this.updateResultsMessage();

        } else {

            if (!this.votes.has(userID)) {
                this.votes.set(userID, []);
            }

            if (this.votes.get(userID).length < this.maxVotes) {
                const num = convertEmojiToNumber(reaction.emoji.name);
                if (num != undefined) {
                    this.votes.get(userID).push(num);
                    this.updateResultsMessage();

                    console.log(this.votes);
                }
            }

        }

        message.guild.members.fetch(userID).then(user => {
            reaction.users.remove(user);
        }).catch(console.error);

    }

    private getMajorityVote(votes: Array<number>): number {

        const occurrences = new Array(this.options.length).fill(0);
        let majorityVote = undefined;

        votes.forEach(vote => {
            occurrences[vote]++;

            // someone got the majority vote
            if (occurrences[vote] / this.maxVotes > 0.5) {
                majorityVote = vote;
            }
        });

        // no majority vote was found
        return majorityVote;
    }

    calculateRankings(): Array<number> {

        const tempVotes = new Map(this.votes);

        const rankings = [];
        while (rankings.length < this.options.length) {

            // get first place votes
            let firstPlaceVotes: Array<number> = [];
            tempVotes.forEach(rankings => {
                if (rankings && rankings.length > 0)
                    firstPlaceVotes.push(rankings[0]);
            });

            // count first-place occurrences
            const occurrences = new Array(this.options.length).fill(0);
            for (const vote of firstPlaceVotes) {
                occurrences[vote]++;
            }

            // find least popular vote index
            let lowest = Infinity;
            let leastPopular = -1;
            occurrences.forEach((count, index) => {
                if (count < lowest && !rankings.includes(index)) {
                    lowest = count;
                    leastPopular = index;
                }
            });

            // remove least popular vote
            for (const id of tempVotes.keys()) {
                tempVotes.set(id, tempVotes.get(id).filter(vote => vote != leastPopular));
            }

            rankings.push(leastPopular);
        }

        rankings.reverse();

        return rankings;

    }

}
