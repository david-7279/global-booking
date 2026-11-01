package com.globalbooking.business.domain;

import java.io.Serializable;
import java.util.UUID;

public class ProcessedEventId implements Serializable {

    private UUID eventId;
    private String consumerName;

    public ProcessedEventId() {
    }

    public ProcessedEventId(UUID eventId, String consumerName) {
        this.eventId = eventId;
        this.consumerName = consumerName;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof ProcessedEventId that)) return false;
        return eventId.equals(that.eventId)
                && consumerName.equals(that.consumerName);
    }

    @Override
    public int hashCode() {
        return 31 * eventId.hashCode() + consumerName.hashCode();
    }
}
