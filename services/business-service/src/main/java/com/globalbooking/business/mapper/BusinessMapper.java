package com.globalbooking.business.mapper;

import com.globalbooking.business.domain.Business;
import com.globalbooking.business.dto.response.BusinessResponse;
import org.springframework.stereotype.Component;

@Component
public class BusinessMapper {
    public BusinessResponse toResponse(Business business) {
        return new BusinessResponse(
                business.getId(),
                business.getOwnerUserId(),
                business.getName(),
                business.getDescription(),
                business.getStatus().name(),
                business.getCreatedAt(),
                business.getUpdatedAt()
        );
    }
}
