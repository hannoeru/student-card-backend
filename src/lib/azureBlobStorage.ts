import { Readable } from 'stream'
import multer, { StorageEngine } from 'multer'
import { BlobServiceClient, BlobUploadCommonResponse, BlockBlobUploadStreamOptions } from '@azure/storage-blob'
import { AbortController } from '@azure/abort-controller'

const {
  AZURE_STORAGE_CONNECTION_STRING: azureBlobUrl,
  AZURE_STORAGE_CONTAINER_NAME: containerName,
} = process.env

const ONE_MEGABYTE = 1024 * 1024
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 }

const controller = new AbortController()

const blobServiceClient = BlobServiceClient.fromConnectionString(azureBlobUrl)

export const useAzureBlobStorage = (stream: Readable, blobName: string, mimetype: string, userId: string): Promise<BlobUploadCommonResponse> => {
  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  const streamOptions: BlockBlobUploadStreamOptions = {
    blobHTTPHeaders: {
      blobContentType: mimetype,
    },
    metadata: { userId },
  }

  return blockBlobClient.uploadStream(stream, uploadOptions.bufferSize, uploadOptions.maxBuffers, streamOptions)
}
