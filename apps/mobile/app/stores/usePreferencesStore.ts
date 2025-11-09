import { create } from "zustand";

type DonationRange = "$10-$25" | "$25-$50" | "$50-$100" | "$100+";

type PreferencesState = {
  causes: string[];
  regions: string[];
  preferredDonationRange: DonationRange | null;
  setCauses: (causes: string[]) => void;
  setRegions: (regions: string[]) => void;
  setPreferredDonationRange: (range: DonationRange | null) => void;
};

export const usePreferencesStore = create<PreferencesState>((set) => ({
  causes: [],
  regions: [],
  preferredDonationRange: null,
  setCauses: (causes) => set({ causes }),
  setRegions: (regions) => set({ regions }),
  setPreferredDonationRange: (preferredDonationRange) =>
    set({ preferredDonationRange }),
}));
