export {
  assembleLibrary,
  type LibraryDiagnostic,
  type LibraryResult,
  type RawLibrary,
} from './library';
export {
  generatePerson,
  moneyPressure,
  violations,
  type GenerationContext,
  type GeneratorOptions,
} from './generate';
export { summarisePeople, type PeopleSummary } from './stats';
export { createModule, manifest, peopleModule, type PeopleConfig } from './module';
export { HERITABILITY, generateHousehold, inheritTemperament, type Household } from './household';
export { profileEffects } from './profile';
export {
  APPEARANCE_TRAITS,
  drawAppearance,
  visibleTells,
  type AppearanceParents,
  type Tell,
} from './appearance';
export { applyLifeEvent, lifeEventChances, liveOneYear, type YearResult } from './life';
export {
  COOKWARE_MIX,
  advanceWorldYear,
  ageOf,
  createWorld,
  ensureRoster,
  nextRunSeed,
  parseWorld,
  personFromProtagonist,
  retireProtagonist,
  temperamentFromRun,
  type NewWorldOptions,
  type ParsedWorld,
  type RetireResult,
} from './world';
export { personForCharacter } from './character';
export { createGuestPort, type GuestPortConfig } from './guests';
export { appraisalManifest, appraisalModule, appraise, createAppraisalModule } from './appraisal';
export {
  confidenceOf,
  createPerceptionModule,
  manifest as perceptionManifest,
  perceptionModule,
} from './perception';
