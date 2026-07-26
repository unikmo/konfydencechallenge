import { COUNTRY_IMAGE_ASSETS } from "@/lib/country-image-assets";
import styles from "./countries.module.css";

const generatedVisualByContinent: Record<string, string> = {
  Africa: "/country-landmarks/generated/africa.png",
  Asia: "/country-landmarks/generated/asia.png",
  Europe: "/country-landmarks/generated/europe.png",
  "North America": "/country-landmarks/generated/north-america.png",
  Oceania: "/country-landmarks/generated/oceania.png",
  "South America": "/country-landmarks/generated/south-america.png",
};

export default function CountryCardImage({
  countryName,
  landmark,
  continent,
  slug,
}: {
  countryName: string;
  landmark: string;
  continent: string;
  slug: string;
}) {
  const imageUrl = (COUNTRY_IMAGE_ASSETS as Record<string, string>)[slug] ?? generatedVisualByContinent[continent] ?? generatedVisualByContinent["North America"];

  return (
    <div className={styles.countryCardMedia} aria-label={countryName + " landmark: " + landmark}>
      <img
        className={styles.countryCardImage}
        src={imageUrl}
        alt=""
        loading="lazy"
      />
    </div>
  );
}
