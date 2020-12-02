# Microservices: Ticketing application
## Quickstart
**Requirements:** [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/) enabled, [skaffold](https://skaffold.dev/)

- GCE/GCK:
  - `skaffold dev`  
- Minikube
  1. Rebuild images: `docker build -f <path/to/Dockerfile> -t <tag> .`
  2. Push to Docker hub: `docker push -t <tag>`
  3. Update image values in [k8s config files](./k8s)
  4. `skaffold dev`

## Features
- Production grade authentication
- Production grade event bus
- Authenticated users can list a ticket for an event for sale
- Authenticated users can buy tickets listed by others
- Athenticated user can edit the tickets their listed
- Ticket Lock with timer
  - "Lock" ticket for 15 minutes when user attempts to purchase it
  - No other user can purchase a ticket while it is locked
  - Ticket price can't be edited while it is locked

## Resources
|User|Ticket|Order|Charge|
|--|--|--|--|
|email: string|title: string|userId: ref to User|orderId: ref to Order|
|password: string|price: number|status: Created/Canceled/AwaitingPayment/Completed|status: Created/Completed/Failed|
||userId: ref to User|ticketId: Ref to Ticket|amount: number|
||orderId: ref to Order|expiresAt: Date|stripeId: string|
||||stripeRefundId: string|
## Services
|Service||
|--|--|
|auth|sign-up/in/out|
|tickets|Ticket creation/editing|
|orders|Order creation/editing|
|expiration|Watched for order to be created. Cancels them after 15 minutes|
|payments|Handles credit card payments. Cancels orders if payment fails, completes if payment succeeds.
|NATS Streaming Server|"event bus"


## Events

## Tests
In each `/services/<service>` folders: `yarn && yarn run test`
