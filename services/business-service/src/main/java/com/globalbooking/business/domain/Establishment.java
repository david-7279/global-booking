package com.globalbooking.business.domain;

import com.globalbooking.business.shared.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
@Table(name = "establishments")
public class Establishment extends BaseEntity {
    @Column(name = "business_id", nullable = false)
    private UUID businessId;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 500)
    private String address;

    @Column(nullable = false, length = 80)
    private String timezone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status;

    protected Establishment() {}

    public Establishment(UUID businessId, String name, String address, String timezone) {
        this.businessId = businessId;
        this.name = name;
        this.address = address;
        this.timezone = timezone;
        this.status = Status.ACTIVE;
    }

    public void update(String name, String address, String timezone) {
        this.name = name;
        this.address = address;
        this.timezone = timezone;
    }

    public void delete() {
        if (status != Status.DELETED) {
            status = Status.DELETED;
            markDeleted();
        }
    }
}
