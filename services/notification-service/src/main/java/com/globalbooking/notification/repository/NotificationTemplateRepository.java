package com.globalbooking.notification.repository;

import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationTemplate;
import com.globalbooking.notification.domain.NotificationTemplateCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, UUID> {

    /**
     * Highest active version of a template for an exact locale.
     */
    Optional<NotificationTemplate> findTopByCodeAndChannelAndLocaleAndActiveTrueAndVersionLessThanEqualOrderByVersionDesc(
            NotificationTemplateCode code,
            NotificationChannel channel,
            String locale,
            int version
    );

    /**
     * Highest active version of a template when the requested locale is not available.
     */
    Optional<NotificationTemplate> findTopByCodeAndChannelAndActiveTrueAndVersionLessThanEqualOrderByVersionDesc(
            NotificationTemplateCode code,
            NotificationChannel channel,
            int version
    );

    @Query("""
            select coalesce(max(t.version), 0)
            from NotificationTemplate t
            where t.code = :code
              and t.channel = :channel
              and t.locale = :locale
            """)
    int findMaxVersion(
            @Param("code") NotificationTemplateCode code,
            @Param("channel") NotificationChannel channel,
            @Param("locale") String locale
    );

    List<NotificationTemplate> findAllByOrderByCodeAscChannelAscLocaleAscVersionDesc();

    List<NotificationTemplate> findByCodeOrderByChannelAscLocaleAscVersionDesc(NotificationTemplateCode code);
}
