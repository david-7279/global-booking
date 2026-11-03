package com.globalbooking.business.mapper;

import com.globalbooking.business.domain.BookingService;
import com.globalbooking.business.dto.response.BookingServiceResponse;
import org.springframework.stereotype.Component;

@Component
public class BookingServiceMapper {
    public BookingServiceResponse toResponse(BookingService service) {
        return new BookingServiceResponse(
                service.getId(),
                service.getEstablishmentId(),
                service.getName(),
                service.getDescription(),
                service.getDurationMinutes(),
                service.getPriceCents(),
                service.getCurrency(),
                service.getStatus().name(),
                service.getCreatedAt(),
                service.getUpdatedAt()
        );
    }
}
