// const express = require('express');
// const { sql, getPool } = require('../db');
// const { uploadFile } = require('../blobstorage');
// const multer = require('multer');

// const router = express.Router();

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { 
//     fileSize: 10 * 1024 * 1024 
//   } // limit file size to 10MB
// });


// // POST /products — create a new medicine
// router.post('/', upload.single('productDocument'), async (req, res) => {
//   const { medicineCode, medicineName, manufacturerId, status } = req.body;

//   if (!medicineCode || !medicineName || !manufacturerId) {
//     return res.status(400).json({
//       error: 'medicineCode, medicineName and manufacturerId are required'
//     });
//   }

//   try {

//     // upload product doucment to Azure Blob Storage 
//     let documentUrl = null;
//     if(req.file){
//       const blobFileName = `${medicineCode}-${req.file.originalname}`;
//       documentUrl = await uploadFile(
//         req.file.buffer,
//         blobFileName,
//         req.file.mimetype
//       );
//     }

//     // connect to the database and insert the new product
//     const pool = await getPool();
//     await pool.request()
//       .input('medicineCode', sql.VarChar, medicineCode)
//       .input('medicineName', sql.VarChar, medicineName)
//       .input('manufacturerId', sql.VarChar, manufacturerId)
//       .input('status', sql.VarChar, status || 'ACTIVE')
//       .input('documentUrl', sql.VarChar, documentUrl)
//       .query(`
//         INSERT INTO ProductMaster (MedicineCode, MedicineName, ManufacturerId, Status, DocumentUrl)
//         VALUES (@medicineCode, @medicineName, @manufacturerId, @status, @documentUrl)
//       `);

//     res.status(201).json({ medicineCode, medicineName, manufacturerId, status: status || 'ACTIVE' , documentUrl});
//   } catch (err) {
//     if (err.number === 2627) {
//       // SQL Server's duplicate primary key error code
//       return res.status(409).json({ error: `Product ${medicineCode} already exists` });
//     }
//     if (err.number === 547) {
//       // SQL Server's foreign key violation error code
//       return res.status(400).json({ error: `manufacturerId ${manufacturerId} does not exist` });
//     }
//     console.error(err);
//     res.status(500).json({ error: 'Database error while creating product' });
//   }
// });

// // GET /products — list all medicines
// router.get('/', async (req, res) => {
//   try {
//     const pool = await getPool();
//     const result = await pool.request().query('SELECT * FROM ProductMaster');
//     res.json(result.recordset);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database error while fetching products' });
//   }
// });

// // GET /products/:code — get one medicine by code
// router.get('/:code', async (req, res) => {
//   try {
//     const pool = await getPool();
//     const result = await pool.request()
//       .input('code', sql.VarChar, req.params.code)
//       .query('SELECT * FROM ProductMaster WHERE MedicineCode = @code');

//     if (result.recordset.length === 0) {
//       return res.status(404).json({ error: `Product ${req.params.code} not found` });
//     }
//     res.json(result.recordset[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database error while fetching product' });
//   }
// });

// module.exports = router;





const express = require('express');
const multer = require('multer');
const { sql, getPool } = require('../db');
const { uploadFile } = require('../blobstorage');

const router = express.Router();

const upload = multer({
storage: multer.memoryStorage(),
limits: {
fileSize: 10 * 1024 * 1024
}
});

// POST /products - create a new medicine and optionally upload its document.
router.post('/', upload.single('productDocument'), async (req, res) => {
const {
medicineCode,
medicineName,
manufacturerId,
status
} = req.body || {};

if (!medicineCode || !medicineName || !manufacturerId) {
return res.status(400).json({
error: 'medicineCode, medicineName and manufacturerId are required'
});
}

try {
let documentUrl = null;

if (req.file) {
const safeOriginalName = req.file.originalname.replace(
/[^a-zA-Z0-9._-]/g,
'_'
);
const blobFileName = `${medicineCode}-${Date.now()}-${safeOriginalName}`;

documentUrl = await uploadFile(
req.file.buffer,
blobFileName,
req.file.mimetype
);
}

const pool = await getPool();

await pool.request()
.input('medicineCode', sql.VarChar, medicineCode)
.input('medicineName', sql.VarChar, medicineName)
.input('manufacturerId', sql.VarChar, manufacturerId)
.input('status', sql.VarChar, status || 'ACTIVE')
.input('documentUrl', sql.VarChar, documentUrl)
.query(`
INSERT INTO ProductMaster
(MedicineCode, MedicineName, ManufacturerId, Status, DocumentUrl)
VALUES
(@medicineCode, @medicineName, @manufacturerId, @status, @documentUrl)
`);

return res.status(201).json({
medicineCode,
medicineName,
manufacturerId,
status: status || 'ACTIVE',
documentUrl
});
} catch (err) {
if (err.number === 2627 || err.number === 2601) {
return res.status(409).json({
error: `Product ${medicineCode} already exists`
});
}

if (err.number === 547) {
return res.status(400).json({
error: `manufacturerId ${manufacturerId} does not exist`
});
}

console.error('Create product failed:', err);
return res.status(500).json({
error: 'Product creation failed'
});
}
});

// GET /products - list all medicines.
router.get('/', async (req, res) => {
try {
const pool = await getPool();
const result = await pool.request().query('SELECT * FROM ProductMaster');
return res.json(result.recordset);
} catch (err) {
console.error('Fetch products failed:', err);
return res.status(500).json({
error: 'Database error while fetching products'
});
}
});

// GET /products/:code - get one medicine by code.
router.get('/:code', async (req, res) => {
try {
const pool = await getPool();
const result = await pool.request()
.input('code', sql.VarChar, req.params.code)
.query(`
SELECT *
FROM ProductMaster
WHERE MedicineCode = @code
`);

if (result.recordset.length === 0) {
return res.status(404).json({
error: `Product ${req.params.code} not found`
});
}

return res.json(result.recordset[0]);
} catch (err) {
console.error('Fetch product failed:', err);
return res.status(500).json({
error: 'Database error while fetching product'
});
}
});

module.exports = router;