/**
 * @packageDocumentation A small and nice library
 */

import type {
  IDataLayerEvent,
  TTrackEventParams,
  TTrackEventProps,
  IValidDataLayerEvent,
} from '@/types'

/**
 * Create and return tracking functions with injected initial properties.
 * @param initialProps - Properties that will be injected in every track event in this context.
 * @public
 */
export function createTracker(initialProps = {} as IValidDataLayerEvent) {
  /**
   * Track and event.
   * @param eventProps - Properties you would like to track.
   */
  function trackEvent(eventProps: TTrackEventParams) {
    addDataLayerEvent({
      ...initialProps,
      ...eventProps,
      event: 'eventListener',
      value: eventProps.value ?? '',
    })
  }

  /**
   * Partial function that returns the trackEvent function with wanted properties injected.
   * @param defaultProps - Properties that will be injected in every track event in this context.
   */
  function trackerWithDefaultProps<T extends Partial<TTrackEventProps>>(
    defaultProps: T
  ) {
    return (
      remainingProps: Omit<TTrackEventProps, keyof T> & IValidDataLayerEvent
    ) => {
      trackEvent({
        ...initialProps,
        ...defaultProps,
        ...remainingProps,
      } as TTrackEventProps)
    }
  }

  function addDataLayerEvent(payload: IDataLayerEvent) {
    window.dataLayer.push(payload)
  }

  return { trackEvent, trackerWithDefaultProps }
}

/**
 * Cool function that greets you
 * @param name - you name
 * @beta
 */
export function greet(name: string) {
  return `Hello there, ${name} :)`
}
