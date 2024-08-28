export const defaultConfig = {
    interface: {
        theme: {
            name: "Default",
            mode: "Light",
            path: "../src/Styles/Themes/Default/Light/default.light.css"
        }
    },
    user: {
        name: "User",
        description: "Itinerant commum user.",
        memory: []
    },
    ollama: {
        server: "http://localhost:11434/api/",
        chat:   "http://localhost:11434/api/chat",
        model:  "",
        stream: false
    }
}
