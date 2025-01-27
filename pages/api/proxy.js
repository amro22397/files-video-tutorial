import https from "https";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing video URL" });
  }

  try {
    // Decode the URL to handle special characters
    const videoUrl = decodeURIComponent(url);

    // Pipe the video from the remote URL to the client
    https.get(videoUrl, (response) => {
      res.writeHead(response.statusCode, response.headers);
      response.pipe(res);
    }).on("error", (err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch video" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
