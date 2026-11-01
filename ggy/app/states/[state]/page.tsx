import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { stateDossiers } from "@/content/ggy";
import { SLUG, dossierBySlug } from "@/lib/states";
import { StatePage } from "@/components/state-page";
import { Page } from "@/components/page-effects";

type Props = { params: Promise<{ state: string }> };

export function generateStaticParams() {
  return stateDossiers.map((d) => ({ state: SLUG[d.iso] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const d = dossierBySlug(state);
  if (!d) return {};
  const title = `${d.name}: state dossier`;
  return {
    title,
    description: `${d.intro} The Good Governance Yatra's upcoming edition travels through ${stateDossiers.map((x) => x.name).join(", ")}; stops and dates are to be announced.`,
    alternates: { canonical: `/states/${state}` },
    openGraph: { title, images: [{ url: `/og/state-${state}.png`, width: 1200, height: 630, alt: `${d.name} outlined, with the Good Governance Yatra postmark.` }] },
    twitter: { card: "summary_large_image", images: [`/og/state-${state}.png`] },
  };
}

/** Reads the route's params inside a Suspense boundary, as Cache Components require. */
async function StateContent({ params }: Props) {
  const { state } = await params;
  const d = dossierBySlug(state);
  if (!d) notFound();
  return (
    <Page name={`state-${state}`}>
      <StatePage d={d} />
    </Page>
  );
}

export default function StateRoute({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <StateContent params={params} />
    </Suspense>
  );
}
