// Completely Static HTML Attack Surface Map - No Movement Whatsoever
class StaticHTMLAttackSurfaceMap {
    constructor() {
        this.container = document.getElementById('attack-surface-map');
        this.currentEmail = null;
        
        // Platform icons and colors
        this.platformMap = {
            'linkedin': { icon: '💼', color: '#0077b5', risk: 'high', category: 'Professional' },
            'github': { icon: '💻', color: '#333333', risk: 'high', category: 'Development' },
            'gmail': { icon: '📧', color: '#ea4335', risk: 'high', category: 'Email' },
            'facebook': { icon: '📘', color: '#1877f2', risk: 'medium', category: 'Social' },
            'instagram': { icon: '📷', color: '#e4405f', risk: 'medium', category: 'Social' },
            'twitter': { icon: '🐦', color: '#1da1f2', risk: 'medium', category: 'Social' },
            'discord': { icon: '🎮', color: '#5865f2', risk: 'low', category: 'Gaming' },
            'steam': { icon: '🎮', color: '#000000', risk: 'low', category: 'Gaming' },
            'epic': { icon: '🎮', color: '#313131', risk: 'low', category: 'Gaming' },
            'playstation': { icon: '🎮', color: '#003791', risk: 'low', category: 'Gaming' },
            'twitch': { icon: '🎥', color: '#9146ff', risk: 'low', category: 'Gaming' },
            'spotify': { icon: '🎵', color: '#1db954', risk: 'low', category: 'Entertainment' },
            'netflix': { icon: '🎬', color: '#e50914', risk: 'low', category: 'Entertainment' },
            'dropbox': { icon: '☁️', color: '#0061ff', risk: 'high', category: 'Cloud' },
            'slack': { icon: '💬', color: '#4a154b', risk: 'high', category: 'Professional' },
            'office365': { icon: '🏢', color: '#0078d4', risk: 'high', category: 'Professional' },
            'zoom': { icon: '📹', color: '#2d8cff', risk: 'medium', category: 'Professional' },
            'coinbase': { icon: '₿', color: '#0052ff', risk: 'critical', category: 'Financial' },
            'binance': { icon: '₿', color: '#f3ba2f', risk: 'critical', category: 'Financial' },
            'anthem': { icon: '🏥', color: '#004976', risk: 'critical', category: 'Healthcare' },
            'stackoverflow': { icon: '💻', color: '#f48024', risk: 'medium', category: 'Development' }
        };
        
        this.init();
    }

    init() {
        this.showStartScreen();
    }

