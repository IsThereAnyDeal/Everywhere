// this is a type for the response that https://itad.docs.apiary.io/#reference/game/overview/get-game-price-overview gives

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
  count: number;
  live: any[]; // Replace with the actual type of the live array elements if known
};

type Urls = {
  info: string;
  history: string;
  bundles: string;
};

type GameDetail = {
  price: Price;
  lowest: Lowest;
  bundles: Bundle;
  urls: Urls;
};

type Data = {
  [key: string]: GameDetail;
};

type GameInfo = {
  ".meta": Meta;
  data: Data;
};

export default GameInfo;
