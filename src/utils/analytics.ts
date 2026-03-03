/**
 * Analytics utility - lightweight event tracking hooks.
 * Replace with your preferred analytics provider (GA4, Mixpanel, etc.)
 */

export type AnalyticsEvent =
  | 'explore_brands_click'
  | 'brand_card_click'
  | 'join_marketplace_submit'
  | 'create_song_submit'
  | 'kids_song_submit'
  | 'request_service_submit'
  | 'add_to_cart'
  | 'checkout_start'
  | 'payment_complete'
  | 'rewards_view'
  | 'email_contact_click'

interface EventPayload {
  event: AnalyticsEvent
  properties?: Record<string, string | number | boolean>
  timestamp: number
}

const eventLog: EventPayload[] = []

export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>
): void {
  const payload: EventPayload = {
    event,
    properties,
    timestamp: Date.now(),
  }
  eventLog.push(payload)

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', event, properties ?? '')
  }

  // TODO: Send to analytics provider
  // Example: window.gtag?.('event', event, properties)
  // Example: mixpanel.track(event, properties)
}

export function getEventLog(): EventPayload[] {
  return [...eventLog]
}
