import { AzureOpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from 'dotenv';

dotenv.config();

const embeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
});

async function createEmbedding() {
    console.log("Starting to create embeddings...");
    console.log("Environment variables loaded:", {
        version: process.env.AZURE_OPENAI_API_VERSION,
        instance: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
        deployment: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
    });

    try {
        const loader = new TextLoader("./files/hunger_games.txt");
        const data = await loader.load();
        console.log(`Loaded ${data.length} documents`);

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 2000,
            chunkOverlap: 400,
        });

        const splitDocs = await textSplitter.splitDocuments(data);
        console.log(`Split into ${splitDocs.length} chunks`);

        console.log("Creating vector store...");
        const vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);

        console.log("Saving vector store...");
        await vectorStore.save("myEmbeddings");

        console.log("Vector store saved successfully!");
    } catch (error) {
        console.error("Error creating embeddings:", error);
    }
}

createEmbedding().then(() => {
    console.log("Embedding process completed");
}).catch(err => {
    console.error("Fatal error in embedding process:", err);
    process.exit(1);
});