let currentConversation = [];
let conversations = [];

let voiceEnabled = true;
let selectedFile = null;
let selectedImage = null;


// ===============================
// NOVA CONVERSA
// ===============================

function newChat() {
    currentConversation = [];

    const chat = document.getElementById("chat");

    chat.innerHTML = `
        <div class="welcome" id="welcome">
            <div class="robot">🤖</div>

            <h1>Olá! Eu sou o Meu AI</h1>

            <p>Pergunta-me qualquer coisa.</p>

            <div class="suggestions">
                <button onclick="suggest('Explica-me como funciona a inteligência artificial')">
                    🧠 Explicar IA
                </button>

                <button onclick="suggest('Ajuda-me a criar um programa')">
                    💻 Programar
                </button>

                <button onclick="suggest('Dá-me uma ideia para um projeto')">
                    💡 Ideias
                </button>

                <button onclick="suggest('Conta-me uma curiosidade')">
                    🌎 Curiosidade
                </button>
            </div>
        </div>
    `;

    document.getElementById("messageInput").value = "";
}


// ===============================
// ENVIAR MENSAGEM
// ===============================

async function sendMessage() {

    const input =
        document.getElementById("messageInput");

    const text =
        input.value.trim();

    if (!text && !selectedImage && !selectedFile) {
        return;
    }

    const welcome =
        document.getElementById("welcome");

    if (welcome) {
        welcome.remove();
    }

    if (text) {

        addMessage(
            text,
            "user-message"
        );

        currentConversation.push({
            role: "user",
            content: text
        });

    }

    input.value = "";

    showThinking();

    try {

        const body = {
            messages: currentConversation
        };

        if (selectedFile) {
            body.file = selectedFile;
        }

        if (selectedImage) {
            body.image = selectedImage;
        }

        const resposta =
            await fetch("/api/chat", {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(body)
            });

        const dados =
            await resposta.json();

        removeThinking();

        const reply =
            dados.reply ||
            "Não consegui gerar uma resposta.";

        addMessage(
            reply,
            "ai-message"
        );

        currentConversation.push({
            role: "assistant",
            content: reply
        });

        if (voiceEnabled) {
            speakText(reply);
        }

        selectedFile = null;
        selectedImage = null;

    } catch (erro) {

        removeThinking();

        addMessage(
            "Não consegui contactar a IA. Verifica se o servidor está aberto.",
            "ai-message"
        );

        console.error(erro);
    }
}


// ===============================
// MOSTRAR MENSAGEM
// ===============================

function addMessage(
    text,
    className
) {

    const chat =
        document.getElementById("chat");

    const message =
        document.createElement("div");

    message.className =
        `message ${className}`;

    message.textContent =
        text;

    chat.appendChild(message);

    chat.scrollTop =
        chat.scrollHeight;
}


// ===============================
// PENSANDO
// ===============================

function showThinking() {

    const chat =
        document.getElementById("chat");

    const thinking =
        document.createElement("div");

    thinking.id =
        "thinking";

    thinking.className =
        "message ai-message";

    thinking.textContent =
        "🤔 A pensar...";

    chat.appendChild(thinking);

    chat.scrollTop =
        chat.scrollHeight;
}


function removeThinking() {

    const thinking =
        document.getElementById("thinking");

    if (thinking) {
        thinking.remove();
    }
}


// ===============================
// SUGESTÕES
// ===============================

function suggest(text) {

    const input =
        document.getElementById("messageInput");

    input.value =
        text;

    sendMessage();
}


// ===============================
// ENTER
// ===============================

function handleKey(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();
    }
}


// ===============================
// TEMA
// ===============================

function toggleTheme() {

    document.body.classList.toggle(
        "light-theme"
    );
}


// ===============================
// SIDEBAR
// ===============================

function toggleSidebar() {

    const sidebar =
        document.querySelector(".sidebar");

    if (!sidebar) return;

    if (
        sidebar.style.display === "none"
    ) {

        sidebar.style.display =
            "flex";

    } else {

        sidebar.style.display =
            "none";
    }
}


// ===============================
// DEFINIÇÕES
// ===============================

function showSettings() {

    const modal =
        document.getElementById(
            "settingsModal"
        );

    if (modal) {
        modal.style.display =
            "flex";
    }
}


