# GT Service Firestore Security Specification

## Data Invariants
1. Categories and Products are publicly readable so every visitor sees live storefront updates, while writes are strictly gated to verified Admins.
2. Active Riders (`/riders/{riderId}`) contain zero PII (no phone, no CNIC) and are publicly readable; writes are Admin-only.
3. Orders (`/orders/{orderId}`) contain PII (`customerName`, `phone`, `address`) and are readable/listable ONLY by the owning `userId` (`resource.data.userId == request.auth.uid`) or a verified Admin.
4. Orders created by customers must always start in `status == 'Pending'` and carry `userId == request.auth.uid` and `createdAt == request.time`.
5. Rider Applications (`/riderApplications/{applicationId}`) contain PII (`phone`, `cnic`) and are readable/listable ONLY by the applicant (`resource.data.userId == request.auth.uid`) or a verified Admin, and must start in `status == 'Pending'`.
6. Once an Order reaches `'Delivered'` or a RiderApplication reaches `'Approved'`/`'Rejected'`, non-admins cannot mutate it.

## Adversarial Payloads Tested
1. Unauthenticated `create` on `/products/{id}` -> DENIED
2. Unauthenticated `create` on `/categories/{id}` -> DENIED
3. Non-admin verified user `create` on `/products/{id}` -> DENIED
4. Admin user with `email_verified: false` spoofing admin email -> DENIED
5. Shadow field injection (`isAdmin: true` or `extraField: 1`) on `/orders/{id}` -> DENIED
6. Oversized `productId` (>128 chars) or invalid characters in path ID -> DENIED
7. Customer creating order with `status: 'Delivered'` -> DENIED
8. Customer creating order with `userId` set to another user's UID -> DENIED
9. Non-owner reading or listing `/orders` belonging to another user -> DENIED
10. Non-owner reading or listing `/riderApplications` belonging to another user -> DENIED
11. Customer mutating `total` or `status` of an existing order -> DENIED
12. Client-forged `createdAt` timestamp not equal to `request.time` -> DENIED
