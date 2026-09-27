-- ============================================
-- Manufacturer-to-Distributor API Database Schema
-- Database: md-presentation-db (Azure SQL)
-- ============================================

-- 1. Manufacturers
CREATE TABLE Manufacturers (
    ManufacturerId   VARCHAR(30)  NOT NULL PRIMARY KEY,
    ManufacturerName VARCHAR(150) NOT NULL,
    CreatedAt        DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);

-- 2. ProductMaster
CREATE TABLE ProductMaster (
    MedicineCode   VARCHAR(30)  NOT NULL PRIMARY KEY,
    MedicineName   VARCHAR(120) NOT NULL,
    ManufacturerId VARCHAR(30)  NOT NULL,
    Status         VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    DocumentUrl    VARCHAR(500) NULL,
    CreatedAt      DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_Product_Manufacturer
        FOREIGN KEY (ManufacturerId) REFERENCES Manufacturers(ManufacturerId),

    CONSTRAINT CHK_Product_Status
        CHECK (Status IN ('ACTIVE', 'INACTIVE'))
);

-- 3. ShipmentEvents
CREATE TABLE ShipmentEvents (
    ShipmentId     VARCHAR(30)  NOT NULL PRIMARY KEY,
    MedicineCode   VARCHAR(30)  NOT NULL,
    ManufacturerId VARCHAR(30)  NOT NULL,
    DistributorId  VARCHAR(30)  NOT NULL DEFAULT 'DIST-01',
    Quantity       INT          NOT NULL,
    Status         VARCHAR(20)  NOT NULL DEFAULT 'DISPATCHED',
    ShipmentDate   DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_Shipment_Product
        FOREIGN KEY (MedicineCode) REFERENCES ProductMaster(MedicineCode),

    CONSTRAINT FK_Shipment_Manufacturer
        FOREIGN KEY (ManufacturerId) REFERENCES Manufacturers(ManufacturerId),

    CONSTRAINT CHK_Shipment_Quantity
        CHECK (Quantity > 0),

    CONSTRAINT CHK_Shipment_Status
        CHECK (Status IN ('DISPATCHED', 'CANCELLED'))
);

-- 4. Index for Inventory API's aggregation query
CREATE INDEX IX_ShipmentEvents_MedicineCode
    ON ShipmentEvents (MedicineCode);

-- 5. Index for querying shipments by manufacturer
CREATE INDEX IX_ShipmentEvents_ManufacturerId
    ON ShipmentEvents (ManufacturerId);