function closeSettings() {

    const modal =
        document.getElementById(
            "settingsModal"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}


function saveSettings() {

    const name =
        document.getElementById(
            "assistantName"
        ).value;

    const welcome =
        document.getElementById(
            "welcomeMessage"
        ).value;

    localStorage.setItem(
        "assistantName",
        name
    );

    localStorage.setItem(
        "welcomeMessage",
        welcome
    );

    const title =
        document.querySelector(
            ".topbar span"
        );

    if (title && name) {
        title.textContent =
            name;
    }

    const welcomeTitle =
        document.querySelector(
            "#welcome h1"
        );

    if (
        welcomeTitle &&
        welcome
    ) {
        welcomeTitle.textContent =
            welcome;
    }

    closeSettings();
}


// ===============================
// VOZ
// ===============================

function toggleVoice() {

    voiceEnabled =
        !voiceEnabled;

    const button =
        document.getElementById(
            "voiceToggle"
        );

    if (button) {

        button.textContent =
            voiceEnabled
                ? "🔊"
                : "🔇";
    }

    if (!voiceEnabled) {

        speechSynthesis.cancel();
    }
}


function speakText(text) {

    if (
        !voiceEnabled ||
        !("speechSynthesis" in window)
    ) {
        return;
    }

    speechSynthesis.cancel();

    const fala =
        new SpeechSynthesisUtterance(
            text
        );

    fala.lang =
        "pt-PT";

    fala.rate =
        0.95;

    speechSynthesis.speak(
        fala
    );
}


// ===============================
// MICROFONE
// ===============================

function startVoice() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert(
            "O reconhecimento de voz não é suportado neste navegador."
        );

        return;
    }

    const recognition =
        new SpeechRecognition();

    recognition.lang =
        "pt-PT";

    recognition.interimResults =
        false;

    recognition.maxAlternatives =
        1;

    recognition.start();

    recognition.onresult =
        function(event) {

            const texto =
                event.results[0][0].transcript;

            const input =
                document.getElementById(
                    "messageInput"
                );

            input.value =
                texto;
        };

    recognition.onerror =
        function(erro) {

            console.error(
                "Erro no microfone:",
                erro
            );
        };
}


// ===============================
// FICHEIROS
// ===============================

async function uploadFile() {

    const input =
        document.getElementById(
            "fileInput"
        );

    if (
        !input.files ||
        !input.files.length
    ) {
        return;
    }

    const file =
        input.files[0];

    const reader =
        new FileReader();

    reader.onload =
        function(event) {

            selectedFile = {
                name: file.name,
                type:
                    file.type ===
                    "application/pdf"
                        ? "pdf"
                        : "text",
                content:
                    event.target.result
            };

            const inputMessage =
                document.getElementById(
                    "messageInput"
                );

            inputMessage.value =
                `Ficheiro selecionado: ${file.name}`;
        };

    reader.readAsText(file);
}


// ===============================
// IMAGENS
// ===============================

function uploadImage() {

    const input =
        document.getElementById(
            "imageInput"
        );

    if (
        !input.files ||
        !input.files.length
    ) {
        return;
    }

    const file =
        input.files[0];

    const reader =
        new FileReader();

    reader.onload =
        function(event) {

            selectedImage =
                event.target.result;

            const inputMessage =
                document.getElementById(
                    "messageInput"
                );

            inputMessage.value =
                "Imagem selecionada. Escreve o que queres saber sobre ela.";
        };

    reader.readAsDataURL(file);
}


// ===============================
// BONECO
// ===============================

function abrirBoneco() {

    alert(
        "🧍 O boneco do Meu AI será adicionado nesta próxima etapa."
    );
}


// ===============================
// CARREGAR DEFINIÇÕES
// ===============================

window.addEventListener(
    "load",
    function() {

        const name =
            localStorage.getItem(
                "assistantName"
            );

        const welcome =
            localStorage.getItem(
                "welcomeMessage"
            );

        if (name) {

            const title =
                document.querySelector(
                    ".topbar span"
                );

            if (title) {
                title.textContent =
                    name;
            }

            const input =
                document.getElementById(
                    "assistantName"
                );

            if (input) {
                input.value =
                    name;
            }
        }

        if (welcome) {

            const title =
                document.querySelector(
                    "#welcome h1"
                );

            if (title) {
                title.textContent =
                    welcome;
            }

            const input =
                document.getElementById(
                    "welcomeMessage"
                );

            if (input) {
                input.value =
                    welcome;
            }
        }
    }
);
