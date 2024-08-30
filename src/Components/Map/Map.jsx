import React, { useEffect, useRef } from "react";
import L from 'leaflet';
import { GeoJSON, useMap } from "react-leaflet";
 
export const MapComponent = ({ selectedCountry, setSelectedCountry, countriesGeoJSON}) => {
    const map = useMap();
    const geoJsonRef = useRef(null);
  
    useEffect(() => {
      if (selectedCountry) {
        const countryData = countriesGeoJSON.features.find(
          (feature) => feature.properties.name === selectedCountry
        );
  
        if (countryData) {
          // Centraliza o mapa no país selecionado com flyTo
          const bounds = L.geoJSON(countryData).getBounds();
          map.flyToBounds(bounds, { duration: 0.5 }); // Ajuste a duração conforme necessário
  
          // Destaca o país selecionado no mapa
          if (geoJsonRef.current) {
            geoJsonRef.current.eachLayer((layer) => {
              if (layer.feature.properties.name === selectedCountry) {
                layer.setStyle({ fillColor: '#4fc189' }); // Define a cor de preenchimento desejada
              } else {
                layer.setStyle({ fillColor: 'transparent' }); // Remove o preenchimento de outros países
              }
            });
          }
        }
      }
    }, [selectedCountry, map]);
  
    const onEachCountry = (country, layer) => {
      layer.on({
        click: () => {
          setSelectedCountry(country.properties.name);
        },
      });
    };
  
    return (
      <GeoJSON
        data={countriesGeoJSON}
        style={{ weight: 1, color: "var(--country-selector-header-color)", fillOpacity: 0.7, }}
        onEachFeature={onEachCountry}
        ref={geoJsonRef} 
      />
    );
  };