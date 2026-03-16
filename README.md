# Badminton Tournament Manager

A mobile-first web application for managing badminton doubles tournaments with intelligent round-robin scheduling.

## Features

- **Player Management**: Add/remove players with a clean, intuitive interface
- **Smart Match Scheduling**: Automatic round-robin match generation that maximizes variety
- **Rest Optimization**: Intelligent algorithm ensures players get adequate rest between matches
- **Real-time Leaderboard**: Track wins, losses, points, and win percentages
- **Multi-Court Support**: Configure 1-4 courts for simultaneous matches
- **Mobile-Optimized**: Beautiful claymorphism design that works perfectly on phones and tablets
- **No Backend Required**: Pure client-side application, perfect for static hosting

## How It Works

1. **Add Players**: Enter at least 4 players to start a tournament
2. **Configure Courts**: Set the number of available courts (default: 2)
3. **Start Tournament**: The system automatically generates all matches using a round-robin algorithm
4. **Play Matches**: Enter scores for each match as they complete
5. **Track Progress**: View real-time leaderboard with comprehensive statistics

## Match Scheduling Algorithm

The tournament uses an intelligent scheduling system that:
- Generates all possible unique team pairings
- Ensures each player partners with different people
- Maximizes variety in opponents
- Optimizes rest periods between matches
- Handles odd numbers of players with rotating byes

## Deployment

### Netlify (Recommended)

1. Push this repository to GitHub
2. Connect your repository to Netlify
3. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.`
4. Click "Deploy site"

### Local Development

Simply open `index.html` in a modern browser. No build tools or dependencies required!

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript ES6+
- **Design System**: High-Fidelity Claymorphism
- **Fonts**: Google Fonts (Nunito + DM Sans)
- **Hosting**: Static site (Netlify, GitHub Pages, etc.)

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT License - feel free to use this for your tournaments!

## Credits

Built with love for badminton players everywhere.

