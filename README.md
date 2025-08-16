Event Management API
====================

This is an Express.js API for managing events, users, and bookings. It includes features for creating, reading, updating, and deleting events, as well as user authentication, event booking, and Stripe integration for payments.

Features
--------

-   **Event Management**: Create, view, update, and delete events.

-   **User Authentication**: Secure user signup and login with hashed passwords and JSON Web Tokens (JWT).

-   **Admin Access Control**: Restrict certain routes (e.g., event creation, deletion, and updates) to users with an "admin" role using custom middleware.

-   **Event Booking**: Users can book events, with their bookings being tracked in their user profile.

-   **Stripe Integration**: Securely handle event payments using Stripe's Checkout API.

-   **MongoDB**: Utilizes Mongoose to interact with a MongoDB Atlas database for data persistence.

* * * * *

Prerequisites
-------------

Before you begin, ensure you have the following installed:

-   **Node.js**

-   **MongoDB Atlas account** (or a local MongoDB instance)

-   **Stripe account**

You will also need to set up environment variables for secure access to your services.

* * * * *

Installation
------------

1.  **Clone the repository:**

    ```
    git clone <repository-url>
    cd <repository-name>

    ```

2.  **Install the dependencies:**

    ```
    npm install

    ```

* * * * *

Configuration
-------------

Create a `.env` file in the root directory of your project and add the following environment variables:

```
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_secret_key_for_jwt"
STRIPE_SECRET_KEY="your_stripe_secret_key"
URL="http://localhost:3000"

```

-   **`MONGODB_URI`**: Your connection string for MongoDB Atlas. You can find this in your Atlas dashboard.

-   **`JWT_SECRET`**: A strong, secret string used to sign and verify JWTs.

-   **`STRIPE_SECRET_KEY`**: Your secret key from the Stripe dashboard.

-   **`URL`**: The base URL of your application.

* * * * *

Running the Application
-----------------------

To start the server, run the following command:

```
node server.js

```

The server will be running on `http://localhost:3000`.

* * * * *

API Endpoints
-------------

### Authentication & Users

-   `POST /signup`

    -   **Description**: Creates a new user.

    -   **Body**: `{ "name": "...", "email": "...", "password": "..." }`

    -   **Access**: Public

-   `POST /login`

    -   **Description**: Authenticates a user and returns a JWT token.

    -   **Body**: `{ "email": "...", "password": "..." }`

    -   **Access**: Public

-   `POST /bookEvent`

    -   **Description**: Allows a user to book an event.

    -   **Body**: `{ "email": "...", "eventId": "..." }`

    -   **Access**: Requires a valid JWT token.

-   `POST /getUserEvents`

    -   **Description**: Fetches all events booked by a user.

    -   **Body**: `{ "email": "..." }`

    -   **Access**: Requires a valid JWT token.

### Events

-   `POST /createEvent`

    -   **Description**: Creates a new event.

    -   **Body**: `{ "title": "...", "date": "...", "location": "...", "description": "...", "duration": "...", "capacity": "...", "price": "..." }`

    -   **Access**: Requires a valid JWT token and `admin` role.

-   `GET /getEvents`

    -   **Description**: Retrieves a list of all events.

    -   **Access**: Public

-   `GET /getEvent/:id`

    -   **Description**: Retrieves a single event by its ID.

    -   **Parameters**: `:id` (the event's MongoDB ID).

    -   **Access**: Public

-   `PUT /updateEvent/:id`

    -   **Description**: Updates an existing event.

    -   **Parameters**: `:id` (the event's MongoDB ID).

    -   **Body**: `{ "title": "...", "location": "...", ... }` (any fields to update).

    -   **Access**: Requires a valid JWT token and `admin` role.

-   `DELETE /deleteEvent/:id`

    -   **Description**: Deletes an event.

    -   **Parameters**: `:id` (the event's MongoDB ID).

    -   **Access**: Requires a valid JWT token and `admin` role.

### Payments

-   `POST /checkout-session`

    -   **Description**: Creates a Stripe checkout session for an event.

    -   **Body**: `{ "eventId": "...", "email": "..." }`

    -   **Access**: Requires a valid JWT token.
