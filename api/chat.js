const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { prompt, model } = req.body;

  if (!prompt || !model) {
    return res.status(400).json({ reply: "Missing prompt or model." });
  }

  try {
    // First attempt
    let hfRes = await fetch(`https://api-inference.huggingface.co/models/ ${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 200, temperature: 0.7 }
      })
    });

    // If first attempt fails, retry once
    if (!hfRes.ok) {
      console.warn("First attempt failed, retrying...");
      hfRes = await fetch(`https://api-inference.huggingface.co/models/ ${model}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 200, temperature: 0.7 }
        })
      });
    }

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      console.error("HF API Error:", errText);
      return res.status(500).json({ reply: "Error from Hugging Face API." });
    }

    const data = await hfRes.json();

    if (!data || !data.generated_text) {
      console.warn("Empty response from AI model:", data);
      return res.status(200).json({ reply: "No response generated." });
    }

    return res.status(200).json({ reply: data.generated_text });

  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ reply: "Internal server error." });
  }
};
