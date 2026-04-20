// secret.js is loaded first, so proxyUrl is available here

const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatWindow = document.getElementById('chatWindow');
const sendButton = document.getElementById('sendButton');
const productGrid = document.getElementById('productGrid');
const selectedProductsSummary = document.getElementById('selectedProductsSummary');
const categoryFilter = document.getElementById('categoryFilter');
const SELECTED_PRODUCTS_KEY = 'skinCoachSelectedProductsV1';
window.proxyUrl = 'https://mogger.ifrias12.workers.dev/';
const systemPrompt =
  "Healthy, radiant skin relies on a consistent routine tailored to individual skin types-oily, dry, combination, or sensitive-and specific concerns such as fine lines, uneven tone, or breakouts. Current best practices emphasize gentle cleansing, targeted treatments with active ingredients, daily sun protection, and appropriate moisturization. Layering products from lightest to heaviest consistency ensures optimal absorption and efficacy while minimizing irritation risks. L'Oreal's skincare portfolio, backed by dermatological research, addresses diverse needs through lines like Revitalift (anti-aging and firming with Pro-Retinol and hyaluronic acid), Hydra Genius (lightweight hydration for various skin types), and Pure-Clay (detoxifying masks for deep cleansing). Their formulations incorporate scientifically proven actives such as vitamin C, retinoids, salicylic acid, and antioxidants, making them suitable for addressing multiple concerns when used appropriately. Safety and efficacy hinge on choosing products aligned with skin's tolerance and concerns, introducing potent actives gradually, and maintaining consistent sun protection. For makeup, L'Oreal's Infallible and True Match ranges deliver long-lasting wear and complexion-enhancing results while complementing well-prepped skin. Thoughtful integration of skincare and makeup ensures both immediate aesthetic benefits and long-term skin health. ### Professional Recommendations 1. Cleanser: L'Oreal Paris Revitalift Radiant Smoothing Cream Cleanser for normal to dry skin, or L'Oreal Pure-Clay Cleanser for oily/combination skin to gently remove impurities. 2. Toner/Prep Step: Use L'Oreal HydraFresh Toner to refresh and prep the skin for better product absorption. 3. Treatment/Serum: For anti-aging, L'Oreal Revitalift Derm Intensives 1.5% Pure Hyaluronic Acid Serum hydrates and plumps. For brightening, Revitalift Derm Intensives 10% Pure Vitamin C Serum targets dullness and uneven tone. 4. Moisturizer: Select L'Oreal Hydra Genius Daily Liquid Care for lightweight hydration or Revitalift Triple Power Anti-Aging Moisturizer for richer nourishment. 5. Sun Protection: Apply L'Oreal Age Perfect Cell Renewal Rosy Tone SPF 30 Day Cream every morning to protect against UV damage. If not related to these topic will refuse to answer due to it not being on topic, dont even aknowldge or give advice to where to get that topic. ONLY ANSWERS TOPICS RELATRED TO skin care ect .";

