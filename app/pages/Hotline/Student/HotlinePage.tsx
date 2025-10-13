import HotlineCard from "../HotlineCard";

const HotlinePage = () => {
  const hotlines = [
    {
      name: "NCMH Crisis Hotline",
      description:
        "NCMH Crisis Hotline provides 24/7, free, compassionate and confidential support over the phone.  We support everyone in Philippines who may be experiencing emotional distress related to abuse & domestic violence, anxiety, bullying, ",
      contactNumber: "0917-899-8727",
      imageSrc: "/images/hotline/ncmh.svg",
      websiteUrl: "https://ncmh.gov.ph/",
    },
    {
      name: "Tawag Paglaum",
      description:
        "Tawag Paglaum Centro Bisaya is a helpline, that is available 24/7, for individuals struggling with emotional and suicidal crisis in the Philippines. We are here to remind you that you are not alone and there is hope",
      contactNumber: "0939-937-5433",
      imageSrc: "/images/hotline/tawag-paglaum.svg",
      websiteUrl: "https://www.facebook.com/TawagPaglaumCB/",
    },
  ];

  return (
    <div className="flex flex-wrap max-h-[85vh] overflow-y-auto pb-5 gap-5">
      {hotlines.map((hotline, index) => (
        <HotlineCard key={index} {...hotline} />
      ))}
    </div>
  );
};

export default HotlinePage;
