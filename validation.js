document.addEventListener("DOMContentLoaded", () => {
  // Login Form Validation
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      // Simple validation
      if (!email || !password) {
        showNotification("Por favor, completa todos los campos", "error")
        return
      }

      if (!isValidEmail(email)) {
        showNotification("Por favor, ingresa un correo electrónico válido", "error")
        return
      }

      // Simulate login (in a real app, this would be a server request)
      simulateLogin(email, password)
    })
  }

  // Registration Form Validation
  const registerLink = document.getElementById("registerLink")
  const registerModal = document.getElementById("registerModal")
  const closeModal = document.querySelector(".close-modal")
  const registerForm = document.getElementById("registerForm")

  if (registerLink && registerModal) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault()
      registerModal.style.display = "block"
    })
  }

  if (closeModal && registerModal) {
    closeModal.addEventListener("click", () => {
      registerModal.style.display = "none"
    })
  }

  window.addEventListener("click", (e) => {
    if (e.target === registerModal) {
      registerModal.style.display = "none"
    }
  })

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("regName").value
      const email = document.getElementById("regEmail").value
      const password = document.getElementById("regPassword").value
      const confirmPassword = document.getElementById("regConfirmPassword").value

      // Simple validation
      if (!name || !email || !password || !confirmPassword) {
        showNotification("Por favor, completa todos los campos", "error")
        return
      }

      if (!isValidEmail(email)) {
        showNotification("Por favor, ingresa un correo electrónico válido", "error")
        return
      }

      if (password.length < 6) {
        showNotification("La contraseña debe tener al menos 6 caracteres", "error")
        return
      }

      if (password !== confirmPassword) {
        showNotification("Las contraseñas no coinciden", "error")
        return
      }

      // Simulate registration (in a real app, this would be a server request)
      simulateRegistration(name, email, password)
    })
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

  function simulateLogin(email, password) {
    // Show loading state
    const loginButton = loginForm.querySelector("button")
    const originalText = loginButton.textContent
    loginButton.textContent = "Iniciando sesión..."
    loginButton.disabled = true

    // Simulate API call
    setTimeout(() => {
      // Reset button
      loginButton.textContent = originalText
      loginButton.disabled = false

      // Store user info in localStorage (in a real app, this would be a JWT token)
      const user = {
        email: email,
        name: email.split("@")[0], // Just using part of email as name for demo
        isLoggedIn: true,
      }

      localStorage.setItem("cellphoneUser", JSON.stringify(user))

      // Show success message
      showNotification("¡Inicio de sesión exitoso!", "success")

      // Redirect to main page
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1000)
    }, 1500)
  }

  function simulateRegistration(name, email, password) {
    // Show loading state
    const registerButton = registerForm.querySelector("button")
    const originalText = registerButton.textContent
    registerButton.textContent = "Creando cuenta..."
    registerButton.disabled = true

    // Simulate API call
    setTimeout(() => {
      // Reset button
      registerButton.textContent = originalText
      registerButton.disabled = false

      // Close modal
      registerModal.style.display = "none"

      // Show success message
      showNotification("¡Registro exitoso! Ahora puedes iniciar sesión.", "success")
    }, 1500)
  }

  // Add CSS for notifications
  const style = document.createElement("style")
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
    `
  document.head.appendChild(style)
})
