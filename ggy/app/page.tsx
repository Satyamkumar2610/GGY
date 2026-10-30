import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { EditionNotes } from "@/components/edition-notes";
import { RouteChapter } from "@/components/route-chapter";
import { IdeaChapter } from "@/components/idea-chapter";
import { FormatChapter } from "@/components/format-chapter";
import { ArchiveChapter } from "@/components/archive-chapter";
import { LifeAfterChapter, PeopleChapter } from "@/components/people-chapter";
import { AdmissionsChapter } from "@/components/admissions-chapter";
import { FieldGallery } from "@/components/field-gallery";
import { Questions } from "@/components/questions";
import { Colophon } from "@/components/colophon";
import { ScrollRefresh } from "@/components/motion/scroll-refresh";
import { PageMotion } from "@/components/motion/page-motion";
import { Interactions } from "@/components/motion/interactions";
import { Band } from "@/components/band";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
        <Hero />
        <Band />
        <EditionNotes />
        <RouteChapter />
        <IdeaChapter />
        <FormatChapter />
        <ArchiveChapter />
        <FieldGallery />
        <PeopleChapter />
        <LifeAfterChapter />
        <Questions />
        <AdmissionsChapter />
      </main>
      <Colophon />
      <PageMotion />
      <Interactions />
      <ScrollRefresh />
    </>
  );
}
