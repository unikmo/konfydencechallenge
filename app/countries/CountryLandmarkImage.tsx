import Image from "next/image";
import { COUNTRY_IMAGE_ASSETS } from "@/lib/country-image-assets";
import styles from "./countries.module.css";

export default function CountryLandmarkImage({ countryName, landmark, slug }: { countryName: string; landmark: string; slug: string }) {
  const imageUrl = (COUNTRY_IMAGE_ASSETS as Record<string, string>)[slug] ?? "/country-landmarks/generated/north-america.png";
  return (
    <figure className={styles.landmarkFigure}>
      <div className={styles.landmarkFrame}>
        <Image className={styles.landmarkImage} src={imageUrl} alt={`${landmark}, a landmark associated with ${countryName}`} width={1200} height={720} sizes="(max-width: 900px) 100vw, 760px" priority />
      </div>
      <figcaption>Local landmark image for {countryName}. Landmark identity: {landmark}.</figcaption>
    </figure>
  );
}
