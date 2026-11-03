package com.globalbooking.business.domain;

import com.globalbooking.business.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
@Table(name = "businesses")
public class Business extends BaseEntity {
    @Column(name = "owner_user_id", nullable = false)
    private UUID ownerUserId;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status;

    protected Business() {
    }

    public Business(UUID ownerUserId, String name, String description) {
        this.ownerUserId = ownerUserId;
        this.name = name;
        this.description = description;
        this.status = Status.ACTIVE;
    }

    public void update(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void delete() {
        if (status != Status.DELETED) {
            status = Status.DELETED;
            markDeleted();
        }
    }
}
