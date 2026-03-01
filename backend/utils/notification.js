exports.sendWhatsAppNotification = async (phoneNumber, message) => {
    // Mock the WhatsApp Business API call
    console.log(`[MOCK WHATSAPP] Sending message to ${phoneNumber}: "${message}"`);
    return { success: true, messageId: 'mock-12345' };
};
