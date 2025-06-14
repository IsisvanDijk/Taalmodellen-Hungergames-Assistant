# Hunger Games AI Assistant

Een creatieve AI-aangedreven chat-applicatie waarmee gebruikers de wereld van The Hunger Games kunnen verkennen door middel van interactieve gesprekken. De AI kan het boek bespreken, alternatieve verhaallijnen creëren, hoofdstukken herschrijven en creatieve inzichten geven over Panem en de personages.

## Functies

- **Interactieve Chat Interface**: Themed UI met Hunger Games styling
- **Streaming Responses**: Real-time AI-antwoorden met vloeiende streaming
- **Context-Aware AI**: Gebruikt vector embeddings voor relevante boekkennis
- **Creatief Schrijven**: Genereer alternatieve eindes, nieuwe hoofdstukken en karakterperspectieven
- **Reset Functionaliteit**: Begin op elk moment een nieuw gesprek

## Architectuur

- **Frontend**: Vanilla HTML, CSS en JavaScript
- **Backend**: Node.js met Express
- **AI Integratie**: Azure OpenAI met LangChain
- **Vector Database**: FAISS voor semantic search
- **Document Processing**: Tekst splitsen en embedding generatie

## Vereisten

- Node.js (v16 of hoger)
- Azure OpenAI account met API toegang
- The Hunger Games tekstbestand voor embeddings

## Installatie

### 1. Repository Klonen

```bash
git clone <repository-url>
cd Taalmodellen-back-end
```

### 2. Dependencies Installeren

```bash
npm install
```

### 3. Environment Setup

Maak een `.env` bestand aan in de root directory met je Azure OpenAI credentials:

```env
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_API_INSTANCE_NAME=your_instance_name
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_API_DEPLOYMENT_NAME=your_chat_deployment_name
AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME=your_embeddings_deployment_name
```

### 4. Tekstdata Voorbereiden

**Let op**: Vanwege auteursrechtelijke beperkingen is het daadwerkelijke Hunger Games tekstbestand niet inbegrepen in deze repository.

Je moet je eigen kopie van "The Hunger Games" tekst verkrijgen en deze plaatsen op:
```
server/files/hunger_games.txt
```

**Juridische Opmerking**: Zorg ervoor dat je het wettelijke recht hebt om het tekstbestand te gebruiken voor persoonlijke/educatieve doeleinden. Dit project is alleen ontworpen voor educatief gebruik.

### 5. Embeddings Genereren

Voer het embedding script uit om de vector database te maken:

```bash
node server/embedding.js
```

Dit zal:
- Het Hunger Games tekstbestand laden
- Het opsplitsen in chunks
- Embeddings genereren met Azure OpenAI
- De vector store opslaan naar `server/myEmbeddings/`

### 6. Server Starten

```bash
node server/server.js
```

De server start op `http://localhost:3000`

### 7. Client Openen

Open `http://localhost:3000` in je webbrowser:

## Gebruik

1. Open de webinterface
2. Typ je vragen over The Hunger Games in de chat input
3. Vraag om creatieve content zoals:
   - "Herschrijf het einde van The Hunger Games"
   - "Wat als Peeta uit District 1 kwam?"
   - "Schrijf een nieuw hoofdstuk vanuit Gale's perspectief"
4. Gebruik "Start the new games" om het gesprek te resetten

## Project Structuur

```
Taalmodellen-back-end/
├── client/
│   ├── img/
│   │   └── logo.png
│   ├── index.html
│   ├── script.js
│   └── style.css
├── server/
│   ├── files/
│   │   └── hunger_games.txt    # Niet inbegrepen - voeg je eigen toe
│   ├── myEmbeddings/           # Gegenereerd na het uitvoeren van embedding.js
│   ├── embedding.js
│   └── server.js
├── .env                        # Maak dit bestand aan
├── .gitignore
├── package.json
├── package-lock.json
└── vite.config.js
```

## Dependencies

### Server Dependencies
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `@langchain/openai` - Azure OpenAI integratie
- `@langchain/core` - LangChain core functionaliteit
- `@langchain/community` - FAISS vector store
- `langchain` - Document loaders en text splitters
- `dotenv` - Environment variable management

## API Endpoints

- `GET /` - Health check endpoint
- `POST /` - Chat endpoint dat messages accepteert en streaming responses teruggeeft

## Probleemoplossing

### Veelvoorkomende Problemen

1. **Embeddings niet gevonden**: Zorg ervoor dat je `node server/embedding.js` uitvoert voordat je de server start

2. **Azure OpenAI verbindingsproblemen**: Controleer of je `.env` bestand de juiste credentials bevat

3. **CORS errors**: Zorg ervoor dat de client geserveerd wordt vanaf een webserver, niet direct geopend als bestand

4. **Tekstbestand niet gevonden**: Zorg ervoor dat je je eigen kopie van The Hunger Games tekst hebt verkregen en geplaatst op `server/files/hunger_games.txt`

### Error Messages

- "Vector store geladen" - Vector store succesvol geladen
- "Server draait op http://localhost:3000" - Server draait bevestiging
- "Er is een fout opgetreden" - Er is een fout opgetreden (check console voor details)

## Aanpassingen

Om dit aan te passen voor verschillende boeken of onderwerpen:

1. Vervang `hunger_games.txt` met je eigen content
2. Update de system prompt in de `giveContext()` functie
3. Pas het UI theme aan in `style.css` en `index.html`
4. Genereer embeddings opnieuw met de nieuwe content

## Licentie

Dit project is alleen voor educatieve en prive doeleinden.

**Belangrijk**: Het Hunger Games tekstbestand is niet inbegrepen vanwege auteursrechtelijke beperkingen. Gebruikers moeten hun eigen legale kopie van de tekst verkrijgen. Zorg ervoor dat je de juiste rechten hebt om auteursrechtelijk beschermde content te gebruiken voor embeddings en naleef alle toepasselijke auteursrechtwetten.