const productCatalog = [
  {
    id: 'revitalift-cleanser',
    title: 'Revitalift Cream Cleanser',
    category: 'Cleanser',
    description: 'Gentle cleanser for daily makeup and impurity removal.'
  },
  {
    id: 'pure-clay-cleanser',
    title: 'Pure-Clay Cleanser',
    category: 'Cleanser',
    description: 'Deep-cleansing gel wash for oily and combination skin.'
  },
  {
    id: 'glycolic-cleanser',
    title: 'Revitalift Glycolic Cleanser',
    category: 'Cleanser',
    description: 'Exfoliating cleanser that helps smooth rough texture.'
  },
  {
    id: 'vitamin-c',
    title: 'Revitalift 10% Vitamin C Serum',
    category: 'Serum',
    description: 'Brightening serum for dullness and uneven tone.'
  },
  {
    id: 'hyaluronic',
    title: 'Revitalift Hyaluronic Serum',
    category: 'Serum',
    description: 'Hydrating serum that helps plump and smooth skin.'
  },
  {
    id: 'moisturizer',
    title: 'Hydra Genius Moisturizer',
    category: 'Moisturizer',
    description: 'Lightweight hydration for normal to dry skin.'
  },
  {
    id: 'retinol',
    title: 'Revitalift Retinol Night Serum',
    category: 'Serum',
    description: 'Night treatment to support smoother-looking skin.'
  },
  {
    id: 'sunscreen',
    title: 'Bright Reveal SPF 50 UV Fluid',
    category: 'Sunscreen',
    description: 'Daily broad-spectrum sun protection with light finish.'
  },
  {
    id: 'midnight-serum',
    title: 'Age Perfect Midnight Serum',
    category: 'Serum',
    description: 'Antioxidant-rich overnight serum for renewed-looking skin.'
  },
  {
    id: 'triple-power-moisturizer',
    title: 'Revitalift Triple Power Moisturizer',
    category: 'Moisturizer',
    description: 'Daily moisturizer focused on firmness and radiance.'
  },
  {
    id: 'collagen-moisture-filler',
    title: 'Collagen Moisture Filler Cream',
    category: 'Moisturizer',
    description: 'Richer cream designed for dry skin hydration support.'
  },
  {
    id: 'age-perfect-spf30',
    title: 'Age Perfect Rosy Tone SPF 30',
    category: 'Sunscreen',
    description: 'Moisturizer plus SPF protection for daytime use.'
  },
  {
    id: 'eye-defense',
    title: 'Eye Defense Eye Cream',
    category: 'Eye Care',
    description: 'Lightweight eye cream for puffiness and fine lines.'
  },
  {
    id: 'triple-power-eye',
    title: 'Revitalift Triple Power Eye Treatment',
    category: 'Eye Care',
    description: 'Eye-area treatment for firmness and smoother texture.'
  },
  {
    id: 'hydrafresh-toner',
    title: 'HydraFresh Toner',
    category: 'Toner',
    description: 'Refreshing prep step that helps skin absorb follow-up products.'
  },
  {
    id: 'pure-clay-mask',
    title: 'Pure-Clay Detox Mask',
    category: 'Mask',
    description: 'Clay mask to reduce excess oil and clear pore buildup.'
  },
  {
    id: 'glow-mask',
    title: 'Pure-Clay Glow Mask',
    category: 'Mask',
    description: 'Exfoliating clay treatment for smoother, brighter skin.'
  }
];

const selectedProductIds = new Set();
let activeCategory = 'none';

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

function saveSelectedProducts() {
  try {
    localStorage.setItem(SELECTED_PRODUCTS_KEY, JSON.stringify(Array.from(selectedProductIds)));
  } catch {
    // Ignore storage failures (private mode, quota limits, etc.)
  }
}

function restoreSelectedProducts() {
  try {
    const rawValue = localStorage.getItem(SELECTED_PRODUCTS_KEY);

    if (!rawValue) {
      return;
    }

    const parsedIds = JSON.parse(rawValue);

    if (!Array.isArray(parsedIds)) {
      return;
    }

    const validProductIds = new Set(productCatalog.map((product) => product.id));

    for (const productId of parsedIds) {
      if (typeof productId !== 'string') {
        continue;
      }

      if (!validProductIds.has(productId)) {
        continue;
      }

      selectedProductIds.add(productId);
    }
  } catch {
    // Ignore malformed values.
  }
}

function getSelectedProducts() {
  return productCatalog.filter((product) => selectedProductIds.has(product.id));
}

function getProductCategories() {
  return Array.from(new Set(productCatalog.map((product) => product.category))).sort();
}

function getVisibleProducts() {
  if (activeCategory === 'none') {
    return [];
  }

  if (activeCategory === 'all') {
    return productCatalog;
  }

  return productCatalog.filter((product) => product.category === activeCategory);
}

function renderCategoryOptions() {
  if (!categoryFilter) {
    return;
  }

  const categories = getProductCategories();

  categoryFilter.innerHTML = [
    '<option value="none">Choose Category</option>',
    '<option value="all">All Categories</option>',
    ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
  ].join('');

  categoryFilter.value = activeCategory;
}

function renderSelectedProductsSummary() {
  if (!selectedProductsSummary) {
    return;
  }

  const selectedProducts = getSelectedProducts();
  selectedProductsSummary.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'selected-products-label';
  label.textContent = 'Selected products:';
  selectedProductsSummary.appendChild(label);

  if (!selectedProducts.length) {
    const emptyState = document.createElement('span');
    emptyState.className = 'selected-products-empty';
    emptyState.textContent = 'None';
    selectedProductsSummary.appendChild(emptyState);
    return;
  }

  for (const product of selectedProducts) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'selected-chip selected-chip-button';
    chip.dataset.removeProductId = product.id;
    chip.setAttribute('aria-label', `Remove ${product.title}`);
    chip.textContent = `${product.title} x`;
    selectedProductsSummary.appendChild(chip);
  }

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'selected-clear-button';
  clearButton.dataset.action = 'clear-selected-products';
  clearButton.textContent = 'Clear All';
  selectedProductsSummary.appendChild(clearButton);
}

