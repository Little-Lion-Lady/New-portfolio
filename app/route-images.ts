/*
  The images that represent each route, for crawlers: the sitemap's
  <image:image> entries and each case study's JSON-LD `image`. One list so the
  two cannot drift apart. Lead image first; that is the one JSON-LD names.

  Paths are public URLs (no origin). Keep them in step when imagery is renamed.
*/
export const ROUTE_IMAGES: Record<string, string[]> = {
  "/about": ["/home/about/about-maryna-portrait.jpg"],
  "/work/first-table": [
    "/home/work/first-table/first-table-app-phone-dining-table.jpg",
    "/home/work/first-table/first-table-legacy-app-screens-light.png",
    "/home/work/first-table/first-table-diner-segmentation-light.png",
    "/home/work/first-table/first-table-booking-flow-single-step-light.png",
    "/home/work/first-table/first-table-component-library-light.png",
  ],
  "/work/covid-tracer": [
    "/home/work/covid-tracer/covid-tracer-qr-scanner-phone.jpg",
    "/home/work/covid-tracer/covid-tracer-sign-in-dropoff-funnel.jpg",
    "/home/work/covid-tracer/covid-tracer-onboarding-flow-diagram.jpg",
    "/home/work/covid-tracer/covid-tracer-app-store-rating-before-after.jpg",
    "/home/work/covid-tracer/covid-tracer-launch-numbers.jpg",
  ],
  "/work/basis": [
    "/home/work/basis/basis-app-phone-smart-panel.jpg",
    "/home/work/basis/basis-smart-panel-closed-open-uncovered.jpg",
    "/home/work/basis/basis-affinity-map-workshop.png",
    "/home/work/basis/basis-beta-app-flow-diagram.png",
    "/home/work/basis/basis-app-in-use-at-home.jpg",
  ],
};
