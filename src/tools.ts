export function convertNumberToEmoji(num: number): string {
    switch (num) {
        case 0:
            return '0️⃣';
        case 1:
            return '1️⃣';
        case 2:
            return '2️⃣';
        case 3:
            return '3️⃣';
        case 4:
            return '4️⃣';
        case 5:
            return '5️⃣';
        case 6:
            return '6️⃣';
        case 7:
            return '7️⃣';
        case 8:
            return '8️⃣';
        case 9:
            return '9️⃣';
        case 10:
            return '🔟';
        default:
            return undefined;
    }
}

export function convertEmojiToNumber(emoji: string): number {
    switch (emoji) {
        case '0️⃣':
            return 0;
        case '1️⃣':
            return 1;
        case '2️⃣':
            return 2;
        case '3️⃣':
            return 3;
        case '4️⃣':
            return 4;
        case '5️⃣':
            return 5;
        case '6️⃣':
            return 6;
        case '7️⃣':
            return 7;
        case '8️⃣':
            return 8;
        case '9️⃣':
            return 9;
        case '🔟':
            return 10;
        default:
            return undefined;
    }
}