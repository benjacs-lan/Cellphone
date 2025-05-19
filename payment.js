document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("cellphoneUser")) || { isLoggedIn: false }

  if (!user.isLoggedIn) {
    // Redirect to login page if not logged in
    window.location.href = "login.html"
    return
  }

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cellphoneCart")) || []

  if (cart.length === 0) {
    // Redirect to cart page if cart is empty
    window.location.href = "cart.html"
    return
  }

  // Update order summary
  updateOrderSummary()

  // Payment form submission
  const paymentForm = document.getElementById("paymentForm")

  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validate form
      const firstName = document.getElementById("firstName").value
      const lastName = document.getElementById("lastName").value
      const address = document.getElementById("address").value
      const city = document.getElementById("city").value
      const zipCode = document.getElementById("zipCode").value
      const country = document.getElementById("country").value
      const phone = document.getElementById("phone").value

      if (!firstName || !lastName || !address || !city || !zipCode || !country || !phone) {
        showNotification("Por favor, completa todos los campos de envío", "error")
        return
      }

      // Redirect to Pagos360
      redirectToPaymentGateway()
    })
  }

  // Helper Functions
  function updateOrderSummary() {
    const orderItems = document.getElementById("orderItems")
    const orderSubtotal = document.getElementById("orderSubtotal")
    const orderShipping = document.getElementById("orderShipping")
    const orderTax = document.getElementById("orderTax")
    const orderTotal = document.getElementById("orderTotal")

    if (!orderItems || !orderSubtotal || !orderShipping || !orderTax || !orderTotal) {
      return
    }

    let subtotal = 0
    let itemsHTML = ""

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity
      subtotal += itemTotal

      itemsHTML += `
        <div class="order-item">
          <div class="item-info">
            <span class="item-name">${item.name}</span>
            <span class="item-quantity">x${item.quantity}</span>
          </div>
          <span class="item-price">$${itemTotal.toFixed(2)}</span>
        </div>
      `
    })

    orderItems.innerHTML = itemsHTML

    // Calculate shipping and tax
    const shipping = subtotal > 0 ? 10 : 0
    const tax = subtotal * 0.16 // 16% tax
    const total = subtotal + shipping + tax

    orderSubtotal.textContent = `$${subtotal.toFixed(2)}`
    orderShipping.textContent = `$${shipping.toFixed(2)}`
    orderTax.textContent = `$${tax.toFixed(2)}`
    orderTotal.textContent = `$${total.toFixed(2)}`
  }

  function redirectToPaymentGateway() {
    // Mostrar mensaje de redirección
    showNotification("Redirigiendo a Pagos360...", "info")

    // Obtener datos del formulario
    const firstName = document.getElementById("firstName").value
    const lastName = document.getElementById("lastName").value
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value
    const zipCode = document.getElementById("zipCode").value
    const country = document.getElementById("country").value
    const phone = document.getElementById("phone").value

    // Generar número de pedido
    const orderNumber = "CP-" + Math.floor(Math.random() * 10000000)

    // Preparar datos para enviar a Pagos360
    const pagos360Data = {
      // Datos de la API de Pagos360 (estos serían los campos reales según su documentación)
      external_reference: orderNumber,
      concept: "Compra en CELLPHONE",
      amount: calculateTotal(),
      currency: "ARS", // o la moneda que corresponda
      payer: {
        name: firstName + " " + lastName,
        email: user.email || "cliente@example.com",
        phone: phone,
        address: {
          street: address,
          city: city,
          postal_code: zipCode,
          country: getCountryName(country),
        },
      },
      items: cart.map((item) => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      // Otros campos requeridos por Pagos360
    }

    // En una implementación real, aquí se enviarían los datos a la API de Pagos360
    // y se obtendría una URL de pago para redireccionar al usuario

    // Para esta demo, simularemos la redirección
    console.log("Datos para Pagos360:", pagos360Data)

    // Guardar pedido en localStorage
    saveOrder(orderNumber, calculateTotal())

    // Simular redirección a Pagos360
    setTimeout(() => {
      // En una implementación real, aquí se redirigiría a la URL proporcionada por Pagos360
      // window.location.href = pagos360Response.payment_url;

      // Para esta demo, abrimos una URL simulada
      window.open("https://pagos360.com/pagar/" + orderNumber, "_blank")

      // Limpiar el carrito
      localStorage.removeItem("cellphoneCart")

      // Redirigir a la página principal
      window.location.href = "index.html"

      // Mostrar notificación de éxito
      showNotification("Pedido " + orderNumber + " creado correctamente. Completa el pago en Pagos360.", "success")
    }, 1500)
  }

  function showBankTransferInstructions() {
    // Crear modal para instrucciones de transferencia bancaria
    const modal = document.createElement("div")
    modal.className = "modal"
    modal.style.display = "block"

    const modalContent = document.createElement("div")
    modalContent.className = "modal-content"

    const closeBtn = document.createElement("span")
    closeBtn.className = "close-modal"
    closeBtn.innerHTML = "&times;"
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    const title = document.createElement("h2")
    title.textContent = "Instrucciones para Transferencia Bancaria"

    const orderNumber = "CP-" + Math.floor(Math.random() * 10000000)

    const instructions = document.createElement("div")
    instructions.innerHTML = `
      <p>Por favor, realiza una transferencia bancaria con los siguientes datos:</p>
      
      <div class="bank-details">
        <p><strong>Banco:</strong> Banco Nacional</p>
        <p><strong>Titular:</strong> CELLPHONE S.A.</p>
        <p><strong>Cuenta:</strong> 1234-5678-9012-3456</p>
        <p><strong>CLABE:</strong> 012345678901234567</p>
        <p><strong>Referencia:</strong> ${orderNumber}</p>
        <p><strong>Monto:</strong> $${(calculateTotal()).toFixed(2)}</p>
      </div>
      
      <p>Una vez realizada la transferencia, envía el comprobante a <strong>pagos@cellphone.com</strong> junto con tu número de pedido.</p>
      
      <p>Tu pedido será procesado una vez que confirmemos el pago.</p>
    `

    const confirmBtn = document.createElement("button")
    confirmBtn.className = "glow-button"
    confirmBtn.textContent = "Entendido"
    confirmBtn.addEventListener("click", () => {
      document.body.removeChild(modal)

      // Limpiar el carrito
      localStorage.removeItem("cellphoneCart")

      // Guardar pedido en localStorage
      saveOrder(orderNumber, calculateTotal())

      // Redirigir a la página principal
      window.location.href = "index.html"
    })

    modalContent.appendChild(closeBtn)
    modalContent.appendChild(title)
    modalContent.appendChild(instructions)
    modalContent.appendChild(confirmBtn)

    modal.appendChild(modalContent)
    document.body.appendChild(modal)
  }

  function saveOrder(orderNumber, total) {
    // Guardar pedido en localStorage
    const order = {
      id: orderNumber,
      date: new Date().toISOString(),
      items: cart,
      total: total,
      status: "Pendiente de pago",
      shippingInfo: {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        zipCode: document.getElementById("zipCode").value,
        country: document.getElementById("country").value,
        phone: document.getElementById("phone").value,
      },
      paymentMethod: "Pagos360",
    }

    // Obtener pedidos existentes o inicializar array vacío
    const orders = JSON.parse(localStorage.getItem("cellphoneOrders")) || []

    // Añadir nuevo pedido
    orders.push(order)

    // Guardar pedidos
    localStorage.setItem("cellphoneOrders", JSON.stringify(orders))
  }

  function calculateTotal() {
    let subtotal = 0

    cart.forEach((item) => {
      subtotal += item.price * item.quantity
    })

    const shipping = subtotal > 0 ? 10 : 0
    const tax = subtotal * 0.16 // 16% tax

    return subtotal + shipping + tax
  }

  function getCountryName(countryCode) {
    const countries = {
      mx: "México",
      es: "España",
      ar: "Argentina",
      co: "Colombia",
      cl: "Chile",
      pe: "Perú",
    }

    return countries[countryCode] || countryCode
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
