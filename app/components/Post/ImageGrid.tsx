import NoImage from "../Images/NoImage";
import ImageBox from "./ImageBox";

const ImageGrid = ({ images }: { images: string[] }) => {
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
                <ImageBox src={img} alt={`Image ${i + 1}`} />
                {isThirdWithExtra && (
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80 flex items-center justify-center hover:from-black/70 hover:to-black/90 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                    <div className="text-center">
                      <span className="text-white text-3xl font-bold block">
                        +{images.length - 4}
                      </span>
                      <span className="text-white/80 text-sm">more photos</span>
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
};

export default ImageGrid;
