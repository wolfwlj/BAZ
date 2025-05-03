# NutriTrack Setup Guide

This guide will help you set up and run the NutriTrack application frontend  on your local machine.

## Prerequisites

### Frontend
- Node.js (v14 or higher)
- npm (v6 or higher)
- Expo Go app on your mobile device (for testing)


### 2. Frontend Setup

#### Install Dependencies

Navigate to the frontend directory and install the dependencies:

```bash
cd frontend
npm install
```

#### Install Web Dependencies

If you want to run the app in a web browser, install the required web dependencies:

```bash
npx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/webpack-config@^19.0.0
```

#### Fix Dependency Issues (if any)

If you encounter dependency issues, run the following command to fix them:

```bash
npx expo install --fix
```

This command will ensure all dependencies are compatible with the installed Expo version.


## Common Issues and Solutions

### Dependency Conflicts

If you see errors like:

```
npm error ERESOLVE could not resolve
```

Run the following command to fix dependency issues:

```bash
npx expo install --fix
```
