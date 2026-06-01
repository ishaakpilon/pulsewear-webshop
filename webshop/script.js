const products = [
  {
    id: "sun-runner",
    name: "Sun Runner Training Set",
    season: "summer",
    price: 89.95,
    tag: "Ademend",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Lichte performance set met shirt en short voor warme trainingsdagen.",
    image: "assets/sun-runner-main.png",
    gallery: ["assets/sun-runner-main.png", "assets/sun-runner-detail.png", "assets/sun-runner-lifestyle.png"],
  },
  {
    id: "court-flow",
    name: "Court Flow Hoodie",
    season: "summer",
    price: 74.95,
    tag: "Street sport",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Zachte oversized hoodie voor cooling down, reizen en dagelijks gebruik.",
    image: "assets/court-flow-main.png",
    gallery: ["assets/court-flow-main.png", "assets/court-flow-detail.png", "assets/court-flow-lifestyle.png"],
  },
  {
    id: "heatwave",
    name: "Heatwave Sneakers",
    season: "summer",
    price: 119.95,
    tag: "Snel",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    description: "Lichte hardloopsneakers met mesh bovenwerk en gripvaste zool.",
    image: "assets/heatwave-main.png",
    gallery: ["assets/heatwave-main.png", "assets/heatwave-detail.png", "assets/heatwave-lifestyle.png"],
  },
  {
    id: "aqua-flex",
    name: "Aqua Flex Tee",
    season: "summer",
    price: 44.95,
    tag: "Cooling",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Technisch sportshirt met ademende mesh en sneldrogende afwerking.",
    image: "assets/aqua-flex-main.png",
    gallery: ["assets/aqua-flex-main.png", "assets/aqua-flex-detail.png", "assets/aqua-flex-lifestyle.png"],
  },
  {
    id: "ice-guard",
    name: "Ice Guard Jacket",
    season: "winter",
    price: 149.95,
    tag: "Warm",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Geisoleerde trainingsjas met hoge kraag en windbestendige buitenlaag.",
    image: "assets/ice-guard-main.png",
    gallery: ["assets/ice-guard-main.png", "assets/ice-guard-detail.png", "assets/ice-guard-lifestyle.png"],
  },
  {
    id: "thermal-pro",
    name: "Thermal Pro Tight",
    season: "winter",
    price: 69.95,
    tag: "Thermo",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Thermische running tight met stretch, platte naden en reflectiedetails.",
    image: "assets/thermal-pro-main.png",
    gallery: ["assets/thermal-pro-main.png", "assets/thermal-pro-detail.png", "assets/thermal-pro-lifestyle.png"],
  },
  {
    id: "snow-pace",
    name: "Snow Pace Beanie",
    season: "winter",
    price: 29.95,
    tag: "Accessoire",
    sizes: ["One size"],
    description: "Ribgebreide sportmuts met warme pasvorm voor koude ochtenden.",
    image: "assets/snow-pace-main.png",
    gallery: ["assets/snow-pace-main.png", "assets/snow-pace-detail.png", "assets/snow-pace-lifestyle.png"],
  },
  {
    id: "frost-core",
    name: "Frost Core Gloves",
    season: "winter",
    price: 34.95,
    tag: "Grip",
    sizes: ["S", "M", "L", "XL"],
    description: "Gevoerde trainingshandschoenen met gripvlak voor fiets en outdoortraining.",
    image: "assets/frost-core-main.png",
    gallery: ["assets/frost-core-main.png", "assets/frost-core-detail.png", "assets/frost-core-lifestyle.png"],
  },
];

const paymentMethods = [
  { label: "iDEAL", className: "ideal" },
  { label: "VISA", className: "visa" },
  { label: "Mastercard", className: "mastercard" },
  { label: "PayPal", className: "paypal" },
  { label: "Klarna", className: "klarna" },
];
const cart = new Map();
let activeSeason = "summer";
let activeProductId = null;
let zoomed = false;

const productGrid = document.querySelector("#productGrid");
const cartPanel = document.querySelector("#cartPanel");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const subtotal = document.querySelector("#subtotal");
const shipping = document.querySelector("#shipping");
const vat = document.querySelector("#vat");
const total = document.querySelector("#total");
const paymentStrip = document.querySelector("#paymentStrip");
const checkoutMessage = document.querySelector("#checkoutMessage");
const productModal = document.querySelector("#productModal");
const detailImage = document.querySelector("#detailImage");
const detailThumbs = document.querySelector("#detailThumbs");
const detailSizes = document.querySelector("#detailSizes");

