import React, { useState, useEffect } from "react";
import { Modal } from "../../Modal/Modal";
import { RiSettingsLine } from "react-icons/ri";
import { TbBoxModel2 } from "react-icons/tb";
import { LuUserSquare } from "react-icons/lu";
import { MdOutlineWebAsset, MdImportExport } from "react-icons/md";
import { GrPowerReset } from "react-icons/gr";
import { VscBook } from "react-icons/vsc";
import { CiImport, CiExport } from "react-icons/ci";

export const ConfigModal = ({ onClose, config, onReset, onSave, modelList }) => {
    const [ollama, setOllama] = useState({});
    const [user, setUser] = useState({});
    const [theme, setTheme] = useState({});
    const [enableReset, setEnableReset] = useState(false);

    useEffect(() => {
        const fetchUserName = async () => {
            setOllama(config.ollama);
            setUser(config.user);
            setTheme(config.interface.theme);
        };
        fetchUserName();
    }, [config]);

    const handleSaveConfig = () => {
        const newConfigObj = {
            ollama,
            user,
            interface: {
                theme
            }
        };
        onSave(newConfigObj);
    };

    const exportToFile = (filename, content) => {
        const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    const handleExportConfig = () => {
        const config = JSON.parse(localStorage.getItem("it-config"));
        exportToFile("config.json", config);
    };

    const handleExportAgents = () => {
        const agents = JSON.parse(localStorage.getItem("it-agents"));
        exportToFile("agents.json", agents);
    };

    const validateJSON = (json, type) => {
        try {
            const parsed = JSON.parse(json);
            if (type === "config" && parsed.interface && parsed.user && parsed.ollama) {
                return true;
            } else if (type === "agents" && Array.isArray(parsed)) {
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    const handleImport = async (type) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const json = event.target.result;
                if (validateJSON(json, type)) {
                    localStorage.setItem(type === "config" ? "it-config" : "it-agents", json);
                    alert(`${type === "config" ? "Configuração" : "Agentes"} importado(a) com sucesso!`);
                } else {
                    alert("JSON inválido. Verifique o formato do arquivo e tente novamente.");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const handleThemeChange = (newMode) => {
        setTheme({ ...theme, mode: newMode });
    };

    const buttons = [
        {
            name: "Save Config",
            onClick: () => handleSaveConfig()
        },
        {
            name: "Cancel",
            onClick: () => onClose()
        }
    ];

    return (
        <Modal
            icon={<RiSettingsLine />}
            title="Configuration"
            subTitle="Leave the Itinerant as you want"
            onClose={onClose}
            buttons={buttons}
        >
            <div className="mini-form">
                <div className="mini-form-header">
                    <TbBoxModel2 size={30} />
                    <h3>Ollama</h3>
                </div>
                <div className="mini-form-body">
                    <p>Server</p>
                    <input type="text" placeholder="http://localhost:11434/api/" value={ollama.server} onChange={(e) => setOllama({ ...ollama, server: e.target.value })} />
                    <p>Chat</p>
                    <input type="text" placeholder="http://localhost:11434/api/chat" value={ollama.chat} onChange={(e) => setOllama({ ...ollama, chat: e.target.value })} />
                    <p>Model</p>
                    {
                        modelList.length < 1 ? (
                            <input
                                type="text"
                                placeholder="Choose one"
                                value={ollama.model}
                                onChange={(e) => setOllama({ ...ollama, model: e.target.value })}
                            />
                        ) : (
                            <select
                                value={ollama.model}
                                onChange={(e) => setOllama({ ...ollama, model: e.target.value })}
                            >
                                {modelList.map((model, index) => (
                                    <option key={index} value={model}>
                                        {model}
                                    </option>
                                ))}
                            </select>
                        )
                    }
                </div>
            </div>
            <div className="mini-form">
                <div className="mini-form-header">
                    <LuUserSquare size={30} />
                    <h3>User Information</h3>
                </div>
                <div className="mini-form-body">
                    <p>Name</p>
                    <input type="text" placeholder="Your name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                    <p>Description</p>
                    <textarea placeholder="gemma2:2b" style={{ height: 100 }} value={user.description} onChange={(e) => setUser({ ...user, description: e.target.value })}></textarea>
                </div>
            </div>
            <div className="mini-form">
                <div className="mini-form-header">
                    <MdOutlineWebAsset size={30} />
                    <h3>User Interface</h3>
                </div>
                <div className="mini-form-body">
                    <p>Theme name</p>
                    <input type="text" placeholder="Default" value={theme.name} onChange={(e) => setTheme({ ...theme, name: e.target.value })} />
                    <p>Theme mode</p>
                    <div className="theme-toggle">
                        <button
                            className={`theme-btn ${theme.mode === 'Light' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('Light')}
                        >
                            Light
                        </button>
                        <button
                            className={`theme-btn ${theme.mode === 'Dark' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('Dark')}
                        >
                            Dark
                        </button>
                    </div>
                </div>
            </div>
            <div className="mini-form">
                <div className="mini-form-header">
                    <MdImportExport size={30} />
                    <h3>Import/Export</h3>
                </div>
                <div className="mini-form-body">
                    <br />
                    <h4>Configuration</h4>
                    <button className="btn" onClick={() => handleImport("config")}><CiImport size={17} /> Import</button>
                    <button className="btn" onClick={handleExportConfig}><CiExport size={17} /> Export</button>
                    <br />
                    <br />
                    <h4>Agents</h4>
                    <button className="btn" onClick={() => handleImport("agents")}><CiImport size={17} /> Import</button>
                    <button className="btn" onClick={handleExportAgents}><CiExport size={17} /> Export</button>
                </div>
            </div>
            <div className="mini-form">
                <div className="mini-form-header">
                    <GrPowerReset size={30} />
                    <h3>Factory Reset {!enableReset && "[Disabled]"}</h3>
                </div>
                <div className="mini-form-body">
                    <button className="btn" onClick={onReset} disabled={!enableReset}>Reset Settings {!enableReset && "[Disabled]"}</button>
                    <p className="attention"><b>ATTENTION:</b> Clicking the button above will delete all your conversations and agents forever. In addition, the settings will be restored to default.</p>
                    <div className="check-danger">
                        <p>Allow Factory Reset?</p>
                        <input type="checkbox" id="activate-reset" checked={enableReset} onChange={() => setEnableReset(!enableReset)} />
                    </div>
                </div>
            </div>
            <div className="mini-form">
                <div className="mini-form-header">
                    <VscBook size={30} />
                    <h3>Retrieval-Augmented Generation (RAG)</h3>
                </div>
                <div className="mini-form-body">
                    <p style={{ opacity: 0.3 }}>In development</p>
                </div>
            </div>
        </Modal>
    );
};
