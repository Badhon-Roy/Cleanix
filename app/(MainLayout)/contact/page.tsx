import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import MapSection from "@/components/contact/MapSection";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "Contact Us & Book a Cleaning Service | Cleanix Dhaka",
  description:
    "Get in touch with Cleanix for residential, corporate office, move-out, and post-construction deep cleaning requests. Call +88 01774500815 or fill out our instant contact form for rapid 15-minute response.",
  keywords: [
    "Contact Cleanix",
    "Book Cleaning Service Dhaka",
    "Cleanix Phone Number",
    "House Cleaning Contact Bangladesh",
    "Commercial Cleaning Quote",
  ],
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSection />
      <MapSection />
    </>
  );
}
