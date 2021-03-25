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
 * Create and return track functions with injected initial properties.
 * @param initialProps - Properties that will be injected in every track event in this context.
 */
export function createTrackerContext(
  initialProps = {} as IValidDataLayerEvent
) {
  /**
   * Track an event.
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
   * Partial function that returns the trackEvent function with provided properties injected in event payload.
   * @param defaultProps - Properties that will be injected in in the returned function payload.
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

/**
 * Cool function that screams to you
 * @param name - you name
 * @internal
 */
export function scream(name: string) {
  return `HELLOOOO, ${name} !!!!`
}
