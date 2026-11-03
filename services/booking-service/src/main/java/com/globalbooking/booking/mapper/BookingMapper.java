package com.globalbooking.booking.mapper;

import com.globalbooking.booking.domain.Booking;
import com.globalbooking.booking.dto.response.BookingResponse;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {
    public BookingResponse toResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getUserId(),
                b.getBusinessId(),
                b.getEstablishmentId(),
                b.getBookingServiceId(),
                b.getResourceId(),
                b.getStartAt(),
                b.getEndAt(),
                b.getStatus(),
                b.getNotes(),
                b.getCreatedAt(),
                b.getUpdatedAt(),
                b.getCancelledAt()
        );
    }
}
