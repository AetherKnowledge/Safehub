import Image from "next/image";
import NumberButton from "./NumberButton";

export interface HotlineCardProps {
  name: string;
  description: string;
  contactNumber: string;
  imageSrc: string;
  websiteUrl: string;
}

const HotlineCard = ({
  name,
  description,
  contactNumber,
  imageSrc,
  websiteUrl,
}: HotlineCardProps) => {
  return (
    <div className="card rounded-lg bg-base-100 w-96 shadow-br">
      <figure className="pt-5">
        <Image width={150} height={150} src={imageSrc} alt={name} />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-primary text-2xl">{name}</h2>
        <p>{description}</p>
        <NumberButton contactNumber={contactNumber} />
        <div className="card-actions justify-center w-full">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default HotlineCard;
