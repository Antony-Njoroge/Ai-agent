const axios = require('axios');

module.exports = async (req, res) => {
  const { prompt, model } = req.body;

  try {
    const hfRes = await axios.post(
      `https://api-inference.huggingface.co/models/ ${model}`,
      {
        inputs: prompt,
        parameters: { max_new_tokens: 200, temperature: 0.7 }
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const reply = hfRes.data.generated_text || "No response.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error." });
  }
};
