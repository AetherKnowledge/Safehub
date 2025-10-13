import Image from "next/image";

const ImageGrid = ({ images }: { images: string[] }) => {
  return (
    <>
      {images.length > 0 && (
        <div
          className={`grid gap-1 mt-4 ${
            images.length === 1 ? "" : "grid-cols-2"
          }`}
        >
          {images.slice(0, 4).map((img, i) => {
            const isThirdWithExtra = i === 3 && images.length > 4;
            return (
              <div
                key={i}
                className={`relative rounded-sm overflow-hidden ${
                  images.length === 1
                    ? "w-full aspect-video mx-auto"
                    : i === 0 && images.length === 3
                    ? "row-span-2"
                    : "aspect-video"
                }`}
              >
                <Image
                  src={img}
                  alt={`Image ${i + 1}`}
                  fill
                  className="object-cover"
                />
                {isThirdWithExtra && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center hover:bg-black/70 transition-all duration-300 cursor-pointer">
                    <span className="text-white text-lg font-semibold">
                      +{images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ImageGrid;
