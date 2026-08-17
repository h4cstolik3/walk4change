// Globalna flaga aktywnego spaceru — ustawia ją ekran Walk, czyta nawigacja
// (BottomNav/Sidebar), żeby ostrzec przed wyjściem z ekranu w trakcie sesji.
// Moduł zamiast kontekstu: handlery kliknięć w nawigacji potrzebują wartości
// synchronicznie, bez subskrypcji i re-renderów.
let active = false

export function setWalkActive(v: boolean) {
  active = v
}

export function isWalkActive() {
  return active
}

export const WALK_LEAVE_CONFIRM =
  'Masz aktywny spacer. Wyjście z tego ekranu zakończy go i zapisze wynik.\n\nZakończyć spacer?'
