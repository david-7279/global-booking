-- Template versioning in practice: new content is published as version 2 and becomes the default, because resolution
-- selects the highest active version. Version 1 stays active so notifications pinned to it keep rendering.
INSERT INTO notification_templates (id, code, channel, locale, version, subject_template, body_template, active,
                                    description, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'BOOKING_CONFIRMED', 'EMAIL', 'en', 2,
     'Confirmed: {{bookingReference}} on {{startAt}}',
     'Hello {{recipientName}},

your booking is confirmed. Keep this message as your reference.

Booking reference: {{bookingReference}}
Starts: {{startAt}}
Ends: {{endAt}}
Current status: {{bookingStatus}}

Before you arrive:
- arrive a few minutes early so the appointment can start on time;
- if you can no longer attend, cancel the booking to release the time slot;
- the business may contact you using the details registered in your account.

Global Booking',
     TRUE, 'Booking confirmation, version 2: adds arrival guidance.', NOW(), NOW()),

    (gen_random_uuid(), 'BOOKING_COMPLETED', 'IN_APP', 'en', 2,
     'How was your booking?',
     'Your booking {{bookingReference}} for {{startAt}} is completed. Thank you for choosing Global Booking - you can book the same service again whenever you need it.',
     TRUE, 'Booking completion, version 2: shorter inbox copy.', NOW(), NOW());
