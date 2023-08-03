/**
 * This is a type for the response that
 * https://itad.docs.apiary.io/#reference/game/overview/get-game-price-overview gives
 */

type Meta = {
  region: string;
  country: string;
  currency: string;
};

type Price = {
  store: string;
  cut: number;
  price: number;
  price_formatted: string;
  url: string | undefined;
  drm: string[];
};

type Lowest = {
  store: string;
  cut: number;
  price: number;
  price_formatted: string;
  url: string | undefined;
  recorded: number;
  recorded_formatted: string;
};

type Bundle = {
  title: string,
  url: string,
  expiry: null,
  expiry_rfc: null,
  type: string,
  page: string,
  details: string,
  tiers: Array<{
    price: number|null,
    price_formatted: string|null,
    fixed: number,
    note: string|null,
    games: string[]
  }>
};

type Urls = {
  info: string;
  history: string;
  bundles: string;
};

export type GameOverviewData = {
  price: Price|null;
  lowest: Lowest|null;
  bundles: {
    count: number,
    live: Bundle[]
  };
  urls: Urls|null;
};

export type GameOverviewResponse = {
  ".meta": Meta;
  data: {
    [key: string]: GameOverviewData;
  };
};
