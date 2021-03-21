import type { IDataLayerEvent } from './types'

declare global {
  interface Window {
    dataLayer: IDataLayerEvent[]
  }
}
