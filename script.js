// secret.js is loaded first, so apiKey is available here

// Grab UI elements once so we can reuse them
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatWindow = document.getElementById('chatWindow');
const sendButton = document.getElementById('sendButton');

// Keep a clear assistant behavior for consistent responses
const systemPrompt =
  'Healthy, radiant skin relies on a consistent routine tailored to individual skin types-oily, dry, combination, or sensitive-and specific concerns such as fine lines, uneven tone, or breakouts. Current best practices emphasize gentle cleansing, targeted treatments with active ingredients, daily sun protection, and appropriate moisturization. Layering products from lightest to heaviest consistency ensures optimal absorption and efficacy while minimizing irritation risks. L\'Oreal\'s skincare portfolio, backed by dermatological research, addresses diverse needs through lines like Revitalift (anti-aging and firming with Pro-Retinol and hyaluronic acid), Hydra Genius (lightweight hydration for various skin types), and Pure-Clay (detoxifying masks for deep cleansing). Their formulations incorporate scientifically proven actives such as vitamin C, retinoids, salicylic acid, and antioxidants, making them suitable for addressing multiple concerns when used appropriately. Safety and efficacy hinge on choosing products aligned with skin\'s tolerance and concerns, introducing potent actives gradually, and maintaining consistent sun protection. For makeup, L\'Oreal\'s Infallible and True Match ranges deliver long-lasting wear and complexion-enhancing results while complementing well-prepped skin. Thoughtful integration of skincare and makeup ensures both immediate aesthetic benefits and long-term skin health. ### Professional Recommendations 1. Cleanser: L\'Oreal Paris Revitalift Radiant Smoothing Cream Cleanser for normal to dry skin, or L\'Oreal Pure-Clay Cleanser for oily/combination skin to gently remove impurities. 2. Toner/Prep Step: Use L\'Oreal HydraFresh Toner to refresh and prep the skin for better product absorption. 3. Treatment/Serum: For anti-aging, L\'Oreal Revitalift Derm Intensives 1.5% Pure Hyaluronic Acid Serum hydrates and plumps. For brightening, Revitalift Derm Intensives 10% Pure Vitamin C Serum targets dullness and uneven tone. 4. Moisturizer: Select L\'Oreal Hydra Genius Daily Liquid Care for lightweight hydration or Revitalift Triple Power Anti-Aging Moisturizer for richer nourishment. 5. Sun Protection: Apply L\'Oreal Age Perfect Cell Renewal Rosy Tone SPF 30 Day Cream every morning to protect against UV damage.';

// Small helper to prevent HTML from being injected into the chat
function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Add a message bubble to the chat window
function addMessage(role, text) {
  const bubbleClass = role === 'user' ? 'message-user' : 'message-ai';

  chatWindow.insertAdjacentHTML(
    'beforeend',
    `<div class="message messagediv ${bubbleClass}"><p>${escapeHtml(text)}</p></div>`
  );

  // Always keep the latest message visible
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Update button state while waiting for the API response
function setLoadingState(isLoading) {
  sendButton.disabled = isLoading;
  sendButton.textContent = isLoading ? 'Thinking...' : 'Send';
}

// Send user text to OpenAI and return only the assistant text
async function getAiText(userMessage) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return `Request failed: ${result?.error?.message || 'Unknown API error'}`;
    }

    return result?.choices?.[0]?.message?.content || 'No response text returned.';
  } catch (error) {
    return `Request failed: ${error.message}`;
  }
}

// When the form is submitted, send user text and print AI response
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const messageText = userInput.value.trim();

  if (messageText === '') {
    return;
  }

  addMessage('user', messageText);
  userInput.value = '';
  setLoadingState(true);

  const aiText = await getAiText(messageText);
  addMessage('ai', aiText);

  // Keep Prompt 1 behavior: log only the AI text response
  console.log(aiText);

  setLoadingState(false);
  userInput.focus();
});