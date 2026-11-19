
// CARROSSEL DE IMAGENS DA PÁGINA INICIAL

const slides = document.querySelectorAll(".hero-slide");

let currentSlide = 0;

function changeSlide() {

    if (slides.length === 0) return;

    slides[currentSlide].classList.remove("active");

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    slides[currentSlide].classList.add("active");
}

// Troca a imagem a cada 3,5 segundos
if (slides.length > 1) {
    setInterval(changeSlide, 3500);
}


// SACOLA DE COMPRAS

let cart = [];

const cartCount = document.getElementById("cart-count");
const addCartButtons = document.querySelectorAll(".add-cart");

const cartOverlay = document.getElementById("cart-overlay");
const openCart = document.getElementById("open-cart");
const closeCart = document.getElementById("close-cart");
const continueShopping = document.getElementById("continue-shopping");

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");

const formatPrice = value => {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
};

// ADICIONAR PRODUTOS

addCartButtons.forEach(button => {
    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const productCard = button.closest(".product-card");
        const image = productCard?.querySelector("img")?.src || "";

        const existingProduct = cart.find(item => item.name === name);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                name,
                price,
                image,
                quantity: 1
            });
        }

        updateCart();

        button.textContent = "ADICIONADO! ✓";

        setTimeout(() => {
            button.textContent = "ADICIONAR À SACOLA";
        }, 1500);
    });
});

