-- Create a database for Retail mart

CREATE DATABASE MartDB;
GO

-- Use MartDB
Use MartDB
GO

-- Create a supplier table

CREATE TABLE Suppliers(
 SupplierID int PRIMARY KEY IDENTITY(1,1),
 SupplierName varchar(255) NOT NULL
);
GO

-- Create a customer table

CREATE TABLE Customers(
CustomerID int PRIMARY KEY IDENTITY(1,1),
CustomerName varchar(255) NOT NULL
);
GO

-- Create a Product table

CREATE TABLE Products(
ProductID int PRIMARY KEY IDENTITY(1,1),
ProductName varchar(255) NOT NULL,
Price DECIMAL(15,2) NOT NULL CHECK(Price >= 0),
SupplierID int NOT NULL,
FOREIGN KEY (SupplierID) references Suppliers(SupplierID)
);
GO

-- Create a Inventory Table

CREATE TABLE Inventory
(
    ProductID INT PRIMARY KEY,
    Quantity INT NOT NULL CHECK (Quantity >= 0),
    LastUpdated DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
GO

--Create a order table

CREATE TABLE Orders(
	OrderID int PRIMARY KEY IDENTITY(1,1),
	CustomerID int NOT NULL,
	ProductID int NOT NULL,
	Quantity int NOT NULL CHECK (Quantity > 0),
	OrderDate DATETIME NOT NULL DEFAULT GETDATE(),
	LastStatus varchar(255) NOT NULL,
	TotalAmount decimal(20,2) NOT NULL CHECK (TotalAmount >= 0),
	FOREIGN KEY (CustomerID) references Customers(CustomerID),
	FOREIGN KEY (ProductID) references Products(ProductID)
);
GO

-- Indexing

--Indexing on Product.SupplierID
Create INDEX idx_product_Supplier
ON Products(SupplierID);
GO

--Indexing on Inventory.ProductID
Create INDEX idx_inventory_Product
ON Inventory(ProductID);
GO

--Indexing on Orders.CustomerID
Create INDEX idx_orders_Customer
ON Orders(CustomerID);
GO

--Indexing on Orders.ProductID
Create INDEX idx_orders_Product
ON Orders(ProductID);
GO

--Product Stock View

CREATE VIEW vw_ProductStock AS
SELECT 
    p.ProductID,
    p.ProductName,
    p.Price,
    p.SupplierID,
    i.Quantity,
    i.LastUpdated
FROM Products p
JOIN Inventory i ON p.ProductID = i.ProductID;
GO

--Low Stock view

CREATE VIEW vw_LowStockProducts AS
SELECT 
    p.ProductID,
    p.ProductName,
    i.Quantity,
    i.LastUpdated
FROM Products p
JOIN Inventory i ON p.ProductID = i.ProductID
WHERE i.Quantity < 10;
GO

--Sales Summary View

CREATE VIEW vw_SalesSummary AS
SELECT 
    p.ProductID,
    p.ProductName,
    SUM(o.Quantity) AS TotalQuantitySold,
    SUM(o.TotalAmount) AS TotalSalesAmount
FROM Orders o
JOIN Products p ON o.ProductID = p.ProductID
GROUP BY p.ProductID, p.ProductName;
GO

-- Create order procedure

CREATE PROCEDURE sp_CreateOrder
    @CustomerID INT,
    @ProductID INT,
    @Quantity INT,
    @OrderDate DATETIME,
    @Status VARCHAR(255)
AS
BEGIN
    DECLARE @Price DECIMAL(15,2);
    DECLARE @TotalAmount DECIMAL(20,2);

    SELECT @Price = Price
    FROM Products
    WHERE ProductID = @ProductID;

    SET @TotalAmount = @Price * @Quantity;

    INSERT INTO Orders (CustomerID, ProductID, Quantity, OrderDate, LastStatus, TotalAmount)
    VALUES (@CustomerID, @ProductID, @Quantity, @OrderDate, @Status, @TotalAmount);
END
GO

-- Update inventory procedure

CREATE PROCEDURE sp_UpdateInventory
    @ProductID INT,
    @Quantity INT
AS
BEGIN

UPDATE Inventory
SET Quantity = Quantity + @Quantity,
    LastUpdated = GETDATE()
WHERE ProductID = @ProductID;

END
GO

--Get Sales Report

CREATE PROCEDURE sp_GetSalesReport
AS
BEGIN

SELECT 
    p.ProductID,
    p.ProductName,
    SUM(o.Quantity) AS TotalQuantitySold,
    SUM(o.TotalAmount) AS TotalSalesAmount
FROM Orders o
JOIN Products p ON o.ProductID = p.ProductID
GROUP BY p.ProductID, p.ProductName
ORDER BY TotalSalesAmount DESC;

END
GO


