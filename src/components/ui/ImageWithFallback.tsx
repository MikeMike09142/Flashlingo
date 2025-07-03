import React, { useState } from 'react';
import { Image } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  fallbackText?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackIcon = <Image size={48} className="text-neutral-400" />,
  fallbackText = 'Imagen no disponible'
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retrySrc, setRetrySrc] = useState<string | null>(null);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    if (!hasError && !retrySrc) {
      // Intentar reemplazar espacios por guiones bajos y viceversa
      let newSrc = src.includes(' ') ? src.replace(/ /g, '_') : src.replace(/_/g, ' ');
      if (newSrc !== src) {
        setRetrySrc(newSrc);
        return;
      }
    }
    setHasError(true);
  };

  // Si retrySrc cambia, intentamos cargar esa nueva ruta
  React.useEffect(() => {
    if (retrySrc) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [retrySrc]);

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded-lg ${className}`}>
        {fallbackIcon}
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 text-center">
          {fallbackText}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}
      <img
        src={retrySrc || src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

export default ImageWithFallback; 