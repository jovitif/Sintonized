const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(express.json());

const validCommands = ['ligar', 'desligar'];

const handleInstrumentControl = (text) => {
    text = text.toLowerCase();
    if (text.includes('ligar')) {
        return 'Instrumento ligado';
    } else if (text.includes('desligar')) {
        return 'Instrumento desligado';
    }
    return null;
};

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Lista de efeitos válidos
const validEffects = [
    "triangle", "sine", "square", "sawtooth", "custom",
];


const filterValidEffects = (responseText) => {
    if (!responseText) return [];
    responseText = responseText
        .replace(/[\*\_\-\`\(\)\[\]\{\}\!\@\#\$\%\^\&\*\+\=\|\;\:\"\<\>\,\.\/\?\~\']/g, '')
        .replace(/\n/g, ',')
        .replace(/\s+/g, ' ')
        .trim();
    const effects = responseText.split(',').map(effect => effect.trim());
    return effects.filter(effect => validEffects.includes(effect));
};


const genAI = new GoogleGenerativeAI("AIzaSyBKLeV2eKbCytROhrym_W7bAM_4U3ECJrI");

const modelId = "gemini-1.5-pro";
const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    recipe_name: {
                        type: "string",
                    },
                },
            },
        },
    },
});

app.post('/echo', async (req, res) => {
    try {
        const text = req.body.text;

        // Verificar comandos de controle
        const controlResponse = handleInstrumentControl(text);
        if (controlResponse) {
            return res.json({ response: controlResponse });
        }

        const effectsList = validEffects.join(', ');

        const prompt = `Tenho esses: ${effectsList} da web audio API. Com base na descrição fornecida, "${text}", retorne somente o efeito que represente esse texto`;

        console.log(`Prompt enviado: ${prompt}`);

        const chat = model.startChat({
            generationConfig: {
                maxOutputTokens: 100,
            },
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const responseText = response.text();

        console.log(`Resposta gerada: ${responseText}`);

        res.json({ response: responseText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
