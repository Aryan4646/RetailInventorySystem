"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const apiBaseUrl = "http://localhost:5223";
const content = document.getElementById("content");
const messageBox = document.getElementById("messageBox");
function showMessage(message, type) {
    messageBox.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}
function clearMessage() {
    messageBox.innerHTML = "";
}
// function showDashboard(): void {
//     clearMessage();
//     content.innerHTML = `
//         <h2 class="mb-4">Dashboard</h2>
//         <div class="row">
//             <div class="col-md-3">
//                 <div class="card text-bg-primary mb-3">
//                     <div class="card-body">
//                         <h5 class="card-title">Products</h5>
//                         <p class="card-text">View all products</p>
//                     </div>
//                 </div>
//             </div>
//             <div class="col-md-3">
//                 <div class="card text-bg-success mb-3">
//                     <div class="card-body">
//                         <h5 class="card-title">Orders</h5>
//                         <p class="card-text">Create orders</p>
//                     </div>
//                 </div>
//             </div>
//             <div class="col-md-3">
//                 <div class="card text-bg-warning mb-3">
//                     <div class="card-body">
//                         <h5 class="card-title">Inventory</h5>
//                         <p class="card-text">Manage stock</p>
//                     </div>
//                 </div>
//             </div>
//             <div class="col-md-3">
//                 <div class="card text-bg-secondary mb-3">
//                     <div class="card-body">
//                         <h5 class="card-title">Reports</h5>
//                         <p class="card-text">View summaries</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `;
// }
function showProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        clearMessage();
        try {
            const response = yield fetch(`${apiBaseUrl}/api/Product`);
            if (!response.ok) {
                throw new Error();
            }
            const products = yield response.json();
            let rows = "";
            for (let product of products) {
                rows += `
                <tr>
                    <td>${product.productID}</td>
                    <td>${product.productName}</td>
                    <td>${product.price}</td>
                </tr>
            `;
            }
            content.innerHTML = `
            <h2 class="mb-4">Product List</h2>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
        }
        catch (_a) {
            showMessage("Failed to load products", "danger");
        }
    });
}
function showInventory() {
    return __awaiter(this, void 0, void 0, function* () {
        clearMessage();
        try {
            const response = yield fetch(`${apiBaseUrl}/api/Inventory`);
            if (!response.ok) {
                throw new Error();
            }
            const inventory = yield response.json();
            let rows = "";
            for (let item of inventory) {
                rows += `
                <tr>
                    <td>${item.productID}</td>
                    <td>${item.quantity}</td>
                </tr>
            `;
            }
            content.innerHTML = `
            <h2 class="mb-4">Manage Inventory</h2>

            <form id="inventoryForm" class="mb-4">
                <div class="mb-3">
                    <label class="form-label">Product ID</label>
                    <input type="number" class="form-control" id="inventoryProductID" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Quantity</label>
                    <input type="number" class="form-control" id="inventoryQuantity" required>
                </div>
                <button type="submit" class="btn btn-warning">Update Inventory</button>
            </form>

            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>Product ID</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
            const form = document.getElementById("inventoryForm");
            form.addEventListener("submit", updateInventory);
        }
        catch (_a) {
            showMessage("Failed to load inventory", "danger");
        }
    });
}
function updateInventory(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        clearMessage();
        const productID = Number(document.getElementById("inventoryProductID").value);
        const quantity = Number(document.getElementById("inventoryQuantity").value);
        try {
            const response = yield fetch(`${apiBaseUrl}/api/Inventory/${productID}/${quantity}`, {
                method: "PUT"
            });
            if (response.ok) {
                showMessage("Inventory updated successfully", "success");
                showInventory();
            }
            else {
                const errorText = yield response.text();
                showMessage(errorText || "Failed to update inventory", "danger");
            }
        }
        catch (_a) {
            showMessage("Server error", "danger");
        }
    });
}
function showCreateOrder() {
    clearMessage();
    content.innerHTML = `
        <h2 class="mb-4">Create Order</h2>

        <form id="orderForm">
            <div class="mb-3">
                <label class="form-label">Customer ID</label>
                <input type="number" class="form-control" id="customerID" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Product ID</label>
                <input type="number" class="form-control" id="productID" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Quantity</label>
                <input type="number" class="form-control" id="orderQuantity" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Order Date</label>
                <input type="date" class="form-control" id="orderDate" required>
            </div>

            <button type="submit" class="btn btn-success">Create Order</button>
        </form>
    `;
    const form = document.getElementById("orderForm");
    form.addEventListener("submit", createOrder);
}
function createOrder(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        clearMessage();
        const customerID = Number(document.getElementById("customerID").value);
        const productID = Number(document.getElementById("productID").value);
        const quantity = Number(document.getElementById("orderQuantity").value);
        const orderDate = document.getElementById("orderDate").value;
        if (quantity <= 0) {
            showMessage("Quantity must be greater than 0", "danger");
            return;
        }
        const orderData = {
            customerID,
            productID,
            quantity,
            orderDate: new Date(orderDate).toISOString(),
            lastStatus: "Created",
            totalAmount: 0
        };
        try {
            const response = yield fetch(`${apiBaseUrl}/api/Order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderData)
            });
            if (response.ok) {
                showMessage("Order created successfully", "success");
            }
            else {
                const errorText = yield response.text();
                showMessage(errorText || "Failed to create order", "danger");
            }
        }
        catch (_a) {
            showMessage("Server error", "danger");
        }
    });
}
function showOrders() {
    clearMessage();
    content.innerHTML = `
        <h2 class="mb-4">Orders</h2>
        <div class="card">
            <div class="card-body">
                <p>Your backend currently supports:</p>
                <ul>
                    <li>Create Order</li>
                    <li>Get Order By ID</li>
                </ul>
                <p>Showing all orders is not added yet in backend.</p>
            </div>
        </div>
    `;
}
function showReports() {
    return __awaiter(this, void 0, void 0, function* () {
        clearMessage();
        try {
            const [productsResponse, inventoryResponse] = yield Promise.all([
                fetch(`${apiBaseUrl}/api/Product`),
                fetch(`${apiBaseUrl}/api/Inventory`)
            ]);
            if (!productsResponse.ok || !inventoryResponse.ok) {
                throw new Error();
            }
            const products = yield productsResponse.json();
            const inventory = yield inventoryResponse.json();
            const productMap = new Map();
            for (let product of products) {
                productMap.set(product.productID, product);
            }
            const lowStockItems = inventory.filter(item => item.quantity < 10);
            const overStockItems = inventory.filter(item => item.quantity > 150);
            let lowStockRows = "";
            let overStockRows = "";
            for (let item of lowStockItems) {
                const product = productMap.get(item.productID);
                lowStockRows += `
                <tr>
                    <td>${item.productID}</td>
                    <td>${product ? product.productName : "Unknown Product"}</td>
                    <td>${item.quantity}</td>
                </tr>
            `;
            }
            for (let item of overStockItems) {
                const product = productMap.get(item.productID);
                overStockRows += `
                <tr>
                    <td>${item.productID}</td>
                    <td>${product ? product.productName : "Unknown Product"}</td>
                    <td>${item.quantity}</td>
                </tr>
            `;
            }
            if (lowStockRows === "") {
                lowStockRows = `
                <tr>
                    <td colspan="3" class="text-center">No low stock products</td>
                </tr>
            `;
            }
            if (overStockRows === "") {
                overStockRows = `
                <tr>
                    <td colspan="3" class="text-center">No overstock products</td>
                </tr>
            `;
            }
            content.innerHTML = `
            <h2 class="mb-4">Reports</h2>

            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title mb-3">Low Stock Products (Less than 10)</h5>
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>${lowStockRows}</tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <h5 class="card-title mb-3">Overstock Products (More than 150)</h5>
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>${overStockRows}</tbody>
                    </table>
                </div>
            </div>
        `;
        }
        catch (_a) {
            showMessage("Failed to load reports", "danger");
        }
    });
}
// showDashboard();
// (window as any).showDashboard = showDashboard;
window.showProducts = showProducts;
window.showInventory = showInventory;
window.showCreateOrder = showCreateOrder;
window.showOrders = showOrders;
window.showReports = showReports;
//# sourceMappingURL=app.js.map