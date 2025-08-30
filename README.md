# ThreatScope AI - Advanced Threat Analysis Platform

An AI-powered threat analysis platform that integrates real breach data to provide comprehensive security insights, attack surface mapping, and interactive threat simulations.

## Features

🤖 **AI Threat Engine** - AI-powered threat analysis using real breach database
🗺️ **Attack Surface Map** - Digital twin visualization of attack paths
🎭 **Threat Simulation** - Interactive "What If?" scenarios

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** PHP
- **Database:** SQLite
- **Styling:** Modern responsive design with white theme

## Project Structure

```
Securely/
├── frontend/
│   ├── index.html              # Main ThreatScope AI interface
│   ├── threat-engine.html      # AI threat analysis
│   ├── attack-surface.html     # Attack surface visualization
│   └── simulation.html         # Interactive simulations
├── backend/
│   ├── breach_checker.php      # Real breach data API endpoint
│   ├── breach_data_sample.db   # Sample breach database
│   └── gemini_api.php          # AI integration
├── assets/
│   ├── css/
│   │   └── threat-analysis.css # Main application styles
│   └── js/
│       ├── app-advanced.js     # Main application controller
│       ├── threat-analyzer.js  # AI threat analysis
│       ├── attack-surface-map-integrated.js # Attack surface visualization
│       └── threat-simulation.js  # Interactive simulations
├── .htaccess                   # Apache configuration
├── .gitignore                  # Git ignore file
└── README.md                   # This file
```

## Setup Instructions

### Prerequisites
- PHP 7.4 or higher with PDO SQLite extension
- Real breach database file: `backend/breach_data_sample.db`
- Modern web browser
- **Web server required** (XAMPP, PHP built-in server, or similar)

### Quick Start (Windows)

#### Option 1: Using XAMPP (Recommended)

1. **Install and start XAMPP**
   - Download from: https://www.apachefriends.org/
   - Start Apache service in XAMPP Control Panel

2. **Copy project to XAMPP**
   - Copy this entire project folder to `C:\xampp\htdocs\Securely`
   - Or create a symlink: `mklink /D "C:\xampp\htdocs\Securely" "C:\Users\HP\Projects\Securely"`

3. **Access the application**
   - Open browser to: `http://localhost/Securely/frontend/threat-analysis.html`

#### Option 2: Using PHP Built-in Server

1. **Ensure your real breach database exists**
   - The platform expects: `backend/breach_data_sample.db`
   - This should be your real breach data file

2. **Launch the application**
   ```cmd
   LAUNCH.cmd
   ```
   This will:
   - Verify the database exists
   - Start PHP development server on port 8000
   - Open ThreatScope AI interface automatically

3. **Access the application**
   - Browser opens automatically to: `http://localhost:8000/frontend/threat-analysis.html`

### Manual Setup

1. **Start a web server**
   ```cmd
   # Using PHP built-in server
   php -S localhost:8000
   
   # Or use XAMPP/Apache
   # Place project in htdocs and access via localhost
   ```

2. **Configure database path**
   - Database should be located at: `backend/breach_data_sample.db`
   - Update `backend/config.php` if your database is in a different location
   - The system automatically detects table structure and column mappings

3. **Access the application**
   - **PHP Server**: `http://localhost:8000/frontend/threat-analysis.html`
   - **XAMPP**: `http://localhost/[project-folder]/frontend/threat-analysis.html`

## API Endpoints

### POST `/backend/check_real_breaches.php`
Primary endpoint for checking real breach data.
```json
{
  "identifier": "user@example.com"
}
```

Returns AI-enhanced analysis with:
- Real breach matches from your database
- AI-generated threat narratives
- Attack vector classification
- Risk severity scoring
- Corporate vs personal risk assessment

## Real Data Integration

The platform automatically:
- Detects your database table structure
- Maps columns to standard fields (email/identifier, website, password)
- Performs exact and partial matching
- Enriches results with AI-powered threat intelligence

## Security Features

- **No Data Storage:** Passwords and personal information are not stored
- **Secure API:** All endpoints use POST requests with JSON payloads
- **Privacy Protection:** Password breach results mask email identifiers
- **Input Validation:** Client and server-side validation for all inputs
- **CORS Protection:** Proper CORS headers for secure API access

## Using the Platform

1. **Launch the application** using `LAUNCH.cmd`
2. **Enter any email address** from your real breach database
3. **Get AI-powered analysis** including:
   - Real breach matches from your 100MB dataset
   - Threat level assessment (CRITICAL/HIGH/MEDIUM)
   - Attack vector identification
   - Corporate vs personal risk analysis
   - Interactive attack surface mapping
   - Threat simulation scenarios

## Customization

### Database Configuration
- Update the database path in `backend/config.php`
- The system automatically adapts to different database schemas

### Styling Changes
- Modify `assets/css/threat-analysis.css` for UI customization
- Update color schemes, fonts, or layout as needed

### AI Enhancement
- Extend threat analysis rules in `backend/ai/threat_analyzer.php`
- Add new attack vectors or severity calculations
- Customize AI narratives and risk assessments

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is built for educational purposes. Use responsibly.

## About

ThreatScope AI integrates your real breach database with advanced AI analysis to provide personalized threat intelligence. The platform processes actual breach data to deliver actionable security insights and risk assessments.
