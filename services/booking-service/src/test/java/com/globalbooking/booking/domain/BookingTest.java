package com.globalbooking.booking.domain;

import org.junit.jupiter.api.Test;
import java.time.Instant;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class BookingTest {
    @Test void pendingCanBeConfirmedButConfirmedCannotBeRejected() {
        Booking booking = new Booking(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), Instant.now().plusSeconds(3600), Instant.now().plusSeconds(7200), null);
        booking.confirm();
        assertEquals(BookingStatus.CONFIRMED, booking.getStatus());
        assertThrows(RuntimeException.class, booking::reject);
    }
    @Test void periodsMustBePositive() {
        Instant same = Instant.parse("2026-01-01T10:00:00Z");
        assertThrows(IllegalArgumentException.class, () -> new Booking(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), same, same, null));
    }
}
