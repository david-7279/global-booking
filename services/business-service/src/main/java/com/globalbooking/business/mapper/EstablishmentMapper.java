package com.globalbooking.business.mapper;

import com.globalbooking.business.domain.Establishment;
import com.globalbooking.business.dto.response.EstablishmentResponse;
import org.springframework.stereotype.Component;

@Component
public class EstablishmentMapper {
    public EstablishmentResponse toResponse(Establishment establishment) {
        return new EstablishmentResponse(
                establishment.getId(),
                establishment.getBusinessId(),
                establishment.getName(),
                establishment.getAddress(),
                establishment.getTimezone(),
                establishment.getStatus().name(),
                establishment.getCreatedAt(),
                establishment.getUpdatedAt()
        );
    }
}
