# Business Money Transfer App

A full-stack application for transferring and receiving money between users.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Account Management**: User profiles with account numbers
- **Money Transfer**: Send money to other users instantly
- **Receive Money**: Request payments from other users
- **Transaction History**: Track all transfers and receipts
- **Balance Management**: Real-time balance updates

## Tech Stack

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

**Frontend:**
- React (to be added)
- Axios for API calls

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```
MONGODB_URI=mongodb://localhost:27017/business-app
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB

```bash
# Make sure MongoDB is running
mongod
```

### 4. Run the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Accounts
- `GET /api/accounts` - Get account details
- `PUT /api/accounts` - Update account details
- `GET /api/accounts/search/:accountNumber` - Search user by account number
- `POST /api/accounts/add-balance` - Add balance (demo)

### Transactions
- `POST /api/transactions/transfer` - Send money to another user
- `POST /api/transactions/request` - Request payment from another user
- `GET /api/transactions/history` - Get transaction history
- `GET /api/transactions/:transactionId` - Get transaction details

## Example Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Transfer Money
```bash
curl -X POST http://localhost:5000/api/transactions/transfer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientAccountNumber": "ACC123456789",
    "amount": 50,
    "description": "Payment for services"
  }'
```

## Default Initial Balance

New users start with a balance of 1000 (in your chosen currency).

## Security Features

- Passwords are hashed with bcrypt
- JWT tokens expire after 7 days
- Protected routes require authentication
- Balance checks prevent overdrafts
- Unique account numbers for identification

## Project Structure

```
.
├── models/
│   ├── User.js           # User schema
│   └── Transaction.js    # Transaction schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── accounts.js      # Account management
│   └── transactions.js  # Money transfer routes
├── middleware/
│   └── auth.js          # JWT authentication
├── server.js            # Main server file
├── package.json         # Dependencies
└── README.md           # This file
```

## Future Enhancements

- [ ] React frontend UI
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Transaction fees
- [ ] Recurring payments
- [ ] Payment QR codes
- [ ] Admin dashboard
- [ ] Rate limiting
- [ ] Payment history filters
- [ ] Mobile app

## License

MIT
