package com.globalbooking.business.repository;

import com.globalbooking.business.domain.ProcessedEvent;
import com.globalbooking.business.domain.ProcessedEventId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedEventRepository
        extends JpaRepository<ProcessedEvent, ProcessedEventId> {
}
