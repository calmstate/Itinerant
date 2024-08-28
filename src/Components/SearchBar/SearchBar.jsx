import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

export const SearchBar = ({ agents, onFound }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        const foundAgents = agents.filter(agent =>
            agent.info.name.toLowerCase().includes(term)
        );
        onFound(foundAgents);
    };

    return (
        <div id="app-search">
            <div id="search-input">
                <IoSearchSharp />
                <input 
                    type="text" 
                    placeholder="Search agent" 
                    value={searchTerm} 
                    onChange={handleSearch} 
                />
            </div>
        </div>
    );
};
