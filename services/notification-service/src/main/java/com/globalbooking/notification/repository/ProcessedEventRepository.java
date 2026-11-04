package com.globalbooking.notification.repository;

import com.globalbooking.notification.domain.ProcessedEvent;
import com.globalbooking.notification.domain.ProcessedEventId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedEventRepository extends JpaRepository<ProcessedEvent, ProcessedEventId> {
}
