"use client";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import ImageWithFallback from "../Images/ImageWithFallback";
import NoImage from "../Images/NoImage";

const ImageGrid = ({
  images,
  isPopup = false,
}: {
  images: string[];
  isPopup?: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isPopup) {
    // Original grid layout for non-popup
    return (
      <>
        {images.length > 0 ? (
          <div
            className={`grid gap-2 ${images.length === 1 ? "" : "grid-cols-2"}`}
          >
            {images.slice(0, 4).map((img, i) => {
              const isThirdWithExtra = i === 3 && images.length > 4;
              return (
                <div
                  key={i}
                  className={`relative rounded-xl overflow-hidden border border-base-content/10 shadow-md hover:shadow-lg transition-all duration-300 ${
                    images.length === 1
                      ? "w-full aspect-video mx-auto"
                      : i === 0 && images.length === 3
                      ? "row-span-2"
                      : "aspect-video"
                  }`}
                >
                  <ImageWithFallback src={img} alt={`Image ${i + 1}`} fill />
                  {isThirdWithExtra && (
                    <div className="absolute inset-0 bg-linear-to-br from-black/60 to-black/80 flex items-center justify-center hover:from-black/70 hover:to-black/90 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                      <div className="text-center">
                        <span className="text-white text-3xl font-bold block">
                          +{images.length - 4}
                        </span>
                        <span className="text-white/80 text-sm">
                          more photos
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-100 w-full aspect-video">
            <NoImage
              className="rounded-xl border border-base-content/10"
              text="No Images Available"
            />
          </div>
        )}
      </>
    );
  }

  // Carousel layout for popup
  return (
    <>
      {images.length > 0 ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full rounded-xl overflow-hidden border border-base-content/10 shadow-2xl">
            <ImageWithFallback
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              fill
              isPopup={true}
            />

            {images.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-primary shadow-lg hover:scale-110 transition-transform z-10"
                >
                  <IoChevronBack size={24} />
                </button>

                {/* Next Button */}
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-primary shadow-lg hover:scale-110 transition-transform z-10"
                >
                  <IoChevronForward size={24} />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                  {currentIndex + 1} / {images.length}
                </div>

                {/* Dots Indicator */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === currentIndex
                          ? "bg-primary w-8"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <NoImage
            className="rounded-xl border border-base-content/10"
            text="No Images Available"
          />
        </div>
      )}
    </>
  );
};

export default ImageGrid;
