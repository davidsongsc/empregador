import { sendGAEvent } from '@next/third-parties/google';

export const trackEvent = (action: string, category: string, label: string, value?: number) => {
  sendGAEvent('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};