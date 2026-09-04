import styles from "./countries.module.css";

/**
 * The generated landmark image set is unreliable — several countries render the
 * wrong landmark (e.g. Thailand showed the Great Wall of China). Until each
 * asset is individually verified, show a clean typographic panel instead of a
 * possibly-wrong photo. To restore a photo for a verified country, branch on its
 * slug here and render next/image from lib/country-image-assets.
 */
export default function CountryLandmarkImage({
  countryName,
  landmark,
}: {
  countryName: string;
  landmark: string;
  slug?: string;
}) {
  return (
    <figure className={styles.landmarkFigure}>
      <div className={styles.landmarkFrame}>
        <div className={styles.landmarkFallback}>
          <span>Country scam alert</span>
          <strong>{countryName}</strong>
        </div>
      </div>
      <figcaption>Landmark reference: {landmark}.</figcaption>
    </figure>
  );
}
