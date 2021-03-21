import { mockGtmDataLayer } from './__mocks__/window'
import { createTracker } from '../src/index'

describe('GTM Analytics Service', () => {
  beforeEach(jest.clearAllMocks)

  const mockDataLayer = mockGtmDataLayer()

  describe('When createTracker is called', () => {
    it('should return expected tracker functions', () => {
      const trackContext = createTracker()

      expect(trackContext).toEqual({
        trackEvent: expect.any(Function),
        trackerWithDefaultProps: expect.any(Function),
      })
    })

    it('should return trackEvent with initial properties injected in event payload', () => {
      const initialProps = { foo: 'FOO', bar: 'BaR' }

      const trackContext = createTracker(initialProps)
      const { trackEvent } = trackContext

      trackEvent({ action: '...', category: '...', label: '...' })

      expect(mockDataLayer.push).toBeCalledWith(
        expect.objectContaining({
          foo: expect.stringMatching('FOO'),
          bar: expect.stringMatching('BaR'),
        })
      )

      expect(mockDataLayer.push).toHaveBeenCalledTimes(1)
    })
  })

  describe('When trackEvent is called', () => {
    it('should have default properties in event payload', () => {
      const trackContext = createTracker()
      const { trackEvent } = trackContext

      trackEvent({
        action: 'mockAction',
        category: 'mockCategory',
        label: 'mockLabel',
      })

      expect(mockDataLayer.push).toHaveBeenNthCalledWith(1, {
        event: 'eventListener',
        action: 'mockAction',
        category: 'mockCategory',
        label: 'mockLabel',
        value: '',
      })
    })

    it('should be able to track new properties, other than the default ones', () => {
      const trackContext = createTracker()
      const { trackEvent } = trackContext

      trackEvent({
        action: 'mockAction',
        category: 'mockCategory',
        label: 'mockLabel',
        // new properties bellow
        name: 'Emkis',
        age: 22,
        info: { a: false, b: true },
      })

      expect(mockDataLayer.push).toHaveBeenNthCalledWith(1, {
        event: 'eventListener',
        action: 'mockAction',
        category: 'mockCategory',
        label: 'mockLabel',
        value: '',
        name: 'Emkis',
        age: 22,
        info: { a: false, b: true },
      })
    })

    it('should have "value" prop defined as empty string by default', () => {
      const trackContext = createTracker()
      const { trackEvent } = trackContext

      trackEvent({ action: '...', category: '...', label: '...' })

      const expectedObjectWithValue = expect.objectContaining({ value: '' })
      expect(mockDataLayer.push).toHaveBeenCalledWith(expectedObjectWithValue)
      expect(mockDataLayer.push).toHaveBeenCalledTimes(1)
    })

    it('prop "value" should be able to be defined as another value', () => {
      const trackContext = createTracker()
      const { trackEvent } = trackContext

      trackEvent({ action: '...', category: '...', label: '...', value: 333 })

      const expectedObjectWithValue = expect.objectContaining({ value: 333 })
      expect(mockDataLayer.push).toHaveBeenCalledWith(expectedObjectWithValue)
      expect(mockDataLayer.push).toHaveBeenCalledTimes(1)
    })
  })

  describe('When trackerWithDefaultProps is called', () => {
    it('should return a function that injects the provided props in the next function', () => {
      const trackContext = createTracker()
      const { trackerWithDefaultProps } = trackContext
      const myTracker = trackerWithDefaultProps({
        label: 'My__Label',
        category: 'My__Cat',
        isInjectedByDefault: true,
      })

      myTracker({ action: 'My__Action' })

      expect(mockDataLayer.push).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'My__Action',
          category: 'My__Cat',
          label: 'My__Label',
          isInjectedByDefault: true,
        })
      )

      expect(myTracker).toBeInstanceOf(Function)
      expect(mockDataLayer.push).toHaveBeenCalledTimes(1)
    })

    it('should be able to inject new props in returned function', () => {
      const trackContext = createTracker()
      const { trackerWithDefaultProps } = trackContext
      const myTracker = trackerWithDefaultProps({
        label: 'arou',
        category: 'turo?',
      })

      myTracker({ action: 'turo sim', count: 1 })

      expect(mockDataLayer.push).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'turo sim',
          category: 'turo?',
          label: 'arou',
          count: 1,
        })
      )

      myTracker({ action: 'sera que chove?', count: 2 })

      expect(mockDataLayer.push).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'sera que chove?',
          category: 'turo?',
          label: 'arou',
          count: 2,
        })
      )

      expect(mockDataLayer.push).toHaveBeenCalledTimes(2)
    })

    it('should contain all the default props in event payload', () => {
      const trackContext = createTracker({ situation: 'Binuca de Sico' })
      const { trackerWithDefaultProps } = trackContext

      const myTracker = trackerWithDefaultProps({
        label: 'Lorem',
        category: 'Ipsum',
      })

      myTracker({ action: 'Sit dolor amet' })

      expect(mockDataLayer.push).toHaveBeenNthCalledWith(1, {
        event: 'eventListener',
        action: 'Sit dolor amet',
        label: 'Lorem',
        category: 'Ipsum',
        value: '',
        situation: 'Binuca de Sico',
      })
    })
  })
})
