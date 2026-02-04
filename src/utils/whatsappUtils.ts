export const CONTACT_NUMBER = '917744009295';

/**
 * Generates a WhatsApp URL with the given message.
 * @param message - The message to pre-fill in the chat.
 * @returns The formatted WhatsApp URL.
 */
export const getWhatsAppUrl = (message?: string): string => {
    const baseUrl = `https://wa.me/${CONTACT_NUMBER}`;
    if (!message) return baseUrl;
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
};

/**
 * Opens WhatsApp chat in a new tab with the given message.
 * @param message - The message to pre-fill in the chat.
 */
export const openWhatsApp = (message?: string): void => {
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank');
};
