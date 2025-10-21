// ```
// /**
//  * Implementation plan
//  *
//  * * Stage 1: Indexing
//  *
//  * 1. Load the document - pdf, text
//  * 2. Chunk the document
//  * 3. Generate vector embeddings
//  * 4. Store the vector embeddings - Vector database
//  *
//  * Stage 2: Using the chatbot
//  *
//  * 1. Setup LLM
//  * 2. Add retrieval step
//  * 3. Pass input + relevant information to LLM
//  * 4. Congratulations
//  */
// ```

import { IndexDoc } from "./services/prepare.js";

const filepath = "./Aq guide.pdf";
const userNamespace = "Atomix-growth";

IndexDoc(filepath, userNamespace);
