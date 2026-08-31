/*
  Single source of truth for every headline number quoted in site copy.

  Rule: if a figure appears in prose, a <Stat>, a card description or a meta
  description, it resolves from here. Nothing gets retyped at a call site.
  The same metric was previously written three different ways across the
  homepage and the case studies, which is what this file exists to prevent.

  Each value is a display string, not a number, because the copy needs the
  formatting ("1.7 million", "+51%", "1,494,077") and no arithmetic is done
  on these at runtime. Values that ARE derived from others record the
  arithmetic in a comment so the derivation can be rechecked.
*/

export const firstTable = {
  /** App users. One figure, phrased "1.7 million app users" wherever the noun is needed. */
  appUsers: "1.7 million",
  /** Same figure, abbreviated for <Stat> tiles. */
  appUsersShort: "1.7M",
  /** Sign-ups, six months post-launch. */
  signupIncrease: "51%",
  /** Onboarding completion, six months post-launch. */
  onboardingCompletionIncrease: "21%",
  /** Booking-flow conversion, six months post-launch. */
  conversionIncrease: "12.3%",
  /** New Zealand, Australia, the UK and Ireland. */
  markets: 4,
  /** Same count, spelled out for prose. */
  marketsWord: "four",
  abTestsPerYear: "150+",
  transactionsAnalysed: "400k+",
  surveyResponses: "10k",
  segmentsIdentified: 5,
} as const;

export const basis = {
  /** The stated product goal. Deliberately NOT lowered to match the result. */
  billReductionGoal: "15%",
  /** What the pilot actually delivered. */
  billReductionActual: "10%",
  /** H3 target: share of users setting up one automation routine in month one. */
  routineAdoptionTarget: "70 to 80%",
  /** Actual, and it landed in week one rather than month one. */
  routineAdoptionActual: "85%",
  pilotLength: "6-month",
} as const;

export const covid = {
  installs: "2.7 million",
  /** Same figure, abbreviated for <Stat> tiles. */
  installsShort: "2.7M",
  /** Canonical pre-redesign baseline. Every other BT figure derives from this. */
  btDevicesBefore: "1,494,077",
  btDevicesAfter: "2,006,506",
  /** 1,494,077 / 2.7M. Rounded for prose as "1.5 million". */
  btActivationRateBefore: "55%",
  /** 2,006,506 / 2.7M. */
  btActivationRateAfter: "74%",
  /** Prose rounding of btDevicesBefore. */
  btDevicesBeforeRounded: "1.5 million",
  /** 2,006,506 - 1,494,077. */
  devicesAdded: "512,429",
  btGrowth: "34%",
  /** 2.7M - 1,494,077 = 1,205,923. The gap, which was narrowed, not closed. */
  gapBefore: "1.2 million",
  /** 512,429 / 1,205,923. */
  shareOfGapClosed: "42%",
  posterScansBefore: "618,344",
  posterScansAfter: "672,605",
  posterScanGrowth: "9%",
  mislickBefore: "18%",
  mislickAfter: "5.3%",
  dropoffBefore: "55%",
  dropoffAfter: "12%",
  taskSuccessBefore: "38.7%",
  taskSuccessAfter: "92%",
  usabilityScoreBefore: "47",
  usabilityScoreAfter: "81",
  /** App Store rating, read off the March 2020 / July 2021 comparison (MOH11.jpg). */
  appRatingBefore: "2.1",
  appRatingAfter: "4.2",
} as const;
