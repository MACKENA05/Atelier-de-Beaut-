import os

base = "src"

structure = {
    "assets": [],
    "components": [
        "Navbar.jsx", "Footer.jsx", "ProductCard.jsx", "CartItem.jsx", "CategoryFilter.jsx",
        "UserAuthForm.jsx", "AdminPanel.jsx"
    ],
    "pages": [
        "Home.jsx", "Shop.jsx", "ProductDetails.jsx", "Cart.jsx", "Checkout.jsx", "Contact.jsx",
        "UserAccount.jsx", "Login.jsx", "AdminPanel.jsx"
    ],
    "redux": [
        "store.js", "cartSlice.js", "productsSlice.js", "authSlice.js"
    ],
    "services": [
        "api.js"
    ],
    "styles": [
        "main.css"
    ],
    "utils": [
        "formatPrice.js"
    ],
    "": [
        "App.js", "index.js", "reportWebVitals.js"
    ]
}

for folder, files in structure.items():
    folder_path = os.path.join(base, folder)
    os.makedirs(folder_path, exist_ok=True)
    print(f"📁 Created folder: {folder_path}")

    for file in files:
        path = os.path.join(folder_path, file)
        if not os.path.exists(path):
            with open(path, "w") as f:
                f.write(f"// {file} - part of Atelier de Beauté e-commerce frontend\n")
            print(f"✅ Created: {path}")
        else:
            print(f"🟡 Already exists: {path
