import { MessageReaction } from 'discord.js';

const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

export function convertNumberToEmoji(num: number): string {
    return alphabet[num];
}

export function convertEmojiToNumber(emoji: string): number {
    for (let i = 0; i < 26; i++) {
        if (alphabet[i] == emoji) {
            return i;
        }
    }
}

/**
 * Returns whether or not the reaction is a trash emoji.
 * 
 * @param messageReaction the MessageReaction object
 */
export function isTrashEmoji(messageReaction: MessageReaction): boolean {
    return messageReaction.emoji.name == '🗑️';
}