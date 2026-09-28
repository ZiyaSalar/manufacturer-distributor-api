// const { BlobServiceClient } = require("@azure/storage-blob");

// const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

// console.log(
//   "Storage connection string exists:",
//   !!process.env.AZURE_STORAGE_CONNECTION_STRING
// );

// console.log(
//   "Storage container:",
//   process.env.AZURE_STORAGE_CONTAINER_NAME
// );

// const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

// const blobServiceClient =
//   BlobServiceClient.fromConnectionString(connectionString);

// const containerClient =
//   blobServiceClient.getContainerClient(containerName);


const {
BlobServiceClient
} = require('@azure/storage-blob');

const connectionString =
process.env.AZURE_STORAGE_CONNECTION_STRING;

const containerName =
process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!connectionString) {
throw new Error(
'AZURE_STORAGE_CONNECTION_STRING is not configured'
);
}

if (!containerName) {
throw new Error(
'AZURE_STORAGE_CONTAINER_NAME is not configured'
);
}

const blobServiceClient =
BlobServiceClient.fromConnectionString(connectionString);

const containerClient =
blobServiceClient.getContainerClient(containerName);

async function uploadFile(fileBuffer, blobFileName, contentType) {
if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
throw new Error('A non-empty file buffer is required');
}

if (!blobFileName) {
throw new Error('A blob filename is required');
}

await containerClient.createIfNotExists();

const blockBlobClient =
containerClient.getBlockBlobClient(blobFileName);

await blockBlobClient.uploadData(fileBuffer, {
blobHTTPHeaders: {
blobContentType: contentType || 'application/octet-stream'
}
});

console.log(`File uploaded successfully: ${blobFileName}`);
return blockBlobClient.url;
}

module.exports = {
uploadFile
};