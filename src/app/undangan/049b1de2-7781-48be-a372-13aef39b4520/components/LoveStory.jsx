import React, { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';

const LoveStory = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="love-story py-24 px-4 bg-gradient-to-b from-white via-amber-50 to-white"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Heart className="w-12 h-12 text-amber-600 mx-auto mb-6 animate-pulse" />
          
          <h2 className="text-5xl md:text-6xl font-serif text-gray-800 mb-8">
            Kisah Cinta Kami
          </h2>
          
          <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-12"></div>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p className="font-light">
              Pertemuan kami dimulai pada suatu sore yang cerah di sebuah taman kota. 
              Adam sedang membaca buku favoritnya di bangku taman, sementara Hawa berjalan 
              menikmati indahnya sore sambil membawa kamera untuk memotret pemandangan.
            </p>
            
            <p className="font-light">
              Tanpa sengaja, Hawa menjatuhkan lensanya tepat di depan bangku Adam. 
              Dengan sigap, Adam mengambil lensa tersebut dan mengembalikannya sambil tersenyum. 
              Dari situlah percakapan dimulai, membicarakan tentang buku dan fotografi.
            </p>
            
            <p className="font-light">
              Hari-hari berlalu dengan penuh kehangatan. Setiap sore mereka bertemu di taman yang sama, 
              berbagi cerita, mimpi, dan harapan. Perlahan, persahabatan berubah menjadi cinta yang indah. 
              Kini, kami siap untuk memulai babak baru kehidupan bersama.
            </p>
            
            <div className="mt-12 pt-8">
              <p className="text-2xl font-serif text-amber-700 italic">
                "Cinta adalah ketika dua jiwa bertemu dan menjadi satu."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoveStory;