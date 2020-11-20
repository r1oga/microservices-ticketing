# Microservices: Ticketing application
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

