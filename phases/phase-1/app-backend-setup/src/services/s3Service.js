import AWS from 'aws-sdk';

const s3 = new AWS.S3();

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'privateme-notes';

export async function uploadNote(userId, noteId, encryptedData) {
  const key = `users/${userId}/notes/${noteId}.enc`;

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: Buffer.from(encryptedData, 'base64'),
    ContentType: 'application/octet-stream',
    ServerSideEncryption: 'AES256',
    Metadata: {
      userId,
      noteId,
      uploadedAt: new Date().toISOString()
    }
  };

  try {
    const result = await s3.putObject(params).promise();
    console.log(`✅ Uploaded note: ${key}`);
    
    return {
      key,
      etag: result.ETag,
      versionId: result.VersionId
    };
  } catch (error) {
    console.error(`❌ S3 upload error:`, error);
    throw new Error(`Failed to upload note: ${error.message}`);
  }
}

export async function fetchNote(userId, noteId) {
  const key = `users/${userId}/notes/${noteId}.enc`;

  const params = {
    Bucket: BUCKET_NAME,
    Key: key
  };

  try {
    const result = await s3.getObject(params).promise();
    console.log(`✅ Retrieved note: ${key}`);
    
    return result.Body.toString('base64');
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      throw new Error('Note not found');
    }
    console.error(`❌ S3 fetch error:`, error);
    throw new Error(`Failed to fetch note: ${error.message}`);
  }
}
