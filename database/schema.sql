-- ============================================
-- Manufacturer-to-Distributor API Database Schema
-- Database: capstonedb (Azure SQL)
-- ============================================

-- 1. Manufacturers
-- One row per manufacturer. Rarely changes.
CREATE TABLE Manufacturers (
    ManufacturerId   VARCHAR(30)  NOT NULL PRIMARY KEY,
    ManufacturerName VARCHAR(150) NOT NULL,
    CreatedAt        DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);

-- 2. ProductMaster
-- One row per medicine. Each medicine belongs to exactly one manufacturer.
CREATE TABLE ProductMaster (
    MedicineCode   VARCHAR(30)  NOT NULL PRIMARY KEY,
    MedicineName   VARCHAR(120) NOT NULL,
    ManufacturerId VARCHAR(30)  NOT NULL,
    Status         VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    CreatedAt      DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_Product_Manufacturer
        FOREIGN KEY (ManufacturerId) REFERENCES Manufacturers(ManufacturerId),

    CONSTRAINT CHK_Product_Status
        CHECK (Status IN ('ACTIVE', 'INACTIVE'))
);

-- 3. ShipmentEvents
-- One row per shipment event. Grows continuously — this is your event log.
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

-- 4. Index to make Inventory API's aggregation query fast
-- Inventory API runs: SUM(Quantity) WHERE MedicineCode = ... constantly.
-- Without this index, that query scans the whole table as it grows.
CREATE INDEX IX_ShipmentEvents_MedicineCode
    ON ShipmentEvents (MedicineCode);

-- 5. Index for querying shipments by manufacturer (used by Shipment API)
CREATE INDEX IX_ShipmentEvents_ManufacturerId
    ON ShipmentEvents (ManufacturerId);