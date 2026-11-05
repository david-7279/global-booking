package com.globalbooking.auth.infrastructure.seed;

import com.globalbooking.auth.domain.Role;
import com.globalbooking.auth.domain.Status;
import com.globalbooking.auth.domain.User;
import com.globalbooking.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DevUserSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private void createOrUpdate(
            String email,
            String username,
            String password,
            Role role
    ) {
        var user = userRepository.findByEmail(email)
                .orElseGet(() -> new User(
                        username,
                        email,
                        passwordEncoder.encode(password),
                        role,
                        Status.ACTIVE
                ));

        user.updateUsername(username);
        user.changeStatus(Status.ACTIVE);
        user.updatePasswordHash(passwordEncoder.encode(password));

        userRepository.save(user);
    }


    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        createOrUpdate(
                "business-owner@local.test",
                "Business Owner",
                "Password123!",
                Role.BUSINESS_OWNER
        );

        createOrUpdate(
                "admin@local.test",
                "Admin",
                "Password123!",
                Role.ADMIN
        );

        createOrUpdate(
                "user@local.test",
                "Regular User",
                "Password123!",
                Role.USER
        );
    }
}
