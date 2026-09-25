require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// ===============================
// CONFIGURAÇÃO
// ===============================

const OLLAMA_URL = "https://ollama.com";
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;

const MODELO = "gemma4:31b";

// ===============================
// EXPRESS
// ===============================

app.use(express.json({ limit: "30mb" }));

// ===============================
// VERIFICAÇÃO GOOGLE
// ===============================

app.get("/google5540b8b6e8a3bbeb.html", function (req, res) {
    res.type("text/plain");
    res.send(
        "google-site-verification: google5540b8b6e8a3bbeb.html"
    );
});

// ===============================
// SITEMAP
// ===============================

app.get("/sitemap.xml", function (req, res) {
    res.send("SITEMAP DO MEU AI FUNCIONANDO");
});

// ===============================
// SERVIR O MEU AI
// ===============================

app.use(express.static(__dirname));

// ===============================
// PÁGINA PRINCIPAL
// ===============================

app.get("/", function (req, res) {
    res.sendFile(
        path.join(__dirname, "index.html")
    );
});

// ===============================
// MANIFEST
// ===============================

app.get("/manifest.json", function (req, res) {
    res.sendFile(
        path.join(__dirname, "manifest.json")
    );
});

// ===============================
// SERVICE WORKER
// ===============================

app.get("/sw.js", function (req, res) {
    res.sendFile(
        path.join(__dirname, "sw.js")
    );
});

// ===============================
// ÍCONES
// ===============================

app.get("/icon-192.png", function (req, res) {
    res.sendFile(
        path.join(__dirname, "icon-192.png")
    );
});

app.get("/icon-512.png", function (req, res) {
    res.sendFile(
        path.join(__dirname, "icon-512.png")
    );
});

// ===============================
// TESTE
// ===============================

app.get("/teste", function (req, res) {
    res.send("🤖 VERSÃO NOVA DO MEU AI");
});

// ===============================
// TESTE OLLAMA
// ===============================

app.get("/teste-ollama", async function (req, res) {

    try {

        if (!OLLAMA_API_KEY) {

            return res.status(500).json({
                ollama: "erro",
                mensagem:
                    "OLLAMA_API_KEY não está configurada no Render."
            });
        }

        const resposta = await fetch(
            `${OLLAMA_URL}/api/tags`,
            {
                method: "GET",
                headers: {
                    "Authorization":
                        `Bearer ${OLLAMA_API_KEY}`
                }
            }
        );

        const texto =
            await resposta.text();

        res.status(resposta.status).send(texto);

    } catch (erro) {

        res.status(500).json({
            ollama: "erro",
            erro: erro.message
        });
    }
});

// ===============================
// CHAT COM OLLAMA CLOUD
// ===============================

app.post("/api/chat", async function (req, res) {

    try {

        const messages =
            Array.isArray(req.body.messages)
                ? req.body.messages
                : [];

        if (!OLLAMA_API_KEY) {

            return res.status(500).json({
                reply:
                    "A chave OLLAMA_API_KEY não está configurada no Render."
            });
        }

        if (messages.length === 0) {

            return res.status(400).json({
                reply:
                    "Não recebi nenhuma mensagem."
            });
        }

        const mensagens = [
            {
                role: "system",
                content: `
Tu és o Meu AI.

Responde sempre em português.

Sê natural, simples e direto.

Não inventes informações.

Para perguntas simples,
responde de forma curta.

Quando for necessário explicar,
usa passos claros.

Ajuda o utilizador de forma amigável.
`
            },

            ...messages.slice(-10)
        ];

        console.log("");
        console.log("==============================");
        console.log("🤖 MEU AI");
        console.log("☁️ A contactar Ollama Cloud...");
        console.log("🧠 Modelo:", MODELO);

        const resposta = await fetch(
            `${OLLAMA_URL}/api/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${OLLAMA_API_KEY}`
                },

                body: JSON.stringify({

                    model: MODELO,

                    messages: mensagens,

                    stream: false,

                    options: {
                        temperature: 0.4,
                        num_predict: 300
                    }
                })
            }
        );

        const dados =
            await resposta.json();

        if (!resposta.ok) {

            console.error(
                "Erro Ollama:",
                dados
            );

            return res.status(
                resposta.status
            ).json({
                reply:
                    "O Ollama Cloud devolveu um erro.",
                error:
                    dados
            });
        }

        const respostaFinal =
            dados &&
            dados.message &&
            dados.message.content
                ? dados.message.content
                : "Não consegui gerar uma resposta.";

        console.log("✅ Resposta recebida!");
        console.log("==============================");

        res.json({
            reply: respostaFinal
        });

    } catch (erro) {

        console.error(
            "❌ ERRO NO CHAT:",
            erro
        );

        res.status(500).json({
            reply:
                "Não consegui contactar o Ollama Cloud.",
            error:
                erro.message
        });
    }
});

// ===============================
// INICIAR SERVIDOR
// ===============================

app.listen(
    PORT,
    "0.0.0.0",
    function () {

        console.log("");
        console.log(
            "========================================"
        );

        console.log("🤖 MEU AI");

        console.log(
            `🌐 Servidor iniciado na porta ${PORT}`
        );

        console.log(
            `☁️ Ollama Cloud: ${OLLAMA_URL}`
        );

        console.log(
            `🧠 Modelo: ${MODELO}`
        );

        console.log(
            "🚀 MODO CLOUD ATIVADO!"
        );

        console.log(
            "========================================"
        );

        console.log("");
    }
);
