# Global Booking Postman collection

Import these files into Postman:

- `GlobalBooking.postman_collection.json`
- `GlobalBooking.postman_environment.json`

Select the environment `Global Booking — local example (auth + business)`.

## Automated flow

Run the collection in this order:

1. Register success — creates a unique user.
2. Login success — captures `accessToken` and `refreshToken`.
3. Authentication checks.
4. Business health.
5. Business API / Chained CRUD.
6. Logout last.

The collection-level authorization is Bearer `{{accessToken}}`. Business requests inherit it automatically. The CRUD
flow captures and reuses `businessId`, `establishmentId`, `bookingServiceId`, and `resourceId`. Cleanup requests
soft-delete resources in reverse dependency order.

## Business endpoints covered

| Area           | Active requests                               | Expected result     |
|----------------|-----------------------------------------------|---------------------|
| Business       | list, create, get, update, delete             | 200/201/204         |
| Establishment  | list, create, get, update, delete             | 200/201/204         |
| BookingService | list, create, get, update, delete             | 200/201/204         |
| Resource       | list, create, get, update, delete             | 200/201/204         |
| Validation     | missing name, invalid duration/price/currency | 400                 |
| Authorization  | no token, another-user resource               | 401 and 403/404     |
| Health         | `/actuator/health`                            | 200 and `status=UP` |

Real business routes:

```
/api/businesses
/api/businesses/{businessId}/establishments
/api/establishments/{establishmentId}/services
/api/establishments/{establishmentId}/resources
```

## Automatic JWT refresh

Before protected requests, the pre-request script checks the JWT `exp` claim and calls `/api/auth/refresh` when the
token is close to expiry. When a protected request returns `401`, the test script performs one refresh and schedules the
request again in Collection Runner. Deliberate no-token and malformed-token tests bypass this behavior with
`X-Skip-Auto-Refresh: true`.