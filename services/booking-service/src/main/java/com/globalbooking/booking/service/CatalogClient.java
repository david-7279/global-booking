package com.globalbooking.booking.service;

import com.globalbooking.booking.shared.common.BookingExceptions.CatalogUnavailableException;
import com.globalbooking.booking.shared.common.BookingExceptions.CatalogValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CatalogClient {
    private final RestClient catalogRestClient;

    public void validate(UUID businessId, UUID establishmentId, UUID serviceId, UUID resourceId) {
        CatalogItem business = get("/api/businesses/" + businessId, "business");
        CatalogItem establishment = get("/api/establishments/" + establishmentId, "establishment");
        CatalogItem service = get("/api/services/" + serviceId, "booking service");
        CatalogItem resource = get("/api/resources/" + resourceId, "resource");
        if (!active(business) || !active(establishment) || !active(service) || !active(resource))
            throw new CatalogValidationException("All catalog entities must be active.");
        if (!businessId.equals(establishment.businessId()) || !establishmentId.equals(service.establishmentId()) || !establishmentId.equals(resource.establishmentId()))
            throw new CatalogValidationException("Catalog entities do not belong to the requested hierarchy.");
    }

    public void validateCatalogForAvailability(UUID establishmentId, UUID serviceId, UUID resourceId) {
        CatalogItem establishment = get("/api/establishments/" + establishmentId, "establishment");
        CatalogItem service = get("/api/services/" + serviceId, "booking service");
        CatalogItem resource = get("/api/resources/" + resourceId, "resource");
        if (!active(establishment) || !active(service) || !active(resource) || !establishmentId.equals(service.establishmentId()) || !establishmentId.equals(resource.establishmentId()))
            throw new CatalogValidationException("Catalog entities are invalid or inactive.");
    }

    public CatalogItem getService(UUID serviceId) {
        return get("/api/services/" + serviceId, "booking service");
    }

    public CatalogItem getBusiness(UUID businessId) {
        return get("/api/businesses/" + businessId, "business");
    }

    private boolean active(CatalogItem item) {
        return item != null && "ACTIVE".equals(item.status());
    }

    private CatalogItem get(String path, String name) {
        try {
            var request = catalogRestClient.get().uri(path);
            if (RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attributes) {
                String authorization = attributes.getRequest().getHeader("Authorization");
                if (authorization != null && !authorization.isBlank()) request.header("Authorization", authorization);
            }
            return request.retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, (httpRequest, httpResponse) -> {
                        throw new CatalogValidationException(name + " was not found.");
                    })
                    .onStatus(HttpStatusCode::is5xxServerError, (httpRequest, httpResponse) -> {
                        throw new CatalogUnavailableException("Catalog service returned an error.", null);
                    })
                    .body(CatalogItem.class);
        } catch (CatalogValidationException | CatalogUnavailableException exception) {
            throw exception;
        } catch (RestClientException exception) {
            throw new CatalogUnavailableException("Catalog service is unavailable.", exception);
        }
    }

    public record CatalogItem(UUID id, UUID ownerUserId, UUID businessId, UUID establishmentId, Integer durationMinutes,
                              String status) {
    }
}
