import express from 'express'
import cors from 'cors'
import {AzureChatOpenAI, AzureOpenAIEmbeddings} from "@langchain/openai";
import {AIMessage, HumanMessage, SystemMessage} from "@langchain/core/messages";
import {FaissStore} from "@langchain/community/vectorstores/faiss";

const model = new AzureChatOpenAI({
    temperature: 0.5,
    verbose: false,
});

const embeddings = new AzureOpenAIEmbeddings({
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
});

let vectorStore;

const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

function convertMessages(rawMessage) {
    return rawMessage
        .filter(msg => typeof msg.content === "string" && msg.content.trim() !== "")
        .map((msg) => {
            if (msg.role === "user") {
                return new HumanMessage({ content: msg.content });
            } else if (msg.role === "assistant") {
                return new AIMessage({ content: msg.content });
            } else {
                return null;
            }
        })
        .filter(msg => msg !== null);
}

function giveContext(books) {
    return `Je hebt de rol van een zeer creatieve schrijver.
                    En hebt veel kennis over the Hunger games.
                    Ook ben je in staat om nieuwe hoofdstukken te schrijven of hoofdstukken compleet te herschrijven.
                    En kan je alternatieve eindes bedenken.

                    ${books}`

}


app.get('/', (req, res) => {
    res.json({ message: 'Server is actief! Gebruik POST om een prompt te sturen.' })

    const prompt = req.body.prompt
    console.log("Gebruikersprompt:", prompt)
})

app.post("/", async (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const { messages } = req.body

    try {
        const lastUserMessage = messages?.filter(m => m.role === "user").at(-1)?.content || "";
        const relevantDocs = await vectorStore.similaritySearch(lastUserMessage, 3);
        const books = relevantDocs.map(doc => doc.pageContent).join("\n\n");

        const context = giveContext({
          books
        });

        const chatMessages = [
            new SystemMessage(context),
            ...convertMessages(messages)
        ];

        const stream = await model.stream(chatMessages)
        let ai = ''

        for await (const chunk of stream) {
            await new Promise(resolve => setTimeout(resolve,60));
            res.write(chunk.content);
            ai += chunk.content;
        }

        res.end()

    } catch (error) {
        console.error("Fout tijdens het verwerken van de vraag:", error)
        res.status(500).json({ error: "Interne serverfout" })
    }
})

async function loadVectorStore() {
    vectorStore = await FaissStore.load("./server/myEmbeddings/", embeddings);
    console.log("Vector store geladen");
}

loadVectorStore().then(() => {
    app.listen(3000, () => console.log("Server draait op http://localhost:3000"))
})
