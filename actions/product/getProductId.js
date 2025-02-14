chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getProductId") {
        let productId = null;

        // Get ProductId data-attribute
        const productElement = document.querySelector('[data-product-id]');
        if (productElement) {
            productId = productElement.getAttribute("data-product-id");
        }

        // Відправка відповіді
        if (productId) {
            sendResponse({productId: productId});
        } else {
            sendResponse({error: "Product ID not found"});
        }
    }

    return true;
});
