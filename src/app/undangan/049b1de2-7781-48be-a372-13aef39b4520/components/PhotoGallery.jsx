import React, { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const PhotoGallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1676909762237-031523f298a4',
      alt: 'Beautiful couple portrait'
    },
    {
      url: 'https://images.unsplash.com/photo-1656714235035-bb9d710b4ce6',
      alt: 'Hand holding ceremony moment'
    },
    {
      url: 'https://images.unsplash.com/photo-1679599441274-6dcac44dba0a',
      alt: 'Romantic under-veil moment'
    },
    {
      url: 'https://images.pexels.com/photos/34489235/pexels-photo-34489235.jpeg',
      alt: 'Elegant wedding moment'
    },
    {
      url: 'https://images.pexels.com/photos/2123430/pexels-photo-2123430.jpeg',
      alt: 'Romantic wedding scene'
    },
    {
      url: 'https://images.unsplash.com/photo-1707193392409-1762d0dafbf5',
      alt: 'Sophisticated couple'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="photo-gallery py-24 px-4 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <ImageIcon className="w-12 h-12 text-amber-600 mx-auto mb-6" />
          <h2 className="text-5xl md:text-6xl font-serif text-gray-800 mb-4">
            Galeri Foto
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Momen indah kami yang terabadikan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div 
              key={index}
              className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl group cursor-pointer transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;