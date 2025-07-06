const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { prompt, model } = req.body;

  if (!prompt || !model) {
    return res.status(400).json({ reply: "Missing prompt or model." });
  }

  try {
    const hfRes = await fetch(`https://api-inference.huggingface.co/models/ ${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 200, temperature: 0.7 }
      })
    });

    if (!hfRes.ok) {
      console.error("HF API Error:", await hfRes.text());
      return res.status(500).json({ reply: "Error from Hugging Face API." });
    }

    const data = await hfRes.json();
    const reply = data.generated_text || "No response.";
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ reply: "Internal server error." });
  }
};
