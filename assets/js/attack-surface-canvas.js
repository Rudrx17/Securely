// Canvas-based Attack Surface Map - No D3 at all
class CanvasAttackSurfaceMap {
    constructor() {
        this.container = document.getElementById('attack-surface-map');
        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
        this.nodes = [];
        this.links = [];
        this.currentEmail = null;
        this.isDragging = false;
        this.dragNode = null;
        this.dragOffset = { x: 0, y: 0 };
        this.hoveredNode = null;
        this.tooltip = null;
        
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
        this.setupContainer();
        this.showStartScreen();
    }

    setupContainer() {
        this.width = Math.max(800, this.container.clientWidth);
        this.height = Math.max(600, this.container.clientHeight);
    }

    showStartScreen() {
        this.container.innerHTML = `
            <div class="start-screen">
                <div class="start-content">
                    <i class="fas fa-project-diagram start-icon"></i>
                    <h2>Canvas Attack Surface</h2>
                    <p>Pure Canvas - No D3, No Random Movement</p>
                    
                    <div class="quick-test">
                        <h3>Test with sample profiles:</h3>
                        <div class="profile-cards">
                            <div class="profile-card gaming" onclick="window.canvasAttackMap.loadProfile('aryanbhopale7@gmail.com')">
                                <div class="profile-header">
                                    <span class="profile-icon">🎮</span>
                                    <span class="profile-type">Gaming Enthusiast</span>
                                </div>
                                <div class="profile-email">aryanbhopale7@gmail.com</div>
                                <div class="profile-stats">7 breaches found</div>
                            </div>
                            
                            <div class="profile-card professional" onclick="window.canvasAttackMap.loadProfile('ayushkumbhar1111@gmail.com')">
                                <div class="profile-header">
                                    <span class="profile-icon">💼</span>
                                    <span class="profile-type">Professional</span>
                                </div>
                                <div class="profile-email">ayushkumbhar1111@gmail.com</div>
                                <div class="profile-stats">8 breaches found</div>
                            </div>
                            
                            <div class="profile-card healthcare" onclick="window.canvasAttackMap.loadProfile('pj28032006@gmail.com')">
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
                <p>Building canvas visualization...</p>
            </div>
        `;

        try {
            const breaches = await this.fetchBreaches(email);
            if (breaches.length > 0) {
                this.createCanvasVisualization(email, breaches);
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

    createCanvasVisualization(email, breaches) {
        this.container.innerHTML = '';
        this.generateNodes(email, breaches);
        this.createCanvas();
        this.attachEventListeners();
        this.draw();
        this.addControls(email, breaches);
    }

    generateNodes(email, breaches) {
        this.nodes = [];
        this.links = [];
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Central email node
        this.nodes.push({
            id: 'center',
            label: email,
            type: 'email',
            x: centerX,
            y: centerY,
            icon: '📧',
            color: '#dc3545',
            radius: 30,
            breaches: breaches.length,
            draggable: false
        });

        // Platform nodes in circle
        const radius = Math.min(180, (Math.min(this.width, this.height) / 2) - 120);
        
        breaches.forEach((breach, i) => {
            const platform = this.getPlatformInfo(breach.website);
            const angle = (i / breaches.length) * 2 * Math.PI;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const node = {
                id: breach.website,
                label: this.formatLabel(breach.website),
                type: 'platform',
                x: x,
                y: y,
                icon: platform.icon,
                color: platform.color,
                radius: 22.5,
                risk: platform.risk,
                category: platform.category,
                breach: breach,
                date: breach.breach_date,
                draggable: true
            };
            
            this.nodes.push(node);
            
            // Add breach link
            this.links.push({
                source: this.nodes[0], // center node
                target: node,
                type: 'breach-link'
            });
        });

        // Add attack path links
        this.generateAttackPaths();
    }

    generateAttackPaths() {
        const connections = {
            'gmail.com': ['linkedin.com', 'github.com', 'dropbox.com'],
            'linkedin.com': ['slack.com', 'office365.com'],
            'github.com': ['stackoverflow.com', 'slack.com'],
            'coinbase.com': ['binance.com'],
            'steam.com': ['discord.com', 'twitch.tv'],
            'facebook.com': ['instagram.com']
        };

        Object.entries(connections).forEach(([source, targets]) => {
            const sourceNode = this.nodes.find(n => n.id === source);
            if (sourceNode) {
                targets.forEach(target => {
                    const targetNode = this.nodes.find(n => n.id === target);
                    if (targetNode) {
                        this.links.push({
                            source: sourceNode,
                            target: targetNode,
                            type: 'attack-path'
                        });
                    }
                });
            }
        });
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.background = 'radial-gradient(circle, #f8f9fa 0%, #e9ecef 100%)';
        this.canvas.style.cursor = 'default';
        
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
    }

    attachEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    getNodeAtPosition(x, y) {
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            const node = this.nodes[i];
            const dx = x - node.x;
            const dy = y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= node.radius) {
                return node;
            }
        }
        return null;
    }

    handleMouseDown(e) {
        const mousePos = this.getMousePos(e);
        const node = this.getNodeAtPosition(mousePos.x, mousePos.y);
        
        if (node && node.draggable) {
            this.isDragging = true;
            this.dragNode = node;
            this.dragOffset = {
                x: mousePos.x - node.x,
                y: mousePos.y - node.y
            };
            this.canvas.style.cursor = 'grabbing';
        }
    }

    handleMouseMove(e) {
        const mousePos = this.getMousePos(e);
        
        if (this.isDragging && this.dragNode) {
            // Update drag node position with constraints
            const margin = 50;
            const minX = margin;
            const maxX = this.width - margin;
            const minY = margin + 80;
            const maxY = this.height - margin;
            
            this.dragNode.x = Math.max(minX, Math.min(maxX, mousePos.x - this.dragOffset.x));
            this.dragNode.y = Math.max(minY, Math.min(maxY, mousePos.y - this.dragOffset.y));
            
            this.draw();
        } else {
            // Handle hover
            const node = this.getNodeAtPosition(mousePos.x, mousePos.y);
            
            if (node !== this.hoveredNode) {
                this.hoveredNode = node;
                this.canvas.style.cursor = node ? (node.draggable ? 'move' : 'pointer') : 'default';
                
                if (node) {
                    this.showTooltip(e, node);
                } else {
                    this.hideTooltip();
                }
            }
        }
    }

    handleMouseUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.dragNode = null;
            this.canvas.style.cursor = 'default';
        }
    }

    handleMouseLeave() {
        this.isDragging = false;
        this.dragNode = null;
        this.hoveredNode = null;
        this.canvas.style.cursor = 'default';
        this.hideTooltip();
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw links
        this.links.forEach(link => {
            this.drawLink(link);
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            this.drawNode(node);
        });
    }

    drawLink(link) {
        this.ctx.beginPath();
        this.ctx.moveTo(link.source.x, link.source.y);
        this.ctx.lineTo(link.target.x, link.target.y);
        
        if (link.type === 'breach-link') {
            this.ctx.strokeStyle = '#dc3545';
            this.ctx.lineWidth = 3;
            this.ctx.globalAlpha = 0.8;
            this.ctx.setLineDash([]);
        } else {
            this.ctx.strokeStyle = '#fd7e14';
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = 0.5;
            this.ctx.setLineDash([5, 5]);
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.ctx.globalAlpha = 1;
        
        // Draw arrow for attack paths
        if (link.type === 'attack-path') {
            this.drawArrow(link.source, link.target);
        }
    }

    drawArrow(source, target) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const unitX = dx / length;
        const unitY = dy / length;
        
        // Arrow position (at target node edge)
        const arrowX = target.x - unitX * target.radius;
        const arrowY = target.y - unitY * target.radius;
        
        // Arrow size
        const arrowLength = 10;
        const arrowWidth = 6;
        
        this.ctx.save();
        this.ctx.translate(arrowX, arrowY);
        this.ctx.rotate(Math.atan2(dy, dx));
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-arrowLength, -arrowWidth);
        this.ctx.lineTo(-arrowLength, arrowWidth);
        this.ctx.closePath();
        
        this.ctx.fillStyle = '#dc3545';
        this.ctx.globalAlpha = 0.7;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        
        this.ctx.restore();
    }

    drawNode(node) {
        // Draw circle
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = node.color;
        this.ctx.fill();
        
        // Draw border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Draw glow for email node
        if (node.type === 'email') {
            this.ctx.shadowColor = 'rgba(220,53,69,0.5)';
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
        
        // Draw icon
        this.ctx.font = node.type === 'email' ? '24px Arial' : '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#000';
        this.ctx.fillText(node.icon, node.x, node.y);
        
        // Draw label
        this.ctx.font = 'bold 11px Arial';
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(node.label, node.x, node.y + node.radius + 5);
        
        // Draw risk indicator
        if (node.type === 'platform' && node.risk === 'critical') {
            this.ctx.beginPath();
            this.ctx.arc(node.x + 20, node.y - 20, 6, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#dc3545';
            this.ctx.fill();
        }
    }

    showTooltip(e, node) {
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'attack-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'rgba(0,0,0,0.9)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '12px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.zIndex = '1000';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.2s';

        let content = `<strong>${node.icon} ${node.label}</strong><br>`;
        
        if (node.type === 'email') {
            content += `Total Breaches: ${node.breaches}`;
        } else {
            content += `Risk: ${node.risk.toUpperCase()}<br>`;
            content += `Category: ${node.category}<br>`;
            content += `Date: ${node.date}`;
        }

        tooltip.innerHTML = content;
        tooltip.style.left = (e.pageX + 10) + 'px';
        tooltip.style.top = (e.pageY - 10) + 'px';
        
        document.body.appendChild(tooltip);
        
        setTimeout(() => tooltip.style.opacity = '1', 10);
        this.tooltip = tooltip;
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }

    addControls(email, breaches) {
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
                    <button onclick="window.canvasAttackMap.showStartScreen()" class="btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button onclick="window.canvasAttackMap.exportData()" class="btn-primary">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>
        `;
        
        this.container.appendChild(controls);
    }

    showNoBreaches(email) {
        this.container.innerHTML = `
            <div class="no-breaches">
                <i class="fas fa-shield-alt safe-icon"></i>
                <h2>All Clear! 🎉</h2>
                <p><strong>${email}</strong> wasn't found in any known breaches.</p>
                <button onclick="window.canvasAttackMap.showStartScreen()" class="btn-primary">
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
                <button onclick="window.canvasAttackMap.showStartScreen()" class="btn-primary">
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
            nodes: this.nodes.map(n => ({
                id: n.id,
                label: n.label,
                type: n.type,
                x: n.x,
                y: n.y,
                risk: n.risk,
                category: n.category
            })),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `canvas-attack-surface-${this.currentEmail}-${Date.now()}.json`;
        a.click();
    }
}

// Initialize the canvas attack surface map
window.canvasAttackMap = new CanvasAttackSurfaceMap();
