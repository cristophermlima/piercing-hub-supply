import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useActiveBanners } from '@/hooks/useBanners';
import { useNavigate } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';

export const PromotionalCarousel: React.FC = () => {
  const { data: banners = [], isLoading } = useActiveBanners();
  const navigate = useNavigate();
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (isLoading || banners.length === 0) return null;

  const handleClick = (banner: typeof banners[0]) => {
    if (banner.link_url) {
      if (banner.link_url.startsWith('/')) {
        navigate(banner.link_url);
      } else {
        window.open(banner.link_url, '_blank');
      }
    }
  };

  return (
    <div className="w-full mb-8">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div
                className={`relative w-full h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden ${
                  banner.link_url ? 'cursor-pointer' : ''
                }`}
                onClick={() => handleClick(banner)}
              >
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    {banner.title}
                  </h3>
                  {banner.description && (
                    <p className="text-sm md:text-base opacity-90">
                      {banner.description}
                    </p>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {banners.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>
      
      {/* Indicators */}
      {banners.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {banners.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300"
            />
          ))}
        </div>
      )}
    </div>
  );
};
