import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const carouselImages = [
  {
    src: "https://placehold.co/1200x600/E0F2FE/0284C7?text=Dashboard+Intuitivo",
    alt: "Dashboard Intuitivo da plataforma FrioFácil"
  },
  {
    src: "https://placehold.co/1200x600/D1FAE5/059669?text=Agenda+Otimizada",
    alt: "Visualização da Agenda Otimizada para equipes"
  },
  {
    src: "https://placehold.co/1200x600/FEF3C7/D97706?text=Controle+Financeiro",
    alt: "Gráficos e relatórios do Controle Financeiro"
  },
  {
    src: "https://placehold.co/1200x600/FEE2E2/DC2626?text=Gest%C3%A3o+de+Clientes",
    alt: "Tela de Gestão de Clientes com histórico de serviços"
  }
];

const HeroCarousel: FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      nextImage();
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentImageIndex]);

  return (
    <div className="hero-image-container">
      <div 
        className="carousel-track" 
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
        {carouselImages.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className="hero-image"
          />
        ))}
      </div>
      <button onClick={prevImage} className="carousel-button prev" aria-label="Imagem Anterior">
        <ChevronLeft size={32} />
      </button>
      <button onClick={nextImage} className="carousel-button next" aria-label="Próxima Imagem">
        <ChevronRight size={32} />
      </button>
    </div>
  );
};

export default HeroCarousel;