    showStartScreen() {
        this.container.innerHTML = `
            <div class="start-screen">
                <div class="start-content">
                    <i class="fas fa-project-diagram start-icon"></i>
                    <h2>Static HTML Attack Surface</h2>
                    <p>Pure HTML/CSS - Absolutely No Movement</p>
                    
                    <div class="quick-test">
                        <h3>Test with sample profiles:</h3>
                        <div class="profile-cards">
                            <div class="profile-card gaming" onclick="window.staticHTMLMap.loadProfile('aryanbhopale7@gmail.com')">
                                <div class="profile-header">
                                    <span class="profile-icon">🎮</span>
                                    <span class="profile-type">Gaming Enthusiast</span>
                                </div>
                                <div class="profile-email">aryanbhopale7@gmail.com</div>
                                <div class="profile-stats">7 breaches found</div>
                            </div>
                            
                            <div class="profile-card professional" onclick="window.staticHTMLMap.loadProfile('ayushkumbhar1111@gmail.com')">
                                <div class="profile-header">
                                    <span class="profile-icon">💼</span>
                                    <span class="profile-type">Professional</span>
                                </div>
                                <div class="profile-email">ayushkumbhar1111@gmail.com</div>
                                <div class="profile-stats">8 breaches found</div>
                            </div>
                            
                            <div class="profile-card healthcare" onclick="window.staticHTMLMap.loadProfile('pj28032006@gmail.com')">
                                <div class="profile-header">
                                    <span class="profile-icon">🏥</span>
                                    <span class="profile-type">Healthcare</span>
                                </div>
                                <div class="profile-email">pj28032006@gmail.com</div>
                                <div class="profile-stats">7 breaches found</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadProfile(email) {
        this.currentEmail = email;
        
        // Show loading
        this.container.innerHTML = `
            <div class="loading-screen">
                <i class="fas fa-spinner fa-spin loading-spinner"></i>
                <h3>Analyzing ${email}</h3>
                <p>Building static HTML visualization...</p>
            </div>
        `;

        try {
            const breaches = await this.fetchBreaches(email);
            if (breaches.length > 0) {
                this.createStaticHTMLVisualization(email, breaches);
            } else {
                this.showNoBreaches(email);
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    async fetchBreaches(email) {
        const response = await fetch('../backend/breach_checker.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        return data.breaches || [];
    }

    createStaticHTMLVisualization(email, breaches) {
        this.container.innerHTML = '';
        
        // Create static HTML structure
        const visualization = document.createElement('div');
        visualization.className = 'static-visualization';
        
        visualization.innerHTML = `
            <div class="attack-surface-container">
                <!-- Background -->
                <div class="attack-surface-bg"></div>
                
                <!-- Center email node -->
                <div class="center-node" title="Click for details">
                    <div class="node-circle center-circle">
                        <span class="node-icon">📧</span>
                    </div>
                    <div class="node-label">${email}</div>
                    <div class="node-info">${breaches.length} breaches</div>
                </div>
                
                <!-- Platform nodes -->
                <div class="platform-nodes">
                    ${this.generatePlatformNodes(breaches)}
                </div>
                
                <!-- Links -->
                <div class="connection-lines">
                    ${this.generateConnectionLines(breaches)}
                </div>
            </div>
        `;
        
        this.container.appendChild(visualization);
        this.addStaticControls(email, breaches);
    }

    generatePlatformNodes(breaches) {
        let html = '';
        
        breaches.forEach((breach, i) => {
            const platform = this.getPlatformInfo(breach.website);
            const angle = (i / breaches.length) * 360;
            const radius = 200;
            
            // Calculate position using CSS transforms
            const x = 50; // Center at 50%
            const y = 50; // Center at 50%
            
            html += `
                <div class="platform-node" 
                     style="
                         --angle: ${angle}deg;
                         --radius: ${radius}px;
                         --color: ${platform.color};
                     "
                     title="${platform.icon} ${this.formatLabel(breach.website)} - ${platform.risk.toUpperCase()} risk">
                    <div class="node-circle platform-circle">
                        <span class="node-icon">${platform.icon}</span>
                        ${platform.risk === 'critical' ? '<div class="risk-indicator"></div>' : ''}
                    </div>
                    <div class="node-label">${this.formatLabel(breach.website)}</div>
                </div>
            `;
        });
        
        return html;
    }

    generateConnectionLines(breaches) {
        let html = '';
        
        // Generate breach lines (center to platforms)
        breaches.forEach((breach, i) => {
            const angle = (i / breaches.length) * 360;
            
            html += `
                <div class="connection-line breach-line"
                     style="
                         --angle: ${angle}deg;
                         --length: 200px;
                     ">
                </div>
            `;
        });
        
        // Generate some attack path lines
        const connections = [
            { from: 0, to: 1, show: breaches.length > 1 },
            { from: 1, to: 2, show: breaches.length > 2 },
            { from: 2, to: 4, show: breaches.length > 4 },
        ];
        
        connections.forEach(conn => {
            if (conn.show && breaches[conn.from] && breaches[conn.to]) {
                const fromAngle = (conn.from / breaches.length) * 360;
                const toAngle = (conn.to / breaches.length) * 360;
                const avgAngle = (fromAngle + toAngle) / 2;
                
                html += `
                    <div class="connection-line attack-line"
                         style="
                             --angle: ${avgAngle}deg;
                             --length: 150px;
                         ">
                    </div>
                `;
            }
        });
        
        return html;
    }

    addStaticControls(email, breaches) {
        const controls = document.createElement('div');
        controls.className = 'attack-surface-controls';
        controls.innerHTML = `
            <div class="control-panel">
                <div class="profile-info">
                    <h3><i class="fas fa-user-shield"></i> ${email}</h3>
                    <div class="stats">
                        <div class="stat-item">
                            <span class="stat-value">${breaches.length}</span>
                            <span class="stat-label">Breaches</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.calculateRiskScore(breaches)}</span>
                            <span class="stat-label">Risk Score</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.getUniqueCategories(breaches).length}</span>
                            <span class="stat-label">Categories</span>
                        </div>
                    </div>
                </div>
                
                <div class="actions">
                    <button onclick="window.staticHTMLMap.showStartScreen()" class="btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button onclick="window.staticHTMLMap.exportData()" class="btn-primary">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>
        `;
        
        this.container.appendChild(controls);
        
        // Add CSS for static visualization
        this.addStaticCSS();
    }

    addStaticCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .static-visualization {
                width: 100%;
                height: 600px;
                position: relative;
                overflow: hidden;
            }
            
            .attack-surface-container {
                position: relative;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 10px;
            }
            
            .center-node {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                z-index: 10;
                cursor: pointer;
            }
            
            .platform-node {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) 
                           rotate(var(--angle)) 
                           translateX(var(--radius)) 
                           rotate(calc(-1 * var(--angle)));
                text-align: center;
                z-index: 5;
                cursor: pointer;
            }
            
            .node-circle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 3px solid white;
                position: relative;
                margin: 0 auto 5px auto;
                transition: transform 0.2s ease;
            }
            
            .center-circle {
                background: #dc3545;
                box-shadow: 0 0 20px rgba(220, 53, 69, 0.3);
            }
            
            .platform-circle {
                background: var(--color);
                width: 45px;
                height: 45px;
            }
            
            .node-circle:hover {
                transform: scale(1.1);
            }
            
            .node-icon {
                font-size: 20px;
                pointer-events: none;
            }
            
            .center-node .node-icon {
                font-size: 24px;
            }
            
            .node-label {
                font-size: 11px;
                font-weight: bold;
                color: #2c3e50;
                margin-top: 5px;
                pointer-events: none;
            }
            
            .node-info {
                font-size: 9px;
                color: #6c757d;
                margin-top: 2px;
                pointer-events: none;
            }
            
            .risk-indicator {
                position: absolute;
                top: -5px;
                right: -5px;
                width: 12px;
                height: 12px;
                background: #dc3545;
                border-radius: 50%;
                border: 2px solid white;
            }
            
            .connection-lines {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            }
            
            .connection-line {
                position: absolute;
                top: 50%;
                left: 50%;
                transform-origin: 0 0;
                pointer-events: none;
            }
            
            .breach-line {
                width: var(--length);
                height: 3px;
                background: linear-gradient(to right, #dc3545, transparent);
                transform: translate(0, -50%) rotate(var(--angle));
                opacity: 0.8;
            }
            
            .attack-line {
                width: var(--length);
                height: 2px;
                background: linear-gradient(to right, #fd7e14, transparent);
                transform: translate(0, -50%) rotate(var(--angle));
                opacity: 0.5;
                background-image: repeating-linear-gradient(
                    to right,
                    #fd7e14,
                    #fd7e14 5px,
                    transparent 5px,
                    transparent 10px
                );
            }
        `;
        
        document.head.appendChild(style);
    }

    showNoBreaches(email) {
        this.container.innerHTML = `
            <div class="no-breaches">
                <i class="fas fa-shield-alt safe-icon"></i>
                <h2>All Clear! 🎉</h2>
                <p><strong>${email}</strong> wasn't found in any known breaches.</p>
                <button onclick="window.staticHTMLMap.showStartScreen()" class="btn-primary">
                    Try Another Email
                </button>
            </div>
        `;
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="error-screen">
                <i class="fas fa-exclamation-triangle error-icon"></i>
                <h2>Something went wrong</h2>
                <p>${message}</p>
                <button onclick="window.staticHTMLMap.showStartScreen()" class="btn-primary">
                    Go Back
                </button>
            </div>
        `;
    }

    // Utility methods
    getPlatformInfo(website) {
        const key = Object.keys(this.platformMap).find(k => website.includes(k));
        return this.platformMap[key] || { icon: '🌐', color: '#6c757d', risk: 'medium', category: 'Other' };
    }

    formatLabel(website) {
        return website.replace('.com', '').replace('.org', '').split('.')[0];
    }

    calculateRiskScore(breaches) {
        const riskValues = { critical: 25, high: 15, medium: 8, low: 3 };
        let score = 0;
        breaches.forEach(breach => {
            const platform = this.getPlatformInfo(breach.website);
            score += riskValues[platform.risk] || 5;
        });
        return Math.min(score, 100);
    }

    getUniqueCategories(breaches) {
        const categories = new Set();
        breaches.forEach(breach => {
            const platform = this.getPlatformInfo(breach.website);
            categories.add(platform.category);
        });
        return Array.from(categories);
    }

    exportData() {
        const data = {
            email: this.currentEmail,
            timestamp: new Date().toISOString(),
            message: 'Static HTML visualization - no dynamic data'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `static-attack-surface-${this.currentEmail}-${Date.now()}.json`;
        a.click();
    }
}

// Initialize the static HTML attack surface map
window.staticHTMLMap = new StaticHTMLAttackSurfaceMap();
