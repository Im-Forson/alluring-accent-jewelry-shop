import { useEffect, useState } from "react";
import lady from '../assets/hero-lady.png'

const slides = [
  {
    id: 1,
    title: "Elegance in Every Detail",
    subtitle: "TIMELESS BEAUTY.",
    description:
      "Discover stunning jewellery pieces designed to make every moment special.",
    image: lady,
  },
  {
    id: 2,
    title: "Luxury That Speaks",
    subtitle: "NEW COLLECTION.",
    description:
      "Crafted with precision and passion for modern elegance.",
    image:lady,
  },
  {
    id: 3,
    title: "Shine With Confidence",
    subtitle: "EXCLUSIVE PIECES.",
    description:
      "Designed to elevate your everyday style.",
    image: lady,
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
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">

        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="flex h-full items-center justify-between pl-6 md:pl-16">

              {/* TEXT */}
              <div className="max-w-xl z-20">
                <p className="text-sm tracking-widest text-pink-500 font-medium mb-3">
                  {slide.subtitle}
                </p>

                <h1 className="text-4xl md:text-5xl font-serif text-black leading-tight mb-4">
                  {slide.title}
                </h1>

                <p className="text-gray-600 mb-6 hidden md:flex">
                  {slide.description}
                </p>

                <div className="flex gap-4 ">
                  {/* Pink Button */}
                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-12 md:px-6 py-3 rounded-md font-medium transition">
                    SHOP NOW
                  </button>

                  {/* Outline Button */}
                  <button className="hidden md:flex border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 transition">
                    EXPLORE COLLECTION
                  </button>
                </div>
              </div>

              {/* IMAGE */}
              <div className="w-1/2 h-full">
                <img
                  src={slide.image}
                  alt="Jewellery"
                  className="w-full h-full "
                />
              </div>
            </div>
          </div>
        ))}

        {/* DOTS */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                current === index ? "bg-pink-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}