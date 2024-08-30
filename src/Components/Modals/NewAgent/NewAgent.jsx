import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import countriesGeoJSON from "../../../Assets/geoFiles/countries.geo.json";
import { Modal } from "../../Modal/Modal";
import { FaSearch } from "react-icons/fa";
import { MapComponent } from "../../Map/Map.jsx";
import { GlobalStateContext, GlobalDispatchContext } from "../../../Context/Context";
import { FaRegUser } from "react-icons/fa";

const languages = [
  "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani",
  "Basque", "Belarusian", "Bengali", "Bosnian", "Bulgarian", "Catalan",
  "Cebuano", "Chichewa", "Chinese (Simplified)", "Chinese (Traditional)",
  "Corsican", "Croatian", "Czech", "Danish", "Dutch", "English (US)",
  "English (UK)", "Esperanto", "Estonian", "Filipino", "Finnish", "French (France)",
  "French (Canada)", "Galician", "Georgian", "German", "Greek", "Gujarati",
  "Haitian Creole", "Hausa", "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian",
  "Icelandic", "Igbo", "Indonesian", "Irish", "Italian", "Japanese", "Javanese",
  "Kannada", "Kazakh", "Khmer", "Kinyarwanda", "Korean", "Kurdish (Kurmanji)",
  "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian", "Luxembourgish", "Macedonian",
  "Malagasy", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian",
  "Myanmar (Burmese)", "Nepali", "Norwegian", "Nyanja", "Odia (Oriya)", "Pashto",
  "Persian", "Polish", "Portuguese (Brazilian)", "Portuguese (Portugal)",
  "Punjabi", "Romanian", "Russian", "Samoan", "Scots Gaelic", "Serbian",
  "Sesotho", "Shona", "Sindhi", "Sinhala", "Slovak", "Slovenian", "Somali",
  "Spanish (Spain)", "Spanish (Latin America)", "Sundanese", "Swahili",
  "Swedish", "Tajik", "Tamil", "Telugu", "Thai", "Turkish", "Ukrainian",
  "Urdu", "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"
];

export const NewAgent = ({ agent, onClose, onCreate, onUpdate }) => {
  
  const { agents } = useContext(GlobalStateContext);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [history, setHistory] = useState(null);

  useEffect(() => {
    if (agent) {
      setImage(agent.info.image);
      setName(agent.info.name);
      setDescription(agent.info.description);
      setCountry(agent.country.name);
      setLanguage(agent.country.language);
      setSystemPrompt(agent.system.prompt);
      setInitialPrompt(agent.system.initial);
      setHistory(agent.history);
    }
  }, [agent]);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleCreate = () => {
    const countryData = countriesGeoJSON.features.find(
      (feature) => feature.properties.name === country
    );
    let lastAgentId = agents.length > 0 ? agents[agents.length - 1].id : 0;
    
    const newAgent = {
      id: lastAgentId + 1,
      info: {
        name,
        description,
        image,
      },
      system: {
        prompt: systemPrompt,
        initial: initialPrompt,
      },
      country: {
        name: country,
        acronym: countryData ? countryData.id : "",
        language,
      },
      model: {
        name: "",
      },
      history: [],
    };
    onCreate(newAgent);
  };

  const handleUpdate = () => {
    const countryData = countriesGeoJSON.features.find(
      (feature) => feature.properties.name === country
    );
    
    const updatedAgent = {
      id: agent.id,
      info: {
        name,
        description,
        image,
      },
      system: {
        prompt: systemPrompt,
        initial: initialPrompt,
      },
      country: {
        name: country,
        acronym: countryData ? countryData.id : "",
        language,
      },
      model: {
        name: "",
      },
      history: history,
    };
    onUpdate(updatedAgent);
  };

  const handleCountrySearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const countryData = countriesGeoJSON.features.find(
      (feature) =>
        feature.properties.name &&
        feature.properties.name.toLowerCase().includes(searchTerm)
    );

    if (countryData) {
      setSelectedCountry(countryData.properties.name);
      setCountry(countryData.properties.name);
    } else {
      setSelectedCountry(null);
    }
  };

  const buttons = [
    {
      name: !agent ? "Create" : "Update",
      onClick: !agent ? handleCreate : handleUpdate,
    },
    {
      name: "Cancel",
      onClick: () => onClose(),
    },
  ];

  return (
    <Modal
      icon={<FaRegUser />}
      title={!agent ? "Create a new agent" : "Update agent"}
      subTitle={!agent ? "Create a new being, a new traveler" : "Update your agent"}
      onClose={onClose}
      buttons={buttons}
    >
      <div className="mini-form newAgent">
        <div className="mini-form-header">
          {image ? (
            <div className="drop-image-after">
              <img src={image} alt="Dropped" />
              <button onClick={handleRemoveImage} className="btn">
                Remove image
              </button>
            </div>
          ) : (
            <div
              className="drop-image"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <h3>Drag an image file here.</h3>
              <p>This will be your agent's profile image.</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                id="image-input"
              />
              <label htmlFor="image-input" className="btn" style={{width: 150, display: 'flex', justifyContent: 'center'}}>
                Choose an image
              </label>
            </div>
          )}
        </div>
        <div className="mini-form-body">
          <p>Name</p>
          <input
            type="text"
            placeholder="Bobby"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p>Small description</p>
          <input
            type="text"
            placeholder="Bobby is the first traveler, your traveling companion."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p>Country</p>
          <div id="country-selector">
            <div id="cs-header">
              <div id="cs-header-title">
                <h3>
                  {selectedCountry ? selectedCountry : "Select a country"}
                </h3>
              </div>
              <div id="cs-header-search">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search country"
                  onChange={handleCountrySearch}
                />
              </div>
            </div>
            <div id="cs-body">
              <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%' }} attributionControl={false}>
                <TileLayer
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapComponent
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  countriesGeoJSON={countriesGeoJSON}
                />
              </MapContainer>
            </div>
          </div>
          <p>Language</p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="" disabled>Select a language</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <p>System prompt</p>
          <textarea
            placeholder="You're a boy named Bobby, you are a charismatic, lively and fun virtual assistant from Itinerant. His entire personality and culture comes from Brazil. You speak English."
            style={{ height: 100 }}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          ></textarea>
          <p>Initial prompt</p>
          <textarea
            placeholder="Hello! I'm Bobby, your first traveler on this journey of new discoveries with AI. 😊"
            style={{ height: 100 }}
            value={initialPrompt}
            onChange={(e) => setInitialPrompt(e.target.value)}
          ></textarea>
        </div>
      </div>
    </Modal>
  );
};
