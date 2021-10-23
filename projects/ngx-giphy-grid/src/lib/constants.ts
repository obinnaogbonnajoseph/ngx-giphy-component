import { InjectionToken } from "@angular/core";

export interface GiphyConfig {
  token: string;
}

export const GIPHY_CONFIG = new InjectionToken<GiphyConfig>('GIPHY_CONFIG');

