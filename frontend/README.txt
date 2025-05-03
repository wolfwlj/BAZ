# NutriTrack - Full Stack Application

This is the full stack implementation of the NutriTrack application, a nutrition tracking app designed specifically for people with eating disorders, particularly anorexia nervosa. It consists of a React Native frontend and a Go backend.

## Project Structure

The project follows a modular structure to maintain clean separation of concerns:

### Frontend Structure

```
frontend/
├── src/
│   ├── assets/         # Images, fonts, and other static assets
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context for state management
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # Screen components
│   │   ├── auth/       # Authentication screens
│   │   └── main/       # Main app screens
│   ├── services/       # API services
│   └── utils/          # Utility functions
└── App.js              # Entry point
```

### Backend Structure

```
backend/
├── controllers/        # Request handlers
│   ├── nutrilogController.go  # Nutrition log operations
│   └── userController.go      # User authentication and management
├── db-docker/          # Docker configuration for MySQL
├── helpers/            # Helper functions
├── initializers/       # Application initialization
│   ├── database.go     # Database connection
│   ├── loadEnvVariables.go  # Environment variables
│   └── syncdatabase.go      # Database schema sync
├── middleware/         # Request middleware
├── models/             # Data models
│   ├── Nutrilog.go     # Nutrition log model
│   └── User.go         # User model
├── routes/             # API route definitions
└── main.go             # Application entry point
```

## Key Features

1. **User Authentication**
   - Login and registration
   - Secure token-based authentication
   - Profile management

2. **Meal Tracking**
   - Log meals with nutritional information
   - Track calories, proteins, carbohydrates, and fats
   - View meal history

3. **Nutrition Analytics**
   - Daily nutrition progress
   - Visualize nutrition data with charts
   - Track streaks for consistent logging

4. **Barcode Scanner**
   - Scan food product barcodes
   - Automatically retrieve nutritional information
   - Simplify meal logging process

5. **User-Friendly Interface**
   - Clean, intuitive design
   - Motivational elements
   - Non-triggering language and approach

## Components

### Core Components

- **NutrientProgressBar**: Displays progress towards nutritional goals
- **MealCard**: Displays meal information in a card format
- **StreakDisplay**: Shows the user's current streak with motivational messages
- **CustomButton**: Standardized button component with various states
- **CustomInput**: Form input component with validation

### Screens

#### Authentication

- **LoginScreen**: User login with email and password
- **RegisterScreen**: New user registration

#### Main App

- **HomeScreen**: Dashboard with daily summary and recent meals
- **LogMealScreen**: Form to log new meals
- **StatsScreen**: Nutrition statistics and charts
- **ProfileScreen**: User profile and settings
- **MealDetailScreen**: Detailed view of a logged meal
- **EditMealScreen**: Edit existing meal logs
- **ScanBarcodeScreen**: Scan food barcodes for nutritional information

## Implementation Details

### State Management

The app uses React Context API for state management:

- **AuthContext**: Manages user authentication state, login/logout, and user information

### API Integration

The app communicates with the backend through services:

- **NutrilogService**: Handles CRUD operations for nutrition logs

### Utilities

Helper functions for common operations:

- **formatDate**: Formats dates for display
- **calculateDailyCalories**: Calculates total calories for a day
- **calculateDailyNutrients**: Calculates total nutrients for a day
- **groupByDate**: Groups nutrition logs by date
- **calculateStreak**: Calculates the user's current streak
- **getMealTypeIcon**: Returns the appropriate icon for a meal type
- **calculateProgress**: Calculates progress towards goals

## Running the App

### Frontend

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Install web dependencies (if you want to run in a web browser):
   ```
   npx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/webpack-config@^19.0.0
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Run on your device:
   - For Android: `npm run android` or scan the QR code with Expo Go
   - For iOS: `npm run ios` or scan the QR code with the Camera app
   - For Web: Press `w` in the terminal to open in a web browser

### Backend

1. Create a `.env` file in the backend directory:
   ```
   # Database connection string
   DB_INFO=root:1234@tcp(localhost:3308)/nutri_db?charset=utf8mb4&parseTime=True&loc=Local
   
   # JWT Secret for authentication
   JWT_SECRET=your_jwt_secret_key_here
   ```

2. Start the MySQL database (optional, using Docker):
   ```
   cd backend/db-docker
   docker-compose up -d
   ```

3. Run the backend server:
   ```
   cd backend
   go run main.go
   ```
   
   If you encounter issues with the Go command not being found in PowerShell, use:
   ```
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User"); go run main.go
   ```

### Connecting Frontend and Backend

The frontend is configured to connect to the backend at:
- For web: `http://localhost:8080/api/v1/user`
- For Android emulator: `http://10.0.2.2:8080/api/v1/user`

For more detailed setup instructions, see the SETUP_GUIDE.md file.

## Design Considerations

The app was designed with the following considerations in mind:

1. **Sensitivity to User Needs**: The app avoids potentially triggering elements like weight tracking or calorie counting as the primary focus.

2. **Positive Reinforcement**: Includes streak tracking and motivational messages to encourage healthy habits.

3. **Simplicity**: Clean, straightforward interface to reduce cognitive load.

4. **Privacy**: Secure authentication and data storage to protect sensitive health information.

5. **Accessibility**: Clear typography and intuitive navigation for users of all abilities.

## Recent Updates

The following improvements have been made to the application:

1. **Backend-Frontend Integration**: The frontend has been configured to connect to the backend API, allowing for user authentication and data persistence.

2. **Error Handling**: Improved error handling in both frontend and backend to provide better user feedback, especially for database connection issues.

3. **Limited Mode Operation**: The backend can now run in a "limited mode" without a database connection, allowing for testing and development without requiring a full database setup.

4. **Documentation Updates**: Comprehensive setup guides have been added to help with installation and configuration of both frontend and backend components.

5. **API URL Configuration**: The frontend API URLs have been updated to work correctly with the backend's route structure.

## Future Enhancements

Potential future improvements include:

1. **Guardian System**: Allow users to share their progress with healthcare providers or trusted individuals.

2. **Customizable Goals**: Personalized nutrition goals based on individual needs.

3. **Offline Support**: Allow the app to function without an internet connection.

4. **Expanded Analytics**: More detailed insights into nutrition patterns.

5. **Meal Suggestions**: Recommend balanced meals based on nutritional needs.

6. **Database Improvements**: Implement database migrations and better error handling for database operations.

7. **Testing**: Add comprehensive unit and integration tests for both frontend and backend components.
