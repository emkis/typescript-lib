export interface IValidDataLayerEvent {
  [key: string]: string | number | boolean | Record<string, unknown>
}

export interface IDataLayerEvent extends IValidDataLayerEvent {
  event: 'eventListener'
  action: string
  category: string
  label: string
  value: string | number
}

export type TTrackEventProps = Pick<
  IDataLayerEvent,
  'action' | 'category' | 'label'
>

export type TTrackEventParams = TTrackEventProps &
  IValidDataLayerEvent & { value?: string | number }
