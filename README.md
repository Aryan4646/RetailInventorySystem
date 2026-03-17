# RetailInventorySystem
## Overview
This project is a simple retail management system designed to handle customer orders and inventory efficiently. It solves common issues like stockouts, duplicate orders, and lack of inventory visibility.

---

## Features
- Order creation with stock validation
- Inventory tracking and updates
- Layered backend architecture (Controller → Service → Repository)
- Responsive frontend using HTML, Bootstrap, and TypeScript
---

## 🧱 System Architecture
The system follows a layered architecture:

Frontend → Backend API → Services → Repositories → SQL Server Database

- **Frontend**: User interface for managing orders and inventory  
- **Controllers**: Handle HTTP requests  
- **Services**: Apply business logic and validations  
- **Repositories**: Handle database operations  
- **Database**: Stores products, orders, customers, and inventory  

---

## 🗄️ Database Design
Main tables:
- Customers  
- Suppliers  
- Products  
- Orders  
- Inventory  

Relationships:
- Customers → Orders (One-to-Many)  
- Products → Orders (One-to-Many)  
- Suppliers → Products (One-to-Many)  
- Products → Inventory (One-to-One)  

---

## 🔄 Order Flow
1. User creates an order from frontend  
2. Controller receives request  
3. Service validates stock and rules  
4. Repository saves data to database  
5. Inventory is updated  
6. Response is sent back to user  

---

## 📊 Reporting
- **SSRS**: Operational reports (sales, inventory)  
- **Power BI**: Dashboard for stock, sales, and order insights  

---

## ☁️ Future Scope
- Azure AD for authentication (conceptual)  
- Azure Functions for low-stock alerts  
- Integration with ERP/CRM systems  

---

## 🚀 Tech Stack
- Backend: ASP.NET Core (C#)  
- Database: SQL Server  
- Frontend: HTML, CSS, Bootstrap, TypeScript  
- Reporting: Power BI  

