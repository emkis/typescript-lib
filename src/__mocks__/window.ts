export function mockGtmDataLayer() {
  const push = jest.fn()
  const dataLayer = { push }

  // @ts-expect-error injecting property in window
  window.dataLayer = dataLayer

  return dataLayer
}
