require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/buscar", async (req, res) => {
  const { pergunta } = req.body;

  if (!pergunta) {
    return res.status(400).json({ erro: "Campo 'pergunta' é obrigatório" });
  }

  try {
    const resposta = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.GPT_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista em buscar ofertas reais na internet. Use sites confiáveis como Mercado Livre, Amazon, Shopee e Shein. Sempre inclua o link da oferta, o preço e a confiabilidade do vendedor.",
          },
          {
            role: "user",
            content: `Procure por: ${pergunta}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GPT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resultado = resposta.data.choices[0].message.content;
    res.json({ resposta: resultado });
  } catch (erro) {
    console.error("Erro ao consultar GPT:", erro.message);
    res.status(500).json({ erro: "Erro ao buscar ofertas" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