// ATUALIZAR SACOLA

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Sua sacola está vazia.
            </p>
        `;
    }

    cart.forEach((item, index) => {

        const subtotal = item.price * item.quantity;

        total += subtotal;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${formatPrice(item.price)}</p>

                <div class="quantity-controls">
                    <button class="quantity-btn" data-action="decrease" data-index="${index}">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                </div>
            </div>

            <div class="cart-item-right">
                <strong>${formatPrice(subtotal)}</strong>
                <button class="remove-item" data-action="remove" data-index="${index}">
                    Remover
                </button>
            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(total);
}

// ALTERAR QUANTIDADE OU REMOVER PRODUTOS

cartItems.addEventListener("click", event => {

    const button = event.target.closest("[data-action]");

    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;

    if (action === "increase") {
        cart[index].quantity++;
    }

    if (action === "decrease") {
        cart[index].quantity--;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }

    if (action === "remove") {
        cart.splice(index, 1);
    }

    updateCart();
});

// ABRIR SACOLA

openCart.addEventListener("click", () => {
    cartOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
});

// FECHAR SACOLA

function closeCartModal() {
    cartOverlay.classList.remove("show");
    document.body.style.overflow = "";
}

closeCart.addEventListener("click", closeCartModal);
continueShopping.addEventListener("click", closeCartModal);

cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) {
        closeCartModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCartModal();
    }
});

// FINALIZAR COMPRA

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Sua sacola está vazia!");
        return;
    }

    alert("Sua sacola está pronta! A próxima etapa será finalizar o pedido.");
});

updateCart();



// FILTROS, BUSCA E PAGINAÇÃO DA COLEÇÃO

const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("product-search");
const productCards = document.querySelectorAll(".product-card");
const productCount = document.getElementById("product-count");
const pagination = document.getElementById("pagination");

let selectedCategory = "todos";
let currentPage = 1;

const productsPerPage = 9;

function filterProducts() {

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredProducts = Array.from(productCards).filter(card => {

        const category = card.dataset.category;
        const name = card.dataset.name.toLowerCase();

        const matchesCategory =
            selectedCategory === "todos" ||
            category === selectedCategory;

        const matchesSearch =
            name.includes(searchText);

        return matchesCategory && matchesSearch;

    });

    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    );

    // Volta para a primeira página se necessário
    if (currentPage > totalPages) {
        currentPage = 1;
    }

    // Esconde todos os produtos
    productCards.forEach(card => {
        card.style.display = "none";
    });

    // Calcula os produtos da página atual
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    const productsToShow = filteredProducts.slice(start, end);

    // Mostra somente os produtos da página atual
    productsToShow.forEach(card => {
        card.style.display = "";
    });

    // Atualiza contador
    productCount.textContent =
        `${filteredProducts.length} produto(s) encontrado(s)`;

    // Cria os números das páginas
    renderPagination(totalPages);

}

function renderPagination(totalPages) {

    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    // Botão anterior
    const previousButton = document.createElement("button");

    previousButton.textContent = "‹";
    previousButton.classList.add("page-btn");
    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener("click", () => {
        currentPage--;
        filterProducts();
    });

    pagination.appendChild(previousButton);

    // Números das páginas
    for (let i = 1; i <= totalPages; i++) {

        const pageButton = document.createElement("button");

        pageButton.textContent = i;
        pageButton.classList.add("page-btn");

        if (i === currentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", () => {
            currentPage = i;
            filterProducts();
        });

        pagination.appendChild(pageButton);

    }

    // Botão próximo
    const nextButton = document.createElement("button");

    nextButton.textContent = "›";
    nextButton.classList.add("page-btn");
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", () => {
        currentPage++;
        filterProducts();
    });

    pagination.appendChild(nextButton);

}

// CLICAR NAS CATEGORIAS

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedCategory = button.dataset.filter;

        currentPage = 1;

        filterProducts();

    });

});

// BUSCAR PRODUTOS

searchInput.addEventListener("input", () => {

    currentPage = 1;
    filterProducts();

});

// INICIALIZAR
filterProducts();


// CLICAR NAS CATEGORIAS

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedCategory = button.dataset.filter;

        filterProducts();

    });

});

// BUSCAR PRODUTOS

searchInput.addEventListener("input", filterProducts);

// JANELA VER DETALHES

const detailsOverlay = document.getElementById("details-overlay");
const closeDetails = document.getElementById("close-details");

const detailsName = document.getElementById("details-name");
const detailsDescription = document.getElementById("details-description");
const detailsPrice = document.getElementById("details-price");

const detailsAddCart = document.getElementById("details-add-cart");

let selectedProductCard = null;

const descriptions = {
    "Vestido Aurora": "Uma peça elegante e feminina, perfeita para momentos especiais.",
    "Blusa Serena": "Uma blusa delicada e versátil para compor diferentes looks.",
    "Conjunto Luna": "Um conjunto moderno que combina conforto e sofisticação.",
    "Calça Elegance": "Uma calça elegante e confortável para diversas ocasiões."
};

// ABRIR DETALHES

document.querySelectorAll(".details-btn").forEach(button => {

    button.addEventListener("click", () => {

        selectedProductCard = button.closest(".product-card");

        const name = selectedProductCard.querySelector("h3").textContent;

        const price = selectedProductCard.querySelector(".product-price").textContent;

        detailsName.textContent = name;

        detailsPrice.textContent = price;

        detailsDescription.textContent =
            descriptions[name] || "Conheça essa peça especial da Casa Lolí.";

        detailsOverlay.classList.add("show");

    });

});

// ADICIONAR À SACOLA PELA JANELA DE DETALHES

detailsAddCart.addEventListener("click", () => {

    if (selectedProductCard) {

        const cartButton =
            selectedProductCard.querySelector(".add-cart");

        cartButton.click();

        detailsOverlay.classList.remove("show");

    }

});

// FECHAR JANELA

closeDetails.addEventListener("click", () => {
    detailsOverlay.classList.remove("show");
});

detailsOverlay.addEventListener("click", event => {

    if (event.target === detailsOverlay) {
        detailsOverlay.classList.remove("show");
    }

});

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        detailsOverlay.classList.remove("show");
    }

});

// CONTAR PRODUTOS AO ABRIR A PÁGINA

filterProducts();



// JANELA DE DETALHES DOS PRODUTOS

const productModal = document.getElementById("product-modal");
const closeProductModal = document.getElementById("close-product-modal");

const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");
const modalDescription = document.getElementById("modal-description");
const modalCategory = document.getElementById("modal-category");

// ABRIR DETALHES
document.querySelectorAll(".details-btn").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = button.dataset.price;
        const image = button.dataset.image;
        const description = button.dataset.description;
        const category = button.dataset.category;

        modalName.textContent = name;
        modalPrice.textContent = `R$ ${price}`;
        modalImage.src = image;
        modalImage.alt = name;
        modalDescription.textContent = description;
        modalCategory.textContent = category;

        productModal.classList.add("active");

        document.body.style.overflow = "hidden";
    });

});

// FECHAR NO BOTÃO X
closeProductModal.addEventListener("click", () => {
    productModal.classList.remove("active");
    document.body.style.overflow = "";
});

// FECHAR CLICANDO FORA
productModal.addEventListener("click", (event) => {

    if (event.target === productModal) {
        productModal.classList.remove("active");
        document.body.style.overflow = "";
    }

});

// FECHAR COM ESC
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        productModal.classList.remove("active");
        document.body.style.overflow = "";
    }

});


