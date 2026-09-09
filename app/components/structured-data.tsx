import { siteUrl } from "../site-url";

/*
  JSON-LD structured data.
  ────────────────────────
  A Server Component, so this ships as static HTML on a prerendered route and
  costs nothing at runtime — and, unlike everything else describing this site to
  a crawler, it is readable without executing a line of JavaScript.

  Modelled as a small linked graph rather than a separate blob per page: the
  Person and WebSite nodes are declared ONCE in the root layout with stable
  @ids, and every case study points at them with `{ "@id": ... }` references.
  A crawler resolves those to one entity across the whole site, which is the
  entire point of the exercise for a portfolio — the query is usually a name.
  Restating the Person inline per page invites it to be read as several
  different people who happen to share one.

  Deliberately NOT included: an `email` property on Person. The address is
  already on the site as a mailto link, so this would add nothing a reader
  cannot reach, while adding a machine-readable copy for anything harvesting.

  Nothing here is inferred. Every value is stated on the site itself; a field
  without a source on the page (publication dates, project durations) is left
  out rather than estimated.
*/

const PERSON_ID = `${siteUrl}/#person`;
const WEBSITE_ID = `${siteUrl}/#website`;

/*
  A `<` inside a JSON string would end this script element early — the classic
  way an innocuous-looking JSON-LD block turns into an injection point. The
  content here is all static source strings, but escaping is the cheap half of
  the bargain and it stays correct if that ever stops being true.
*/
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Person + WebSite. Rendered once, in the root layout. */
export function SiteStructuredData() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": PERSON_ID,
            name: "Maryna Babych",
            jobTitle: "Lead Product Designer",
            url: siteUrl,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Auckland",
              addressCountry: "NZ",
            },
            worksFor: { "@type": "Organization", name: "First Table" },
            sameAs: ["https://www.linkedin.com/in/marynababych/"],
          },
          {
            "@type": "WebSite",
            "@id": WEBSITE_ID,
            url: siteUrl,
            name: "Maryna Babych",
            description:
              "Portfolio of Maryna Babych, Lead Product Designer based in Auckland, New Zealand.",
            inLanguage: "en-NZ",
            publisher: { "@id": PERSON_ID },
          },
        ],
      }}
    />
  );
}

/** One case study, linked back to the Person and WebSite above. */
export function CaseStudyStructuredData({
  path,
  name,
  description,
  award,
}: {
  /** Route path, leading slash, no origin. */
  path: string;
  name: string;
  description: string;
  /** Only where the page itself states one. */
  award?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${siteUrl}${path}/#work`,
        url: `${siteUrl}${path}`,
        name,
        description,
        inLanguage: "en-NZ",
        author: { "@id": PERSON_ID },
        creator: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
        ...(award ? { award } : {}),
      }}
    />
  );
}
