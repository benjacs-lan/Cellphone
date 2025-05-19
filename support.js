document.addEventListener("DOMContentLoaded", () => {
  // Tabs de navegación
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabPanes = document.querySelectorAll(".tab-pane")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remover clase active de todos los botones y paneles
      tabBtns.forEach((b) => b.classList.remove("active"))
      tabPanes.forEach((p) => p.classList.remove("active"))

      // Añadir clase active al botón clickeado
      btn.classList.add("active")

      // Mostrar el panel correspondiente
      const tabId = btn.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item")

  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")

      question.addEventListener("click", () => {
        // Toggle active class
        const isActive = item.classList.contains("active")

        // Cerrar todos los items activos
        faqItems.forEach((faq) => {
          faq.classList.remove("active")
        })

        // Si el item clickeado no estaba activo, abrirlo
        if (!isActive) {
          item.classList.add("active")
        }
      })
    })
  }

  // Contact Form Submission
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("contactName").value
      const email = document.getElementById("contactEmail").value
      const subject = document.getElementById("contactSubject").value
      const message = document.getElementById("contactMessage").value

      // Validate form
      if (!name || !email || !subject || !message) {
        showNotification("Por favor, completa todos los campos", "error")
        return
      }

      if (!isValidEmail(email)) {
        showNotification("Por favor, ingresa un correo electrónico válido", "error")
        return
      }

      // Simulate form submission
      const button = this.querySelector("button")
      const originalText = button.textContent
      button.textContent = "Enviando..."
      button.disabled = true

      setTimeout(() => {
        button.textContent = originalText
        button.disabled = false
        this.reset()

        showNotification("¡Tu mensaje ha sido enviado! Nos pondremos en contacto contigo pronto.", "success")
      }, 1500)
    })
  }

  // Live Chat
  const startChatBtn = document.getElementById("startChatBtn")
  const chatModal = document.getElementById("chatModal")
  const closeChatModal = chatModal ? chatModal.querySelector(".close-modal") : null
  const chatInput = document.getElementById("chatInput")
  const sendChatBtn = document.getElementById("sendChatBtn")
  const chatMessages = document.getElementById("chatMessages")

  if (startChatBtn && chatModal) {
    startChatBtn.addEventListener("click", () => {
      chatModal.style.display = "block"

      // Scroll al final de los mensajes
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight
      }

      // Focus en el input
      if (chatInput) {
        chatInput.focus()
      }
    })
  }

  if (closeChatModal) {
    closeChatModal.addEventListener("click", () => {
      chatModal.style.display = "none"
    })
  }

  window.addEventListener("click", (e) => {
    if (e.target === chatModal) {
      chatModal.style.display = "none"
    }
  })

  if (sendChatBtn && chatInput && chatMessages) {
    sendChatBtn.addEventListener("click", sendMessage)

    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage()
      }
    })
  }

  function sendMessage() {
    const message = chatInput.value.trim()

    if (!message) return

    // Add user message
    addMessage(message, "outgoing")

    // Clear input
    chatInput.value = ""

    // Simulate response after a delay
    setTimeout(() => {
      // Add automated response
      const responses = [
        "Gracias por tu mensaje. Nuestro equipo de soporte te asistirá en breve.",
        "Entiendo tu consulta. Permíteme verificar esa información.",
        "Gracias por contactarnos. Estamos revisando este problema.",
        "Me encantaría ayudarte con eso. ¿Podrías proporcionar más detalles?",
        "Agradecemos tu paciencia. Nuestro equipo técnico está trabajando en una solución.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      addMessage(randomResponse, "incoming")

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight
    }, 1000)
  }

  function addMessage(text, type) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${type}`

    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const timeString = `${hours}:${minutes}`

    messageDiv.innerHTML = `
      <p>${text}</p>
      <span class="message-time">${timeString}</span>
    `

    chatMessages.appendChild(messageDiv)

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Helper Functions
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
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

  // Añadir estilos para notificaciones si no existen
  if (!document.querySelector("style#notification-styles")) {
    const style = document.createElement("style")
    style.id = "notification-styles"
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      .notification.show {
        transform: translateX(0);
      }
      
      .notification.success {
        background-color: var(--success);
      }
      
      .notification.error {
        background-color: var(--error);
      }
      
      .notification.info {
        background-color: var(--info);
      }
      
      @media (max-width: 576px) {
        .notification {
          width: calc(100% - 40px);
          right: 20px;
        }
      }
    `
    document.head.appendChild(style)
  }
})

