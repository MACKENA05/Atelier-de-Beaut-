import React from 'react';
import './MapEmbed.css';

const MapEmbed = () => {
  return (
    <div className="map-container">
      <iframe
        title="Atelier de Beauté Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9999999999995!2d2.292292615674999!3d48.85837307928744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fdfd1f1f1f1%3A0x123456789abcdef!2sEiffel%20Tower!5e0!3m2!1sen!2sfr!4v1610000000000!5m2!1sen!2sfr"
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: '12px' }}
        allowFullScreen=""
        loading="lazy"
      />
    </div>
  );
};

export default MapEmbed;
