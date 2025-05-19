document.addEventListener("DOMContentLoaded", () => {
  // Filter and sort products
  const applyFiltersBtn = document.getElementById("applyFilters")
  const productsGrid = document.querySelector(".products-grid")
  const productCards = document.querySelectorAll(".product-card")
  const priceRange = document.getElementById("priceRange")
  const priceValue = document.getElementById("priceValue")
  const searchInput = document.getElementById("searchProducts")
  const sortBy = document.getElementById("sortBy")

  // Update price range value
  if (priceRange && priceValue) {
    priceRange.addEventListener("input", function () {
      const value = this.value
      priceValue.textContent = value === "2000" ? "$2000+" : `$${value}`
    })
  }

  // Apply filters
  if (applyFiltersBtn && productsGrid && productCards.length > 0) {
    applyFiltersBtn.addEventListener("click", () => {
      filterProducts()
    })

    // Search products
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        filterProducts()
      })
    }

    // Sort products
    if (sortBy) {
      sortBy.addEventListener("change", () => {
        filterProducts()
      })
    }
  }

  // Fix for "View All Products" button
  const viewAllLinks = document.querySelectorAll('a[href="catalog.html"]')
  viewAllLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Store a flag in sessionStorage to indicate we want to show all products
      sessionStorage.setItem("showAllProducts", "true")
    })
  })

  // Check if we should show all products (coming from "View All" button)
  if (window.location.pathname.includes("catalog.html")) {
    if (sessionStorage.getItem("showAllProducts") === "true") {
      console.log("Showing all products from View All button")

      // Reset filters to show all products
      if (document.querySelector('input[name="category"][value="all"]')) {
        document.querySelector('input[name="category"][value="all"]').checked = true
      }

      // Reset price range
      if (priceRange) {
        priceRange.value = 2000
        if (priceValue) {
          priceValue.textContent = "$2000+"
        }
      }

      // Reset brands
      document.querySelectorAll('input[name="brand"]').forEach((input) => {
        input.checked = true
      })

      // Reset search
      if (searchInput) {
        searchInput.value = ""
      }

      // Reset sort
      if (sortBy) {
        sortBy.value = "featured"
      }

      // Show all products
      productCards.forEach((card) => {
        card.style.display = "block"
      })

      // Clear the flag
      sessionStorage.removeItem("showAllProducts")
    } else {
      // Default behavior - show all products on initial load
      productCards.forEach((card) => {
        card.style.display = "block"
      })
    }
  }

  // Pagination
  const paginationBtns = document.querySelectorAll(".pagination-btn")

  if (paginationBtns.length > 0) {
    paginationBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons
        paginationBtns.forEach((b) => b.classList.remove("active"))

        // Add active class to clicked button
        this.classList.add("active")

        // In a real app, this would load the next page of products
        // For this demo, we'll just scroll to the top of the products
        window.scrollTo({
          top: document.querySelector(".catalog-products").offsetTop - 100,
          behavior: "smooth",
        })
      })
    })
  }

  // Helper Functions
  // Traducir los mensajes en español
  function filterProducts() {
    // Get filter values
    const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || "all"
    const maxPrice = priceRange ? Number.parseInt(priceRange.value) : 2000
    const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(
      (input) => input.value,
    )
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : ""
    const sortValue = sortBy ? sortBy.value : "featured"

    // Filter products
    let filteredProducts = Array.from(productCards)

    // Filter by category
    if (selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter((product) => {
        return product.getAttribute("data-category") === selectedCategory
      })
    }

    // Filter by price
    filteredProducts = filteredProducts.filter((product) => {
      const price = Number.parseFloat(product.getAttribute("data-price"))
      return price <= maxPrice
    })

    // Filter by brand
    filteredProducts = filteredProducts.filter((product) => {
      const brand = product.getAttribute("data-brand")
      return selectedBrands.includes(brand)
    })

    // Filter by search query
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) => {
        const name = product.querySelector("h3").textContent.toLowerCase()
        const specs = product.querySelector(".product-specs").textContent.toLowerCase()
        return name.includes(searchQuery) || specs.includes(searchQuery)
      })
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      const priceA = Number.parseFloat(a.getAttribute("data-price"))
      const priceB = Number.parseFloat(b.getAttribute("data-price"))

      if (sortValue === "price-low") {
        return priceA - priceB
      } else if (sortValue === "price-high") {
        return priceB - priceA
      } else if (sortValue === "newest") {
        // In a real app, this would sort by date
        // For this demo, we'll just use the reverse order
        return Array.from(productCards).indexOf(a) - Array.from(productCards).indexOf(b)
      } else {
        // Featured (default)
        return 0
      }
    })

    // Hide all products
    productCards.forEach((product) => {
      product.style.display = "none"
    })

    // Show filtered products
    filteredProducts.forEach((product) => {
      product.style.display = "block"
    })

    // Show message if no products found
    if (filteredProducts.length === 0) {
      let noProductsMessage = document.querySelector(".no-products-message")

      if (!noProductsMessage) {
        noProductsMessage = document.createElement("div")
        noProductsMessage.className = "no-products-message"
        noProductsMessage.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <p>No se encontraron productos que coincidan con tus criterios</p>
                <button id="resetFilters" class="glow-button">Restablecer Filtros</button>
            `

        productsGrid.appendChild(noProductsMessage)

        // Add event listener to reset button
        document.getElementById("resetFilters").addEventListener("click", () => {
          // Reset category
          document.querySelector('input[value="all"]').checked = true

          // Reset price range
          priceRange.value = 2000
          priceValue.textContent = "$2000+"

          // Reset brands
          document.querySelectorAll('input[name="brand"]').forEach((input) => {
            input.checked = true
          })

          // Reset search
          searchInput.value = ""

          // Reset sort
          sortBy.value = "featured"

          // Apply filters
          filterProducts()
        })
      }
    } else {
      // Remove no products message if it exists
      const noProductsMessage = document.querySelector(".no-products-message")
      if (noProductsMessage) {
        productsGrid.removeChild(noProductsMessage)
      }
    }
  }

  // Add CSS for no products message
  const style = document.createElement("style")
  style.textContent = `
        .no-products-message {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem 0;
        }
        
        .no-products-message svg {
            color: var(--text-muted);
            margin-bottom: 1rem;
        }
        
        .no-products-message p {
            color: var(--text-muted);
            margin-bottom: 2rem;
            font-size: 1.2rem;
        }
        
        /* Improved product card styling */
        .product-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px var(--shadow-strong);
        }
        
        .product-card img {
            transition: transform 0.5s ease;
        }
        
        .product-card:hover img {
            transform: scale(1.05);
        }
        
        .add-to-cart {
            opacity: 0.9;
            transform: translateY(5px);
            transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .product-card:hover .add-to-cart {
            opacity: 1;
            transform: translateY(0);
        }
    `
  document.head.appendChild(style)
})