const seasonCopy = {
  summer: {
    label: "Zomer editie",
    title: "Licht, snel en klaar voor zon.",
    text: "Ademende stoffen, frisse kleuren en comfortabele pasvormen voor training en dagelijks gebruik.",
  },
  winter: {
    label: "Winter editie",
    title: "Warm, scherp en gebouwd voor kou.",
    text: "Thermo lagen, gewatteerde jassen en accessoires voor sportieve winterdagen.",
  },
};

function money(value) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(value);
}

function cartKey(productId, size) {
  return `${productId}::${size}`;
}

function getCartMath() {
  const items = [...cart.values()];
  const subtotalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingAmount = subtotalAmount === 0 || subtotalAmount >= 100 ? 0 : 4.95;
  const totalAmount = subtotalAmount + shippingAmount;
  const vatAmount = totalAmount - totalAmount / 1.21;
  return { subtotalAmount, shippingAmount, totalAmount, vatAmount };
}

function renderProducts() {
  productGrid.innerHTML = "";
  products
    .filter((product) => product.season === activeSeason)
    .forEach((product, index) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.style.setProperty("--delay", `${index * 90}ms`);
      card.innerHTML = `
        <button class="product-image ${product.season}" type="button" data-view="${product.id}" aria-label="Bekijk ${product.name}">
          <img src="${product.image}" alt="${product.name}" />
          <span>${product.tag}</span>
        </button>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="size-preview" aria-label="Beschikbare maten">${product.sizes.map((size) => `<span>${size}</span>`).join("")}</div>
          <div class="buy-row">
            <strong>${money(product.price)}</strong>
            <button type="button" data-view="${product.id}">Bekijk</button>
          </div>
        </div>
      `;
      productGrid.append(card);
    });
}

function renderPayments() {
  if (!paymentStrip) return;
  paymentStrip.innerHTML = paymentMethods
    .map((method) =>
      method.className === "mastercard"
        ? `<span class="pay-logo mastercard"><span></span><span></span> ${method.label}</span>`
        : `<span class="pay-logo ${method.className}">${method.label}</span>`,
    )
    .join("");
}

function updateSeason(season) {
  activeSeason = season;
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.season === season);
  });
  document.body.dataset.season = season;
  document.querySelector("#seasonLabel").textContent = seasonCopy[season].label;
  document.querySelector("#seasonTitle").textContent = seasonCopy[season].title;
  document.querySelector("#seasonText").textContent = seasonCopy[season].text;
  renderProducts();
}

function cartQuantity() {
  return [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
}

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.size === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Je winkelwagen is nog leeg.</p>`;
  }

  cart.forEach(({ product, quantity, size }) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <h3>${product.name}</h3>
        <p>Maat ${size} - ${money(product.price)} per stuk</p>
        <strong>${money(product.price * quantity)}</strong>
      </div>
      <div class="quantity">
        <button type="button" data-minus="${product.id}" data-size="${size}">-</button>
        <span>${quantity}</span>
        <button type="button" data-plus="${product.id}" data-size="${size}">+</button>
      </div>
    `;
    cartItems.append(row);
  });

  const math = getCartMath();
  cartCount.textContent = cartQuantity();
  subtotal.textContent = money(math.subtotalAmount);
  shipping.textContent = math.shippingAmount === 0 ? "Gratis" : money(math.shippingAmount);
  vat.textContent = money(math.vatAmount);
  total.textContent = money(math.totalAmount);
}

function selectedSize() {
  return detailSizes.querySelector("input:checked")?.value;
}

function addToCart(id, size, shouldOpenCart = true) {
  const product = products.find((item) => item.id === id);
  if (!product || !size) return;
  const key = cartKey(id, size);
  const current = cart.get(key);
  cart.set(key, { product, size, quantity: current ? current.quantity + 1 : 1 });
  renderCart();
  if (shouldOpenCart) openCart();
}

function changeQuantity(id, size, change) {
  const key = cartKey(id, size);
  const item = cart.get(key);
  if (!item) return;
  const nextQuantity = item.quantity + change;
  if (nextQuantity <= 0) {
    cart.delete(key);
  } else {
    cart.set(key, { ...item, quantity: nextQuantity });
  }
  renderCart();
}

