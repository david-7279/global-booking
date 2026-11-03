package com.globalbooking.business.domain;

import com.globalbooking.business.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
@Table(name = "resources")
public class Resource extends BaseEntity {
    @Column(name = "establishment_id", nullable = false)
    private UUID establishmentId;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(name = "resource_type", nullable = false, length = 80)
    private String resourceType;

    @Column(nullable = false)
    private int capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status;

    protected Resource() {
    }

    public Resource(UUID establishmentId, String name, String resourceType, int capacity) {
        this.establishmentId = establishmentId;
        this.name = name;
        this.resourceType = resourceType;
        this.capacity = capacity;
        this.status = Status.ACTIVE;
    }

    public void update(String name, String resourceType, int capacity) {
        this.name = name;
        this.resourceType = resourceType;
        this.capacity = capacity;
    }

    public void delete() {
        if (status != Status.DELETED) {
            status = Status.DELETED;
            markDeleted();
        }
    }
}
