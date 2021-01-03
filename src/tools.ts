const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿' ];

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