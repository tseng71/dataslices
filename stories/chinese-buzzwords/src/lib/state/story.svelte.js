export function createStoryState(scenes) {
  let activeId = $state(scenes[0].id);
  let exploration = $state({
    term: "YYDS",
    year: "all",
    form: "all",
    evidence: "all"
  });
  let reducedMotion = $state(false);

  let authored = $derived(
    scenes.find((scene) => scene.id === activeId) ?? scenes[0]
  );

  let visual = $derived.by(() => ({
    ...authored,
    exploration: { ...exploration },
    reducedMotion
  }));

  return {
    get activeId() {
      return activeId;
    },
    get exploration() {
      return exploration;
    },
    get visual() {
      return visual;
    },
    setActive(id) {
      if (scenes.some((scene) => scene.id === id)) activeId = id;
    },
    setExploration(next) {
      exploration = { ...exploration, ...next };
    },
    setReducedMotion(value) {
      reducedMotion = Boolean(value);
    }
  };
}
