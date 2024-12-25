# Visit Booking System

This is a Node.js-based Visit Booking System that allows users to book visits, view their booking history, and scan QR codes for approval. Admin users can approve or reject bookings, send confirmation emails with QR codes, and manage the booking history through an admin dashboard.

## Features

- **User Authentication**: Users can log in and register, with roles such as `User` and `Admin`.
- **Booking System**: Users can create bookings for visits, check the status of their bookings, and view booking history.
- **QR Code Generation**: Admin can approve visits and send a QR code to the user as an attachment.
- **Admin Dashboard**: Admins can approve/reject bookings, view visit history, and manage users' profiles.
- **Calendar**: Admins and users can view a calendar with appointment details.

## Installation

### Prerequisites

- Node.js
- MongoDB

### Steps

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/visit-booking-system.git
Install the required dependencies:

bash
Copy code
cd visit-booking-system
npm install
Set up environment variables in a .env file:

text
Copy code
MONGODB_URI=mongodb://localhost:27017/visit-booking-system
SESSION_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
Run the application:

bash
Copy code
npm start
The application will be running on http://localhost:3000.

Routes
User Routes
POST /login: User login via passport authentication.
GET /userdashboard: User dashboard view.
GET /bookvisit: User booking form.
POST /bookvisit: Submit a new booking.
GET /bookPending: View pending bookings.
GET /bookhistory: View booking history.
GET /profile: User profile view.
Admin Routes
GET /adminDashboard: Admin dashboard view.
GET /approvevisit: Approve or reject user visits.
POST /approvalStatus: Approve or reject a booking with email notification.
GET /admincalender: View all bookings in a calendar format.
GET /visithistory: View approved and rejected bookings.
QR Code Routes
GET /scan: QR code scanning page.
POST /scan: Process scanned QR code and display booking details.
Authentication & Authorization
ensureAuthenticated: Middleware that ensures the user is authenticated.
ensureAuthorized: Middleware that checks if the user has the right permissions to access a route.
Email Setup
The system uses Nodemailer to send confirmation emails with QR codes as attachments. Set up your email credentials in the .env file to enable email functionality.

For sending emails using Gmail, ensure you have allowed less secure apps or use OAuth2 for a more secure approach.

Dependencies
express: Web framework for Node.js
passport: Middleware for authentication
passport-local: Local authentication strategy for passport
mongoose: MongoDB object modeling
bcryptjs: Password hashing
nodemailer: Email sending
qr-image: Generate QR codes
dotenv: Load environment variables from .env file
Contributing
Fork the repository.
Create your feature branch (git checkout -b feature-name).
Commit your changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature-name).
Open a pull request.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgements
Special thanks to Node.js and MongoDB for providing the backbone of the application.
Thanks to Nodemailer and QR Image for their respective tools used in email and QR code generation.
