import { useState } from "react";
import type { AtomDetail } from "../viz/molecules";

const KEY = "cbc-atom-detail";

export function useAtomDetail(): [AtomDetail, (value: AtomDetail) => void] {
  const [detail, setDetail] = useState<AtomDetail>(() => {
    try {
      return window.localStorage.getItem(KEY) === "simplified" ? "simplified" : "all";
    } catch {
      return "all";
    }
  });

  function update(value: AtomDetail) {
    setDetail(value);
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      // Private browsing can refuse storage. The choice still lasts for this visit.
    }
  }

  return [detail, update];
}
