export function persist(code: string, playerId: string, name: string) {
  try {
    localStorage.setItem(`kf_play_${code}`, JSON.stringify({ code, playerId, name }));
  } catch {
    /* private mode — the room still works for this tab via state */
  }
}
