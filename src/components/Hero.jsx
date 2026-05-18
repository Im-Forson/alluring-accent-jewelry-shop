import { useEffect, useState } from "react";
import lady from '../assets/hero-lady.png'
import lady2 from '../assets/hero-image-2.png'
import lady3 from '../assets/hero-image-3.png'
import lady4 from '../assets/hero-image-4.png'
import collection1 from '../assets/hero-collection.png'
import collection2 from '../assets/collection-2.png'
import necklace from '../assets/hero-necklace.png'
import ringHand from '../assets/ring-hand.png'

const slides = [
  {
    id: 1,
    title: "Elegance in Every Detail",
    subtitle: "PURE LUXURY JEWELRY",
    // subtitle: "TIMELESS BEAUTY.",
    description: "Discover stunning jewellery pieces designed to make every moment special.",
    image: lady,
  },
  {
    id: 2,
    // title: "Shine With Confidence",
    title: "Elegance in Every Detail",
    subtitle: "CLASSIC FINE JEWELRY",
    // subtitle: "TIMELESS BEAUTY.",
    // description: "Designed to elevate your everyday style.",
    description: "Discover stunning jewellery pieces designed to make every moment special.",
    image: necklace,
  },
  {
    id: 3,
    // title: "Luxury That Speaks",
    title: "Elegance in Every Detail",
    subtitle: "JEWELRY FOR LEADERS",
    // subtitle: "TIMELESS BEAUTY.",
    // description: "Crafted with precision and passion for modern elegance.",
    description: "Discover stunning jewellery pieces designed to make every moment special.",
    image: lady2,
  },
  {
    id: 4,
    // title: "Shine With Confidence",
    title: "Elegance in Every Detail",
    subtitle: "EXCLUSIVE PIECES",
    // subtitle: "TIMELESS BEAUTY.",
    // description: "Designed to elevate your everyday style.",
    description: "Discover stunning jewellery pieces designed to make every moment special.",
    image: collection1,
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className=" w-full bg-[linear-gradient(90deg,#f7e9ea_0%,#e9d4d2_40%,#d8b1ad_75%,#c7938f_100%)]">
      <div className="relative h-[90vh] md:h-[70vh] overflow-hidden">

        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="relative w-full h-full md:flex">
              {/* TEXT */}
              <div className="
                absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20
                md:static md:items-start md:text-left md:justify-center w-full md:w-1/2 md:pl-16
              ">
                <p className="text-2xl md:text-3xl tracking-widest text-pink-500 font-bold mb-5">
                  {slide.subtitle}
                </p>

                {/* <h1 className="text-3xl md:text-5xl font-serif text-black md:text-black leading-tight mb-4">
                  {slide.title}
                </h1> */}

                <p className="md:text-lg capitalize mb-8 w-[70%] md:w-[90%] font-medium">
                  {slide.description}
                </p>

                <div className="flex gap-4 justify-center md:justify-start">
                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-10 md:px-6 py-3 rounded-md font-medium transition">
                    SHOP NOW
                  </button>

                  <button className="flex border border-[rgba(0,0,0,0.2)] px-6 py-3 rounded-md hover:bg-gray-100 transition">
                    EXPLORE COLLECTION
                  </button>
                </div>
              </div>
              {/* IMAGE (Background on mobile) */}
              <div className="w-full md:w-1/2 h-full">
                <img
                  src={slide.image}
                  alt="Jewellery"
                  className="absolute inset-0 w-full h-full  md:static md:h-full"
                />
              </div>

              {/* OVERLAY (for readability on mobile) */}
              {/* <div className="absolute inset-0 bg-black/20 md:hidden"></div> */}
            </div>
          </div>
        ))}

        {/* DOTS */}
        {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                current === index ? "bg-pink-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div> */}
      </div>
    </section>
  );
}