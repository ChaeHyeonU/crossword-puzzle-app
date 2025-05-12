export interface Settings {
  isDarkMode: boolean;
  showHints: boolean;
}

export interface SettingsContextType extends Settings {
  toggleDarkMode: () => void;
  toggleHints: () => void;
}

export type SettingsKey = keyof Settings; 