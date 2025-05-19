document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("cellphoneUser")) || { isLoggedIn: false }

  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cellphoneCart")) || []

  // Update cart count
  updateCartCount()

  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart")

  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id")
        const name = this.getAttribute("data-name")
        const price = Number.parseFloat(this.getAttribute("data-price"))

        // Check if item is already in cart
        const existingItem = cart.find((item) => item.id === id)

        if (existingItem) {
          existingItem.quantity += 1
        } else {
          cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1,
          })
        }

        // Save cart to localStorage
        localStorage.setItem("cellphoneCart", JSON.stringify(cart))

        // Update cart count
        updateCartCount()

        // Show notification
        showNotification(`${name} añadido al carrito`, "success")
      })
    })
  }

  // Render cart items if on cart page
  const cartItemsList = document.getElementById("cartItemsList")

  if (cartItemsList) {
    renderCart()
  }

  // Checkout button
  const checkoutBtn = document.getElementById("checkoutBtn")

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showNotification("Tu carrito está vacío", "error")
        return
      }

      // Check if user is logged in
      if (!user.isLoggedIn) {
        showNotification("Debes iniciar sesión para continuar", "error")
        setTimeout(() => {
          window.location.href = "login.html"
        }, 1500)
        return
      }

      // Redirect to payment page
      window.location.href = "payment.html"
    })
  }

  // Helper Functions
  function updateCartCount() {
    const cartCount = document.querySelectorAll("#cartCount")
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

    cartCount.forEach((element) => {
      element.textContent = totalItems
    })
  }

  function renderCart() {
    if (cart.length === 0) {
      cartItemsList.innerHTML = `
                <div class="empty-cart-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <p>Tu carrito está vacío</p>
                    <a href="catalog.html" class="glow-button">Empezar a Comprar</a>
                </div>
            `

      // Update summary
      updateCartSummary(0, 0, 0)

      return
    }

    let cartHTML = ""
    let subtotal = 0

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity
      subtotal += itemTotal

      cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="img/product${item.id}.jpg" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn decrease">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" readonly>
                                <button class="quantity-btn increase">+</button>
                            </div>
                            <button class="remove-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `
    })

    cartItemsList.innerHTML = cartHTML

    // Calculate shipping and tax
    const shipping = subtotal > 0 ? 10 : 0
    const tax = subtotal * 0.16 // 16% tax (IVA común en países hispanohablantes)
    const total = subtotal + shipping + tax

    // Update summary
    updateCartSummary(subtotal, shipping, tax, total)

    // Add event listeners to quantity buttons
    const decreaseButtons = cartItemsList.querySelectorAll(".decrease")
    const increaseButtons = cartItemsList.querySelectorAll(".increase")
    const removeButtons = cartItemsList.querySelectorAll(".remove-item")

    decreaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const cartItem = this.closest(".cart-item")
        const id = cartItem.getAttribute("data-id")
        const item = cart.find((item) => item.id === id)

        if (item.quantity > 1) {
          item.quantity -= 1
          cartItem.querySelector(".quantity-input").value = item.quantity

          // Update cart
          localStorage.setItem("cellphoneCart", JSON.stringify(cart))
          updateCartCount()
          renderCart()
        }
      })
    })

    increaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const cartItem = this.closest(".cart-item")
        const id = cartItem.getAttribute("data-id")
        const item = cart.find((item) => item.id === id)

        item.quantity += 1
        cartItem.querySelector(".quantity-input").value = item.quantity

        // Update cart
        localStorage.setItem("cellphoneCart", JSON.stringify(cart))
        updateCartCount()
        renderCart()
      })
    })

    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const cartItem = this.closest(".cart-item")
        const id = cartItem.getAttribute("data-id")

        // Remove item from cart
        cart = cart.filter((item) => item.id !== id)

        // Update cart
        localStorage.setItem("cellphoneCart", JSON.stringify(cart))
        updateCartCount()
        renderCart()
      })
    })
  }

  function updateCartSummary(subtotal, shipping, tax, total) {
    const subtotalElement = document.getElementById("subtotal")
    const shippingElement = document.getElementById("shipping")
    const taxElement = document.getElementById("tax")
    const totalElement = document.getElementById("total")

    if (subtotalElement && shippingElement && taxElement && totalElement) {
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`
      shippingElement.textContent = `$${shipping.toFixed(2)}`
      taxElement.textContent = `$${tax.toFixed(2)}`
      totalElement.textContent = `$${total.toFixed(2)}`
    }
  }

  function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    // Add to body
    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }
})
