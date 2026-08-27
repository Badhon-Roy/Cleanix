import type { Metadata } from "next";
import GalleryClientView from "@/components/gallery/GalleryClientView";
import { fetchActiveGalleryServer } from "@/services/galleryServerService";

export const metadata: Metadata = {
  title: "Our Gallery | Cleanix - Professional Cleaning Showcase & Videos",
  description:
    "Explore Cleanix's official photo and video gallery. View before & after residential cleaning transformations, office carpet steam shampooing, and post-construction resets across Dhaka.",
  keywords: [
    "Cleanix Gallery",
    "Cleaning Video Showcase Dhaka",
    "Before After Deep Cleaning",
    "Office Cleaning Photos Gulshan",
    "Cleanix Work Showcase",
  ],
};

export default async function GalleryPage() {
  const galleryItems = await fetchActiveGalleryServer();

  return <GalleryClientView initialItems={galleryItems} />;
}
