import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

app.get('/audio/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        const response = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Forward headers
        res.set({
            'Content-Type': response.headers.get('content-type'),
            'Content-Length': response.headers.get('content-length'),
            'Accept-Ranges': 'bytes'
        });
        
        // Stream the response
        response.body.pipe(res);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch audio file' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});