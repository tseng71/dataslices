import { generationStates, places, lightingPresets, sceneDefaults } from "../../data/story.js";

export function createStoryState() {
  let activeScene = $state("opening-city");
  let thresholdStep = $state("opening-city");
  let generationAge = $state(0);
  let selectedPlace = $state("times-square");
  let selectedLightingPreset = $state("unshielded");
  let motionMode = $state("full");
  let observerStatus = $state("ready");

  let generation = $derived(
    generationStates.find((state) => state.age_years === generationAge) ??
      generationStates[0]
  );
  let place = $derived(
    places.find((item) => item.place_id === selectedPlace) ?? places[0]
  );
  let lighting = $derived(
    lightingPresets.find((item) => item.preset_id === selectedLightingPreset) ??
      lightingPresets[0]
  );
  let visual = $derived.by(() => ({
    activeScene,
    thresholdStep,
    generation,
    place,
    lighting,
    motionMode,
    observerStatus
  }));

  function forceScene(sceneId) {
    const defaults = sceneDefaults[sceneId];
    activeScene = sceneId;
    if (!defaults) return;
    if (defaults.thresholdStep) thresholdStep = defaults.thresholdStep;
    if (defaults.generationAge !== undefined) generationAge = defaults.generationAge;
    if (defaults.selectedPlace) selectedPlace = defaults.selectedPlace;
    if (defaults.selectedLightingPreset) {
      selectedLightingPreset = defaults.selectedLightingPreset;
    }
  }

  return {
    get activeScene() {
      return activeScene;
    },
    get visual() {
      return visual;
    },
    setActiveScene(sceneId) {
      activeScene = sceneId;
    },
    setThresholdStep(sceneId) {
      thresholdStep = sceneId;
      activeScene = sceneId;
    },
    setGenerationAge(age) {
      generationAge = age;
      activeScene = age === 18 ? "generation-eighteen" : "generation-zero";
    },
    setPlace(placeId) {
      selectedPlace = placeId;
      activeScene = `place-${placeId}`;
    },
    setLightingPreset(presetId) {
      selectedLightingPreset = presetId;
      activeScene = `lighting-${presetId}`;
    },
    setMotionMode(value) {
      motionMode = value;
    },
    setObserverStatus(value) {
      observerStatus = value;
    },
    forceScene
  };
}
