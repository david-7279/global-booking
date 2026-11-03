package com.globalbooking.business.mapper;

import com.globalbooking.business.domain.Resource;
import com.globalbooking.business.dto.response.ResourceResponse;
import org.springframework.stereotype.Component;

@Component
public class ResourceMapper {
    public ResourceResponse toResponse(Resource resource) {
        return new ResourceResponse(
                resource.getId(),
                resource.getEstablishmentId(),
                resource.getName(),
                resource.getResourceType(),
                resource.getCapacity(),
                resource.getStatus().name(),
                resource.getCreatedAt(),
                resource.getUpdatedAt()
        );
    }
}
