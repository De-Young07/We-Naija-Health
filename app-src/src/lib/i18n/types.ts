// WeNaijaHealth — Type-safe i18n dictionary
// 5 Languages: English (en), Nigerian Pidgin (pcm), Yoruba (yo), Hausa (ha), Igbo (ig)

export type Locale = 'en' | 'pcm' | 'yo' | 'ha' | 'ig';

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  pcm: 'Pidgin (Naija)',
  yo: 'Yorùbá',
  ha: 'Hausa',
  ig: 'Asụsụ Igbo',
};

export const LOCALE_LIST: { code: Locale; name: string; nativePrompt: string }[] = [
  { code: 'en', name: 'English', nativePrompt: 'Which language do you prefer?' },
  { code: 'pcm', name: 'Pidgin (Naija)', nativePrompt: 'Which language you prefer?' },
  { code: 'yo', name: 'Yorùbá', nativePrompt: 'Èdè wo lo fẹ́?' },
  { code: 'ha', name: 'Hausa', nativePrompt: 'Wace harshe kuke so?' },
  { code: 'ig', name: 'Asụsụ Igbo', nativePrompt: 'Kedu asụsụ ị kacha chọọ?' },
];

export const DEFAULT_LOCALE: Locale = 'en';

export interface TranslationDictionary {
  // Site-wide
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;

  // Navigation
  navHome: string;
  navRegister: string;
  navSchemes: string;
  navAbout: string;
  navHelp: string;
  navAdmin: string;
  navLanguage: string;

  // Homepage
  btnGetStarted: string;
  btnFindInsurance: string;
  btnNeedHelp: string;

  // How it works steps
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Sections
  sectionWhoWeHelp: string;
  sectionHowItWorks: string;
  sectionUnderstandInsurance: string;
  sectionSchemes: string;
  sectionPaymentSupport: string;
  sectionGetHelp: string;
  sectionFAQ: string;
  sectionContact: string;

  // Registration form
  regTitle: string;
  regStepOf: string; // "Step {current} of {total}"
  regStep1Title: string;
  regStep2Title: string;
  regStep3Title: string;
  regStep4Title: string;
  regStep5Title: string;

  // Step 1 fields
  fieldFullName: string;
  fieldPhone: string;
  fieldEmail: string;
  fieldEmailOptional: string;
  fieldState: string;
  fieldLGA: string;
  fieldCommunity: string;
  fieldPreferredContact: string;

  // Step 2 fields
  fieldWorkType: string;
  workMarketTrader: string;
  workShopOwner: string;
  workPettyTrader: string;
  workArtisan: string;
  workFarmer: string;
  workFoodSeller: string;
  workTransport: string;
  workSelfEmployed: string;
  workOther: string;

  // Step 3 fields
  fieldHasInsurance: string;
  optionYes: string;
  optionNo: string;
  optionNotSure: string;

  // Step 4 fields
  fieldCoverageFor: string;
  coverageSelf: string;
  coverageFamily: string;

  // Step 5 — Consent
  consentTitle: string;
  consentDataCollection: string;
  consentDataSharing: string;
  consentReimbursement: string;
  consentCommunications: string;
  consentIAgree: string;
  btnSubmit: string;
  btnNext: string;
  btnBack: string;

  // Confirmation
  confirmTitle: string;
  confirmMessage: string;
  confirmRefLabel: string;
  confirmDisclaimer: string;
  btnShareWhatsApp: string;
  btnBackHome: string;

  // Financial assistance
  assistanceTitle: string;
  assistanceQuestion: string;
  assistanceYes: string;
  assistancePaySelf: string;
  assistanceLearnMore: string;
  assistanceAmountLabel: string;
  assistanceFrequencyLabel: string;
  assistanceWeekly: string;
  assistanceMonthly: string;
  assistanceDisclaimer: string;

  // Scheme directory
  schemeDirectoryTitle: string;
  schemeEligibility: string;
  schemeCost: string;
  schemeBenefits: string;
  schemeFacilities: string;
  schemeRegister: string;
  schemeVerified: string;

  // General
  loading: string;
  error: string;
  required: string;
  optional: string;
  phoneFormat: string;

  // Footer
  footerPrivacy: string;
  footerTerms: string;
  footerDisclaimer: string;
}
