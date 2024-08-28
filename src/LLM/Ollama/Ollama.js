 

const getOllamaResponse = async (messages, config) => {
    try {
        let { ollama } = config;
        let response = await fetch(ollama.chat, {
            method: 'POST',
            body: JSON.stringify({
                model: ollama.model,
                messages: messages,
                stream: false
            })
        });
        
        const objResponse = await response.json();

        if (objResponse.error) {
            alert(objResponse.error);
            return objResponse.error;
        }

        return objResponse.message.content;
    } catch (error) {
        return error.message;
    }
};
const getOllamaModels = async (config) =>{
    try{
        let { ollama } = config;
        let response = await fetch(ollama.server+"tags", {
            method: 'GET',
        });
        
        const objResponse = await response.json();

        return objResponse;
        
    } catch (error) {
        return error.message;
    }
}

export { getOllamaResponse, getOllamaModels };
