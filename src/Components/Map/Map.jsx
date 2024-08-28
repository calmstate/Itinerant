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
          const bounds = L.geoJSON(countryData).getBounds();
          map.flyToBounds(bounds, { duration: 0.5 });
          if (geoJsonRef.current) {
            geoJsonRef.current.eachLayer((layer) => {
              if (layer.feature.properties.name === selectedCountry) {
                layer.setStyle({ fillColor: '#4fc189' }); 
              } else {
                layer.setStyle({ fillColor: 'transparent' }); 
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
        style={{ weight: 1, color: "black", fillOpacity: 0.7 }}
        onEachFeature={onEachCountry}
        ref={geoJsonRef} 
      />
    );
  };