function openCart() {
  closeProductModal();
  cartPanel.classList.add("open");
  overlay.classList.add("show");
}

function closeCart() {
  cartPanel.classList.remove("open");
  if (!productModal.classList.contains("open")) overlay.classList.remove("show");
}

function openProductModal(id) {
  const product = products.find((item) => item.id === id);
  activeProductId = id;
  zoomed = false;
  document.querySelector("#detailSeason").textContent = product.season === "summer" ? "Zomer editie" : "Winter editie";
  document.querySelector("#detailName").textContent = product.name;
  document.querySelector("#detailDescription").textContent = product.description;
  document.querySelector("#detailPrice").textContent = money(product.price);
  detailImage.src = product.image;
  detailImage.alt = product.name;
  detailImage.classList.remove("zoomed");
  detailSizes.innerHTML = product.sizes
    .map(
      (size, index) => `
        <label>
          <input type="radio" name="size" value="${size}" ${index === 0 ? "checked" : ""} />
          <span>${size}</span>
        </label>
      `,
    )
    .join("");
  detailThumbs.innerHTML = product.gallery
    .map(
      (image, index) => `
        <button class="${index === 0 ? "active" : ""}" type="button" data-image="${image}" aria-label="Foto ${index + 1} van ${product.name}">
          <img src="${image}" alt="" />
        </button>
      `,
    )
    .join("");
  productModal.classList.add("open");
  productModal.setAttribute("aria-hidden", "false");
  overlay.classList.add("show");
}

function closeProductModal() {
  productModal.classList.remove("open");
  productModal.setAttribute("aria-hidden", "true");
  if (!cartPanel.classList.contains("open")) overlay.classList.remove("show");
}

function selectedPayment() {
  return document.querySelector('input[name="payment"]:checked')?.parentElement.textContent.trim() || "iDEAL";
}

function placeOrderRequest() {
  if (cart.size === 0) {
    checkoutMessage.textContent = "Voeg eerst een product toe aan je winkelwagen.";
    return;
  }

  const orderLines = [...cart.values()]
    .map(({ product, quantity, size }) => `${quantity}x ${product.name} maat ${size}`)
    .join(", ");
  const math = getCartMath();
  const subject = encodeURIComponent("Bestelaanvraag PulseWear");
  const body = encodeURIComponent(
    `Hallo,\n\nIk wil graag deze bestelling plaatsen:\n${orderLines}\n\nTotaal: ${money(math.totalAmount)}\nBetaalvoorkeur: ${selectedPayment()}\n\nMijn naam:\nAdres:\nTelefoon:\n\nGroet,`,
  );

  window.location.href = `mailto:ishaa.k@live.com?subject=${subject}&body=${body}`;
  checkoutMessage.textContent = "Je e-mailprogramma is geopend om de bestelaanvraag te versturen.";
}

document.querySelector("#cartToggle").addEventListener("click", openCart);
document.querySelector("#cartClose").addEventListener("click", closeCart);
document.querySelector("#modalClose").addEventListener("click", closeProductModal);
overlay.addEventListener("click", () => {
  closeCart();
  closeProductModal();
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => updateSeason(tab.dataset.season));
});

productGrid.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) openProductModal(viewButton.dataset.view);
});

cartItems.addEventListener("click", (event) => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  if (plus) changeQuantity(plus.dataset.plus, plus.dataset.size, 1);
  if (minus) changeQuantity(minus.dataset.minus, minus.dataset.size, -1);
});

detailThumbs.addEventListener("click", (event) => {
  const thumb = event.target.closest("[data-image]");
  if (!thumb) return;
  detailThumbs.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
  thumb.classList.add("active");
  detailImage.src = thumb.dataset.image;
});

document.querySelector("#detailAdd").addEventListener("click", () => {
  if (activeProductId) addToCart(activeProductId, selectedSize());
});

document.querySelector("#detailZoom").addEventListener("click", () => {
  zoomed = !zoomed;
  detailImage.classList.toggle("zoomed", zoomed);
});

document.querySelector("#checkoutButton").addEventListener("click", placeOrderRequest);

renderPayments();
updateSeason("summer");
renderCart();
