document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#url-table tbody");
    const addRowBtn = document.getElementById("add-row");
    const saveBtn = document.getElementById("save-urls");

    const redirectBtns = {
        toDashboard: document.getElementById("redirect-to-dashboard-button"),
        toCache: document.getElementById("redirect-to-cache-button"),
        toOrders: document.getElementById("redirect-to-orders-button"),
        toProduct: document.getElementById("redirect-to-product-button"),
    };

    // Load saved URLs
    chrome.storage.sync.get("allowedUrls", (data) => {
        const allowedUrls = data.allowedUrls || [];
        allowedUrls.forEach((urlPair) => addRow(urlPair));
    });

    // Add row
    addRowBtn.addEventListener("click", () => addRow());

    // Save URLs
    saveBtn.addEventListener("click", () => {
        const rows = tableBody.querySelectorAll("tr");
        const allowedUrls = Array.from(rows).map((row) => {
            const inputs = row.querySelectorAll("input");
            return [inputs[0].value, inputs[1].value];
        });
        chrome.storage.sync.set({ allowedUrls });
        alert("URLs saved!");
    });

    // Redirect buttons
    Object.keys(redirectBtns).forEach((key) => {
        redirectBtns[key].addEventListener("click", () => handleRedirect(key));
    });

    const handleRedirect = (action) => {
        chrome.storage.sync.get("allowedUrls", (data) => {
            const allowedUrls = data.allowedUrls || [];
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const currentUrl = tabs[0].url;
                const matchedUrl = allowedUrls.find(([storeUrl]) => currentUrl.startsWith(storeUrl));

                if (!matchedUrl) {
                    alert("Store URL not found in allowed URLs.");
                    return;
                }

                const [storeUrl, adminBase] = matchedUrl;
                let adminUrl = `${storeUrl}/${adminBase}/`;

                switch (action) {
                    case "toDashboard":
                        adminUrl += "dashboard";
                        break;
                    case "toCache":
                        adminUrl += "cache/index/key";
                        break;
                    case "toOrders":
                        adminUrl += "sales/order/index/key/";
                        break;
                    case "toProduct":
                        chrome.tabs.sendMessage(tabs[0].id, { action: "getProductId" }, (response) => {
                            if (response && response.productId) {
                                adminUrl += `catalog/product/edit/id/${response.productId}`;
                                chrome.tabs.create({ url: adminUrl });
                            } else {
                                alert("Product ID not found!");
                            }
                        });
                        return;
                }

                chrome.tabs.create({ url: adminUrl });
            });
        });
    };

    const addRow = (urlPair = ["", ""]) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" value="${urlPair[0]}" placeholder="Product Base URL" /></td>
            <td><input type="text" value="${urlPair[1]}" placeholder="Admin Base URL (without '/')" /></td>
            <td><button class="delete-row">Delete</button></td>
        `;
        tableBody.appendChild(row);

        // Add delete button functionality
        row.querySelector(".delete-row").addEventListener("click", () => row.remove());
    };
});
