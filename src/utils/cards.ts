import type { Tables } from "../database.types";

/**
 * Padding card number as XXX with leading zeros
 * @see getCardSetNumber
 * @deprecated
 */
export function formatCardNumber(cardNumber: number): string {
    return cardNumber.toString().padStart(3, "0");
}

/**
 * Extract set code and card number from public code, which is in the format "SFD-227\/221"
 */
export function getCardSetNumber(publicCode: string): { set: string; number: string } | null {
    const [code] = publicCode.split("/");
    if (!code) return null;
    const [set, number] = code.split("-");
    if (!set || !number) return null;
    return { set, number };
}

// Split card name into string of words with max 12 characters each, to avoid overflow in the card list
// If are only 2 words, always split
export function splitCardName(name: string): string[] {
    const words = name.replaceAll(",", "").split(" ");
    const lines: string[] = [];
    let currentLine = "";

    if (words.length <= 2) {
        return words;
    }

    for (const word of words) {
        if (`${currentLine} ${word}`.trim().length <= 12) {
            currentLine += (currentLine ? " " : "") + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}
