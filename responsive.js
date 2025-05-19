document.addEventListener("DOMContentLoaded", () => {
  // Mejorar la navegación móvil
  const hamburger = document.querySelector(".hamburger")
  const body = document.body

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active")

      // Crear menú móvil si no existe
      let mobileMenu = document.querySelector(".mobile-menu")

      if (!mobileMenu) {
        mobileMenu = document.createElement("div")
        mobileMenu.className = "mobile-menu"

        // Clonar enlaces de navegación
        const navLinks = document.querySelector(".nav-links")
        if (navLinks) {
          const navLinksClone = navLinks.cloneNode(true)
          mobileMenu.appendChild(navLinksClone)
        }

        // Añadir al body
        body.appendChild(mobileMenu)

        // Añadir event listeners a los enlaces
        const links = mobileMenu.querySelectorAll("a")
        links.forEach((link) => {
          link.addEventListener("click", () => {
            mobileMenu.classList.remove("active")
            hamburger.classList.remove("active")
            body.classList.remove("menu-open")
          })
        })
      }

      // Toggle menú móvil
      mobileMenu.classList.toggle("active")

      // Prevenir scroll cuando el menú está abierto
      body.classList.toggle("menu-open")
    })
  }

  // Botón "Volver arriba"
  const backToTopBtn = document.getElementById("backToTop")

  if (backToTopBtn) {
    // Mostrar/ocultar botón según scroll
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.style.display = "flex"
      } else {
        backToTopBtn.style.display = "none"
      }
    })

    // Acción del botón
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Mejorar experiencia en formularios móviles
  const inputs = document.querySelectorAll("input, select, textarea")

  inputs.forEach((input) => {
    // Prevenir zoom en iOS al enfocar inputs
    input.addEventListener("focus", () => {
      document.documentElement.style.fontSize = "16px"
    })

    // Restaurar tamaño de fuente al desenfocar
    input.addEventListener("blur", () => {
      document.documentElement.style.fontSize = ""
    })
  })

  // Mejorar experiencia en tablas
  const tables = document.querySelectorAll("table:not(.responsive-table)")

  tables.forEach((table) => {
    // Envolver tablas en un contenedor con scroll horizontal
    const wrapper = document.createElement("div")
    wrapper.style.overflowX = "auto"
    table.parentNode.insertBefore(wrapper, table)
    wrapper.appendChild(table)
  })

  // Convertir tablas a formato responsivo
  const responsiveTables = document.querySelectorAll(".responsive-table")

  responsiveTables.forEach((table) => {
    if (window.innerWidth <= 767) {
      const headerCells = table.querySelectorAll("thead th")
      const headerTexts = Array.from(headerCells).map((cell) => cell.textContent)

      const bodyRows = table.querySelectorAll("tbody tr")

      bodyRows.forEach((row) => {
        const cells = row.querySelectorAll("td")

        cells.forEach((cell, index) => {
          if (headerTexts[index]) {
            cell.setAttribute("data-label", headerTexts[index])
          }
        })
      })
    }
  })

  // Ajustar altura de iframes y videos
  const responsiveVideos = document.querySelectorAll(".responsive-video")

  responsiveVideos.forEach((container) => {
    const iframe = container.querySelector("iframe, video")
    if (iframe) {
      const ratio = iframe.height / iframe.width
      container.style.paddingBottom = ratio * 100 + "%"
    }
  })

  // Añadir estilos para prevenir scroll cuando el menú está abierto
  const style = document.createElement("style")
  style.textContent = `
    body.menu-open {
      overflow: hidden;
    }
    
    @media (min-width: 992px) {
      body.menu-open {
        overflow: auto;
      }
    }
  `
  document.head.appendChild(style)

  // Manejo específico para el botón "Ver Todos los Productos"
  const viewAllProductsBtn = document.getElementById("viewAllProducts")
  if (viewAllProductsBtn) {
    viewAllProductsBtn.addEventListener("click", () => {
      console.log("View All Products button clicked")
      sessionStorage.setItem("showAllProducts", "true")
    })
  }
})
