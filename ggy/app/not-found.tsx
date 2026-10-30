import { Button } from "@/components/primitives";

export default function NotFound() {
  return (
    <main id="main" className="on-dark on-ember ground gloss grid min-h-dvh place-items-center">
      <div className="page py-24">
        <p className="d-xl">This page is not on the route.</p>
        <p className="mt-6 max-w-[28rem] text-cream/85">The link may be old or mistyped. The Yatra’s page has everything published so far.</p>
        <Button href="/" variant="ghost" className="mt-10">
          Go to the Yatra’s page
        </Button>
      </div>
    </main>
  );
}
