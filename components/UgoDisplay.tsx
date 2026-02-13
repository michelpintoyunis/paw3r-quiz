import React from 'react';

// URL de la imagen proporcionada
const UGO_IMAGE_URL = "https://pbs.twimg.com/profile_images/1124423554492194823/rc2M-upQ_400x400.jpg";

interface UgoDisplayProps {
  className?: string; 
}

export const UgoDisplay: React.FC<UgoDisplayProps> = ({ className }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className || "w-32 h-32"}`}>
      <img 
        src={UGO_IMAGE_URL} 
        alt="Ugo Logo PAW3R" 
        className="w-full h-full object-contain mix-blend-multiply filter contrast-125"
        // mix-blend-multiply hace que el blanco de la imagen se vuelva transparente sobre fondo blanco/gris
      />
    </div>
  );
};