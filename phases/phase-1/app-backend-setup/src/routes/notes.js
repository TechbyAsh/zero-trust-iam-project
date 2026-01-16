import express from 'express';
import { uploadNote, fetchNote } from '../services/s3Service.js';

const router = express.Router();

router.post('/upload', async (req, res, next) => {
  try {
    const { userId, noteId, encryptedData } = req.body;

    if (!userId || !noteId || !encryptedData) {
      return res.status(400).json({
        error: 'Missing required fields: userId, noteId, encryptedData'
      });
    }

    const result = await uploadNote(userId, noteId, encryptedData);

    res.status(200).json({
      success: true,
      message: 'Note uploaded successfully',
      key: result.key,
      etag: result.etag
    });
  } catch (error) {
    next(error);
  }
});

router.get('/fetch', async (req, res, next) => {
  try {
    const { userId, noteId } = req.query;

    if (!userId || !noteId) {
      return res.status(400).json({
        error: 'Missing required query parameters: userId, noteId'
      });
    }

    const encryptedData = await fetchNote(userId, noteId);

    res.status(200).json({
      success: true,
      encryptedData,
      noteId,
      userId
    });
  } catch (error) {
    next(error);
  }
});

export default router;
