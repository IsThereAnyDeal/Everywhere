/**
 * This is a type for the response of
 * https://docs.isthereanydeal.com/#tag/games/operation/games-overview-v2
 */

export interface Price {
  amount: number,
  amountInt: number,
  currency: string
}

interface Shop {
  id: number,
  name: string
}

interface Game {
  id: string,
  slug: string,
  title: string,
  type: "game"|"dlc"|"package"|null,
  mature: boolean
}

interface Drm {
  id: number,
  name: string
}

interface Platform {
  id: number,
  name: string
}

export interface PriceData {
  id: string,
  current: {
    shop: Shop,
    price: Price,
    regular: Price,
    cut: number,
    voucher: string|null,
    flag: "H"|"N"|"S"|null,
    drm: Drm[],
    platforms: Platform[],
    timestamp: string,
    expiry: string|null,
    url: string
  }|null,
  lowest: {
    shop: Shop,
    price: Price,
    regular: Price,
    cut: number,
    timestamp: string
  }|null
}

interface BundlePage {
  id: number,
  name: string
}

interface Tier {
  price: Price|null,
  games: Game[]
}

interface BundleData {
  id: number,
  title: string,
  page: BundlePage,
  url: string,
  details: string,
  isMature: boolean,
  publish: string,
  expiry: string|null,
  counts: {
    games: number,
    media: number
  }
  tiers: Tier[]
}

export interface GameOverviewResponse {
  prices: PriceData[],
  bundles: BundleData[]
}

export interface GameIdLookupResponse {
  [steamId: string]: string
}
