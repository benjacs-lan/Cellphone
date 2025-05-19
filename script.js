document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("cellphoneUser")) || { isLoggedIn: false }
  updateLoginStatus(user)

  // Initialize cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cellphoneCart")) || []

  // Update cart count
  updateCartCount()

  // Mobile Navigation
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active")

      // Create mobile menu if it doesn't exist
      let mobileMenu = document.querySelector(".mobile-menu")

      if (!mobileMenu) {
        mobileMenu = document.createElement("div")
        mobileMenu.className = "mobile-menu"

        // Clone nav links
        const navLinksClone = navLinks.cloneNode(true)

        // Add to mobile menu
        mobileMenu.appendChild(navLinksClone)

        // Add to body
        document.body.appendChild(mobileMenu)

        // Add event listeners to links
        const links = mobileMenu.querySelectorAll("a")
        links.forEach((link) => {
          link.addEventListener("click", () => {
            mobileMenu.classList.remove("active")
            hamburger.classList.remove("active")
          })
        })
      }

      // Toggle mobile menu
      mobileMenu.classList.toggle("active")
    })
  }

  // Add CSS for mobile menu
  const style = document.createElement("style")
  style.textContent = `
        .hamburger.active .line:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .hamburger.active .line:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .line:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
        
        .mobile-menu {
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            height: 0;
            background-color: var(--background);
            overflow: hidden;
            transition: height 0.3s ease;
            z-index: 99;
            border-top: 1px solid var(--border);
        }
        
        .mobile-menu.active {
            height: calc(100vh - 80px);
        }
        
        .mobile-menu .nav-links {
            display: flex;
            flex-direction: column;
            padding: 2rem;
        }
        
        .mobile-menu .nav-links li {
            margin: 1rem 0;
        }
        
        .mobile-menu .nav-links a {
            font-size: 1.2rem;
        }
    `
  document.head.appendChild(style)

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")

      // Skip if it's just "#"
      if (href === "#") {
        return
      }

      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: "smooth",
        })
      }
    })
  })

  // Animate elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".service-card, .product-card, .about-content, .about-image, .stats, .newsletter-content",
    )

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const screenPosition = window.innerHeight / 1.3

      if (elementPosition < screenPosition) {
        element.classList.add("animate")
      }
    })
  }

  // Add CSS for scroll animations
  const animationStyle = document.createElement("style")
  animationStyle.textContent = `
        .service-card, .product-card, .about-content, .about-image, .stats, .newsletter-content {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .service-card.animate, .product-card.animate, .about-content.animate, .about-image.animate, .stats.animate, .newsletter-content.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .service-card:nth-child(1), .product-card:nth-child(1) {
            transition-delay: 0.1s;
        }
        
        .service-card:nth-child(2), .product-card:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .service-card:nth-child(3), .product-card:nth-child(3) {
            transition-delay: 0.3s;
        }
        
        .service-card:nth-child(4), .product-card:nth-child(4) {
            transition-delay: 0.4s;
        }
    `
  document.head.appendChild(animationStyle)

  // Run on load and scroll
  window.addEventListener("load", animateOnScroll)
  window.addEventListener("scroll", animateOnScroll)

  // Newsletter form submission
  const newsletterForm = document.getElementById("newsletterForm")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const email = this.querySelector('input[type="email"]').value

      if (!email) {
        showNotification("Por favor, ingresa tu correo electrónico", "error")
        return
      }

      // Simulate form submission
      const button = this.querySelector("button")
      const originalText = button.textContent
      button.textContent = "Suscribiendo..."
      button.disabled = true

      setTimeout(() => {
        button.textContent = originalText
        button.disabled = false
        this.reset()

        showNotification("¡Gracias por suscribirte!", "success")
      }, 1500)
    })
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Clear user data
      localStorage.removeItem("cellphoneUser")

      // Show notification
      showNotification("Has cerrado sesión correctamente", "success")

      // Update UI
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1000)
    })
  }

  // Helper function for notifications
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

  // Helper function to update cart count
  function updateCartCount() {
    const cartCount = document.querySelectorAll("#cartCount")
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

    cartCount.forEach((element) => {
      element.textContent = totalItems
    })
  }

  // Helper function to update login status in UI
  function updateLoginStatus(user) {
    const userProfileContainer = document.getElementById("userProfileContainer")
    const loginLink = document.getElementById("loginLink")

    if (userProfileContainer && loginLink) {
      if (user.isLoggedIn) {
        userProfileContainer.style.display = "block"
        loginLink.style.display = "none"

        // Update user name
        const userName = document.getElementById("userName")
        if (userName) {
          userName.textContent = user.name
        }
      } else {
        userProfileContainer.style.display = "none"
        loginLink.style.display = "block"
      }
    }
  }
})
