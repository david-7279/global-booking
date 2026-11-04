-- Initial template catalogue, version 1.
-- Templates are append-only: new content is registered as a new version by a later migration or through the
-- administrative API. Placeholders use the {{variable}} syntax and are rendered strictly.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO notification_templates (id, code, channel, locale, version, subject_template, body_template, active,
                                    description, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'USER_REGISTERED', 'EMAIL', 'en', 1,
     'Welcome to Global Booking',
     'Hello {{recipientName}},

Your Global Booking account was created successfully.

Email: {{recipientEmail}}
Account type: {{role}}
Status: {{accountStatus}}

You can now sign in and start booking services with our partners.

If you did not create this account, please contact our support team.

Global Booking',
     TRUE, 'Welcome message sent when a user registers.', NOW(), NOW()),

    (gen_random_uuid(), 'USER_STATUS_CHANGED', 'EMAIL', 'en', 1,
     'Your Global Booking account status changed',
     'Hello {{recipientName}},

The status of your Global Booking account changed.

Previous status: {{previousStatus}}
New status: {{newStatus}}

If the new status is SUSPENDED or BANNED, sign-in and new bookings may be blocked until the restriction is lifted.

Global Booking',
     TRUE, 'Account status change notification.', NOW(), NOW()),

    (gen_random_uuid(), 'USER_DELETED', 'EMAIL', 'en', 1,
     'Your Global Booking account was deleted',
     'Hello {{recipientName}},

Your Global Booking account was deleted on {{deletedAt}}.

Your personal data will no longer be used to contact you. Records required for legal or accounting purposes may be
retained for the period defined by law.

Global Booking',
     TRUE, 'Account deletion confirmation.', NOW(), NOW()),

    (gen_random_uuid(), 'BOOKING_CREATED', 'EMAIL', 'en', 1,
     'Booking request received - {{bookingReference}}',
     'Hello {{recipientName}},

we received your booking request.

Reference: {{bookingReference}}
Starts: {{startAt}}
Ends: {{endAt}}
Status: {{bookingStatus}}

The business will review the request and you will receive another message as soon as it is confirmed or rejected.

Global Booking',
     TRUE, 'Booking request acknowledgement sent to the customer.', NOW(), NOW()),

    (gen_random_uuid(), 'BOOKING_CREATED', 'IN_APP', 'en', 1,
     'Booking request received',
     'Your booking request {{bookingReference}} was received and is waiting for confirmation. Start: {{startAt}}.',
     TRUE, 'Booking request acknowledgement shown in the platform inbox.', NOW(), NOW()),

    (gen_random_uuid(), 'BOOKING_CONFIRMED', 'EMAIL', 'en', 1,
     'Your booking is confirmed - {{bookingReference}}',
     'Hello {{recipientName}},

your booking was confirmed.

Reference: {{bookingReference}}
Starts: {{startAt}}
Ends: {{endAt}}
Status: {{bookingStatus}}

Please arrive a few minutes before the start time. If you can no longer attend, cancel the booking so the time slot is
released to other customers.

Global Booking',
     TRUE, 'Booking confirmation sent to the customer.', NOW(), NOW()),

    (gen_random_uuid(), 'BOOKING_CONFIRMED', 'IN_APP', 'en', 1,
     'Booking confirmed',
     'Your booking {{bookingReference}} is confirmed for {{startAt}}.',
     TRUE, 'Booking confirmation shown in the platform inbox.', NOW(), NOW()),

    (gen_random_uuid(), 'BOOKING_CANCELLED', 'EMAIL', 'en', 1,
     'Your booking was cancelled - {{bookingReference}}',
     'Hello {{recipientName}},

your booking was cancelled.

Reference: {{bookingReference}}
Was scheduled for: {{startAt}}
Status: {{bookingStatus}}

If you did not request this cancellation, contact the business or our support team.

Global Booking',
     TRUE, 'Booking cancellation notice.', NOW(), NOW()),

    (gen_random_uuid(), 'BOOKING_CANCELLED', 'IN_APP', 'en', 1,
     'Booking cancelled',
     'Your booking {{bookingReference}} scheduled for {{startAt}} was cancelled.',
     TRUE, 'Booking cancellation shown in the platform inbox.', NOW(), NOW()),

    (gen_random_uuid(), 'BOOKING_REJECTED', 'EMAIL', 'en', 1,
     'Your booking request was declined - {{bookingReference}}',
     'Hello {{recipientName}},

the business could not accept your booking request.

Reference: {{bookingReference}}
Requested period: {{startAt}} - {{endAt}}
Status: {{bookingStatus}}

You can search for another available time slot on the booking page.

Global Booking',
     TRUE, 'Booking rejection notice.', NOW(), NOW()),

    (gen_random_uuid(), 'BOOKING_REJECTED', 'IN_APP', 'en', 1,
     'Booking request declined',
     'The business declined your booking request {{bookingReference}} for {{startAt}}.',
     TRUE, 'Booking rejection shown in the platform inbox.', NOW(), NOW()),

    (gen_random_uuid(), 'BOOKING_COMPLETED', 'EMAIL', 'en', 1,
     'Thank you for using Global Booking - {{bookingReference}}',
     'Hello {{recipientName}},

your booking was marked as completed.

Reference: {{bookingReference}}
Period: {{startAt}} - {{endAt}}

We hope everything went well. You can book the same service again at any time.

Global Booking',
     TRUE, 'Booking completion follow-up.', NOW(), NOW()),

    (gen_random_uuid(), 'BOOKING_COMPLETED', 'IN_APP', 'en', 1,
     'Booking completed',
     'Your booking {{bookingReference}} for {{startAt}} was marked as completed. Thank you for using Global Booking.',
     TRUE, 'Booking completion shown in the platform inbox.', NOW(), NOW());
