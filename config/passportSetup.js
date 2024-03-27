const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Ensure the path is correct

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID from .env
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google Client Secret from .env
    callbackURL: process.env.GOOGLE_CALLBACK_URL // Your callback URL from .env
  },
  async (accessToken, refreshToken, profile, done) => {
    // Create a user object with available profile information and defaults
    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName || 'N/A', // Provide a default displayName if not available
      firstName: profile.name?.givenName || '', // Use optional chaining and provide a default
      lastName: profile.name?.familyName || '', // Use optional chaining and provide a default
      image: profile.photos?.[0]?.value || '', // Use optional chaining and provide a default
      // Add the address object with empty fields or defaults as per your requirements
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zip: ''
      }
    };

    try {
      // Check for an existing user with the provided Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // If the user doesn't exist, create a new user in the database
        user = await User.create(newUser);
      }

      done(null, user); // Proceed with the authenticated user
    } catch (err) {
      console.error('Error during user authentication with Google:', err);
      done(err, null); // Pass the error if user creation/authentication fails
    }
  }
));

// Serialize the user ID to save in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user from the session ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Retrieve the user by ID from the database
    done(null, user); // Pass the user to the next middleware
  } catch (err) {
    done(err, null); // Handle errors
  }
});
