// secret.js is loaded first, so proxyUrl is available here

const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatWindow = document.getElementById('chatWindow');
const sendButton = document.getElementById('sendButton');
window.proxyUrl = 'https://mogger.ifrias12.workers.dev/';
const systemPrompt =
  "Healthy, radiant skin relies on a consistent routine tailored to individual skin types-oily, dry, combination, or sensitive-and specific concerns such as fine lines, uneven tone, or breakouts. Current best practices emphasize gentle cleansing, targeted treatments with active ingredients, daily sun protection, and appropriate moisturization. Layering products from lightest to heaviest consistency ensures optimal absorption and efficacy while minimizing irritation risks. L'Oreal's skincare portfolio, backed by dermatological research, addresses diverse needs through lines like Revitalift (anti-aging and firming with Pro-Retinol and hyaluronic acid), Hydra Genius (lightweight hydration for various skin types), and Pure-Clay (detoxifying masks for deep cleansing). Their formulations incorporate scientifically proven actives such as vitamin C, retinoids, salicylic acid, and antioxidants, making them suitable for addressing multiple concerns when used appropriately. Safety and efficacy hinge on choosing products aligned with skin's tolerance and concerns, introducing potent actives gradually, and maintaining consistent sun protection. For makeup, L'Oreal's Infallible and True Match ranges deliver long-lasting wear and complexion-enhancing results while complementing well-prepped skin. Thoughtful integration of skincare and makeup ensures both immediate aesthetic benefits and long-term skin health. ### Professional Recommendations 1. Cleanser: L'Oreal Paris Revitalift Radiant Smoothing Cream Cleanser for normal to dry skin, or L'Oreal Pure-Clay Cleanser for oily/combination skin to gently remove impurities. 2. Toner/Prep Step: Use L'Oreal HydraFresh Toner to refresh and prep the skin for better product absorption. 3. Treatment/Serum: For anti-aging, L'Oreal Revitalift Derm Intensives 1.5% Pure Hyaluronic Acid Serum hydrates and plumps. For brightening, Revitalift Derm Intensives 10% Pure Vitamin C Serum targets dullness and uneven tone. 4. Moisturizer: Select L'Oreal Hydra Genius Daily Liquid Care for lightweight hydration or Revitalift Triple Power Anti-Aging Moisturizer for richer nourishment. 5. Sun Protection: Apply L'Oreal Age Perfect Cell Renewal Rosy Tone SPF 30 Day Cream every morning to protect against UV damage. If not related to these topic will refuse to answer due to it not being on topic.";

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function addMessage(role, text) {
  const bubbleClass = role === 'user' ? 'message-user' : 'message-ai';

  chatWindow.insertAdjacentHTML(
    'beforeend',
    `<div class="message messagediv ${bubbleClass}"><p>${escapeHtml(text)}</p></div>`
  );

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function setLoadingState(isLoading) {
  sendButton.disabled = isLoading;
  sendButton.textContent = isLoading ? 'Thinking...' : 'Send';
}

function getRequestConfig() {
  const configuredProxy = typeof proxyUrl === 'string' ? proxyUrl.trim() : '';

  if (!configuredProxy) {
    return {
      error: 'Request failed: Missing proxyUrl value in secret.js.'
    };
  }

  return {
    url: configuredProxy,
    headers: {
      'Content-Type': 'application/json'
    }
  };
}

async function getAiText(userMessage) {
  try {
    const requestConfig = getRequestConfig();

    if (requestConfig.error) {
      return requestConfig.error;
    }

    const response = await fetch(requestConfig.url, {
      method: 'POST',
      headers: requestConfig.headers,
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const rawText = await response.text();

    let result;
    try {
      result = JSON.parse(rawText);
    } catch {
      return `Request failed: ${rawText || 'Worker did not return JSON.'}`;
    }

    if (!response.ok) {
      return `Request failed: ${result?.error?.message || result?.message || 'Unknown API error'}`;
    }

    return result?.choices?.[0]?.message?.content || 'No response text returned.';
  } catch (error) {
    return `Request failed: ${error.message}`;
  }
}

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const messageText = userInput.value.trim();
  if (!messageText) return;

  addMessage('user', messageText);
  userInput.value = '';
  setLoadingState(true);

  const aiText = await getAiText(messageText);
  addMessage('ai', aiText);
  console.log(aiText);

  setLoadingState(false);
  userInput.focus();
});