function setCardSelectedState(cardElement, isSelected) {
  cardElement.classList.toggle('is-selected', isSelected);
  cardElement.setAttribute('aria-pressed', String(isSelected));
}

function toggleProductSelection(cardElement) {
  const productId = cardElement.dataset.productId || '';

  if (!productId) {
    return;
  }

  if (selectedProductIds.has(productId)) {
    selectedProductIds.delete(productId);
  } else {
    selectedProductIds.add(productId);
  }

  setCardSelectedState(cardElement, selectedProductIds.has(productId));
  saveSelectedProducts();
  renderSelectedProductsSummary();
}

function renderProductCards() {
  if (!productGrid) {
    return;
  }

  const visibleProducts = getVisibleProducts();

  if (!visibleProducts.length) {
    const emptyMessage = activeCategory === 'none'
      ? 'Choose a category to see products.'
      : 'No products in this category yet.';

    productGrid.innerHTML = `<p class="catalog-empty">${emptyMessage}</p>`;
    return;
  }

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => {
        const isSelected = selectedProductIds.has(product.id);

        return `<button class="catalog-card${isSelected ? ' is-selected' : ''}" type="button" data-product-id="${escapeHtml(product.id)}" aria-pressed="${isSelected}">
          <span class="catalog-title">${escapeHtml(product.title)}</span>
          <span class="catalog-meta">${escapeHtml(product.category)}</span>
          <span class="catalog-description">${escapeHtml(product.description)}</span>
        </button>`;
      }
    )
    .join('');
}

function setupProductSelection() {
  if (!productGrid) {
    return;
  }

  productGrid.addEventListener('click', (event) => {
    const cardElement = event.target.closest('.catalog-card');

    if (!cardElement || !productGrid.contains(cardElement)) {
      return;
    }

    toggleProductSelection(cardElement);
  });
}

function setupCategoryFilter() {
  if (!categoryFilter) {
    return;
  }

  categoryFilter.addEventListener('change', () => {
    activeCategory = categoryFilter.value;
    renderProductCards();
  });
}

function setupSelectedProductsControls() {
  if (!selectedProductsSummary) {
    return;
  }

  selectedProductsSummary.addEventListener('click', (event) => {
    const removeButton = event.target.closest('[data-remove-product-id]');

    if (removeButton && selectedProductsSummary.contains(removeButton)) {
      const productId = removeButton.dataset.removeProductId || '';

      if (!productId) {
        return;
      }

      selectedProductIds.delete(productId);
      saveSelectedProducts();
      renderProductCards();
      renderSelectedProductsSummary();
      return;
    }

    const clearButton = event.target.closest('[data-action="clear-selected-products"]');

    if (!clearButton || !selectedProductsSummary.contains(clearButton)) {
      return;
    }

    selectedProductIds.clear();
    saveSelectedProducts();
    renderProductCards();
    renderSelectedProductsSummary();
  });
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

function buildChatMessages(userMessage) {
  const selectedProducts = getSelectedProducts();
  const hasSelectedProducts = selectedProducts.length > 0;

  if (!hasSelectedProducts) {
    return [
      { role: 'system', content: systemPrompt },
      {
        role: 'system',
        content: 'No products are selected. Provide skin care guidance that stays on-topic.'
      },
      { role: 'user', content: userMessage }
    ];
  }

  const selectedProductLines = selectedProducts.map(
    (product, index) => `${index + 1}. ${product.title} (${product.category}) - ${product.description}`
  );

  const contextualUserMessage = [
    userMessage,
    '',
    'Selected products to prioritize in my routine:',
    ...selectedProductLines,
    '',
    'Please mention these selected products by name when relevant.'
  ].join('\n');

  return [
    { role: 'system', content: systemPrompt },
    {
      role: 'system',
      content:
        'When selected products are provided, prioritize those products first and explicitly mention their exact names in the final recommendation.'
    },
    { role: 'user', content: contextualUserMessage }
  ];
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
        messages: buildChatMessages(userMessage)
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

restoreSelectedProducts();
renderCategoryOptions();
renderProductCards();
setupProductSelection();
setupCategoryFilter();
setupSelectedProductsControls();
renderSelectedProductsSummary();

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