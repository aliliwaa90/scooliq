import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, 'telegram-bot.config.json');

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function loadConfig() {
  let fileConfig = {};

  try {
    const fileContents = await readFile(configPath, 'utf8');
    fileConfig = JSON.parse(fileContents);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw new Error(`Failed to read ${configPath}: ${error.message}`);
    }
  }

  return {
    token: process.env.TELEGRAM_BOT_TOKEN ?? fileConfig.token ?? '',
    miniAppUrl: process.env.MINI_APP_URL ?? fileConfig.miniAppUrl ?? '',
    welcomeText: process.env.WELCOME_TEXT ?? fileConfig.welcomeText ?? '',
    helpText: process.env.HELP_TEXT ?? fileConfig.helpText ?? '',
  };
}

function buildWelcomeMessage(name, customText) {
  const safeName = escapeHtml(name || 'صديقنا');
  const safeCustomText = escapeHtml(
    customText || 'تم تفعيل البوت بنجاح. اضغط الزر بالاسفل لفتح المنصة.'
  );

  return `<b>اهلا ${safeName}</b>\n${safeCustomText}`;
}

function buildHelpMessage(customText) {
  const safeCustomText = escapeHtml(
    customText || 'استخدم /start لعرض الرسالة الترحيبية مرة اخرى.'
  );

  return `<b>المساعدة</b>\n${safeCustomText}`;
}

function getCommandName(text = '') {
  if (!text.startsWith('/')) {
    return null;
  }

  return text.split(/\s+/, 1)[0].split('@')[0];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildReplyMarkup(chatType, miniAppUrl) {
  if (!miniAppUrl) {
    return undefined;
  }

  if (chatType === 'private') {
    return {
      inline_keyboard: [[{ text: 'فتح التطبيق', web_app: { url: miniAppUrl } }]],
    };
  }

  return {
    inline_keyboard: [[{ text: 'فتح المنصة', url: miniAppUrl }]],
  };
}

async function main() {
  const config = await loadConfig();

  if (!config.token) {
    throw new Error(
      'Missing bot token. Create telegram-bot.config.json or set TELEGRAM_BOT_TOKEN.'
    );
  }

  if (config.miniAppUrl && !config.miniAppUrl.startsWith('https://')) {
    console.warn('Mini App URL should use HTTPS to work correctly inside Telegram.');
  }

  const apiBase = `https://api.telegram.org/bot${config.token}`;
  let offset = 0;

  async function callTelegram(method, payload = {}) {
    const response = await fetch(`${apiBase}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`${method} failed: ${JSON.stringify(data)}`);
    }

    return data.result;
  }

  async function sendMessage(chatId, text, chatType) {
    const replyMarkup = buildReplyMarkup(chatType, config.miniAppUrl);
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    };

    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }

    await callTelegram('sendMessage', payload);
  }

  async function handleMessage(message) {
    const chatId = message.chat?.id;
    const chatType = message.chat?.type ?? 'private';

    if (!chatId) {
      return;
    }

    if (Array.isArray(message.new_chat_members) && message.new_chat_members.length > 0) {
      for (const member of message.new_chat_members) {
        if (member.is_bot) {
          continue;
        }

        await sendMessage(
          chatId,
          buildWelcomeMessage(member.first_name, config.welcomeText),
          chatType
        );
      }

      return;
    }

    const command = getCommandName(message.text ?? '');
    if (command === '/start') {
      await sendMessage(
        chatId,
        buildWelcomeMessage(message.from?.first_name, config.welcomeText),
        chatType
      );
      return;
    }

    if (command === '/help') {
      await sendMessage(chatId, buildHelpMessage(config.helpText), chatType);
    }
  }

  await callTelegram('deleteWebhook', { drop_pending_updates: false });
  await callTelegram('setMyCommands', {
    commands: [
      { command: 'start', description: 'عرض رسالة الترحيب' },
      { command: 'help', description: 'عرض المساعدة' },
    ],
  });

  console.log('Telegram welcome bot is running.');

  while (true) {
    try {
      const updates = await callTelegram('getUpdates', {
        offset,
        timeout: 30,
        allowed_updates: ['message'],
      });

      for (const update of updates) {
        offset = update.update_id + 1;
        if (update.message) {
          await handleMessage(update.message);
        }
      }
    } catch (error) {
      console.error(`Polling error: ${error.message}`);
      await sleep(3000);
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
