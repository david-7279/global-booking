package com.globalbooking.booking.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class CatalogClientConfig {
    @Bean
    RestClient catalogRestClient(RestClient.Builder builder,
                                 @Value("${app.catalog.base-url}") String baseUrl,
                                 @Value("${app.catalog.connect-timeout-ms:2000}") int connectTimeout,
                                 @Value("${app.catalog.read-timeout-ms:3000}") int readTimeout) {
        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(connectTimeout);
        factory.setReadTimeout(readTimeout);
        return builder.baseUrl(baseUrl).requestFactory(factory).build();
    }
}
