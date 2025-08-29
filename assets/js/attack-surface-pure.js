// Pure JavaScript Attack Surface Map - No D3 Drag
class PureAttackSurfaceMap {
    constructor() {
        this.container = document.getElementById('attack-surface-map');
        this.svg = null;
        this.width = 0;
        this.height = 0;
        this.nodes = [];
        this.currentEmail = null;
        this.isDragging = false;
        this.dragNode = null;
        this.dragOffset = { x: 0, y: 0 };
        
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
                    <h2>Pure JS Attack Surface</h2>
                    <p>Completely stable with no random movement</p>
                    
                    <div class="quick-test">
                        <h3>Test with sample profiles:</h3>
                        <div class="profile-cards">
                            <div class="profile-card gaming" onclick="window.pureAttackMap.loadProfile('aryanbhopale7@gmail.com')">
                                <div class="profile-header">
                                    <span class="profile-icon">🎮</span>
                                    <span class="profile-type">Gaming Enthusiast</span>
                                </div>
                                <div class="profile-email">aryanbhopale7@gmail.com</div>
                                <div class="profile-stats">7 breaches found</div>
                            </div>
                            
                            <div class="profile-card professional" onclick="window.pureAttackMap.loadProfile('ayushkumbhar1111@gmail.com')">
                                <div class="profile-header">
                                    <span class="profile-icon">💼</span>
                                    <span class="profile-type">Professional</span>
                                </div>
                                <div class="profile-email">ayushkumbhar1111@gmail.com</div>
                                <div class="profile-stats">8 breaches found</div>
                            </div>
                            
                            <div class="profile-card healthcare" onclick="window.pureAttackMap.loadProfile('pj28032006@gmail.com')">
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
                <p>Building pure JS visualization...</p>
            </div>
        `;

        try {
            const breaches = await this.fetchBreaches(email);
            if (breaches.length > 0) {
                this.createPureVisualization(email, breaches);
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

    createPureVisualization(email, breaches) {
        this.container.innerHTML = '';
        this.generateNodes(email, breaches);
        this.createSVG();
        this.renderElements();
        this.attachEventListeners();
        this.addControls(email, breaches);
    }

    generateNodes(email, breaches) {
        this.nodes = [];
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Central email node - FIXED
        this.nodes.push({
            id: 'center',
            label: email,
            type: 'email',
            x: centerX,
            y: centerY,
            icon: '📧',
            color: '#dc3545',
            size: 60,
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
            
            this.nodes.push({
                id: breach.website,
                label: this.formatLabel(breach.website),
                type: 'platform',
                x: x,
                y: y,
                icon: platform.icon,
                color: platform.color,
                size: 45,
                risk: platform.risk,
                category: platform.category,
                breach: breach,
                date: breach.breach_date,
                draggable: true
            });
        });
    }

    createSVG() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', this.width);
        this.svg.setAttribute('height', this.height);
        this.svg.style.background = 'radial-gradient(circle, #f8f9fa 0%, #e9ecef 100%)';
        this.container.appendChild(this.svg);
        
        // Add arrow marker
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('viewBox', '-10 -10 20 20');
        marker.setAttribute('refX', '15');
        marker.setAttribute('refY', '0');
        marker.setAttribute('orient', 'auto');
        marker.setAttribute('markerWidth', '8');
        marker.setAttribute('markerHeight', '8');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M-8,-5L3,0L-8,5');
        path.setAttribute('fill', '#dc3545');
        path.setAttribute('opacity', '0.7');
        
        marker.appendChild(path);
        defs.appendChild(marker);
        this.svg.appendChild(defs);
    }

    renderElements() {
        // Draw breach links
        this.breachLinks = [];
        this.nodes.filter(n => n.type === 'platform').forEach(node => {
            const link = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            link.setAttribute('x1', this.width / 2);
            link.setAttribute('y1', this.height / 2);
            link.setAttribute('x2', node.x);
            link.setAttribute('y2', node.y);
            link.setAttribute('stroke', '#dc3545');
            link.setAttribute('stroke-width', '3');
            link.setAttribute('opacity', '0.8');
            link.setAttribute('class', 'breach-link');
            link.setAttribute('data-node-id', node.id);
            
            this.svg.appendChild(link);
            this.breachLinks.push({ element: link, nodeId: node.id });
        });

        // Draw attack paths
        this.drawAttackPaths();
        
        // Draw nodes
        this.nodeElements = [];
        this.nodes.forEach(node => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('class', 'node');
            group.setAttribute('transform', `translate(${node.x},${node.y})`);
            group.style.cursor = node.draggable ? 'move' : 'default';
            group.setAttribute('data-node-id', node.id);
            
            // Circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', node.size / 2);
            circle.setAttribute('fill', node.color);
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '3');
            if (node.type === 'email') {
                circle.style.filter = 'drop-shadow(0 0 10px rgba(220,53,69,0.5))';
            }
            
            // Icon
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            icon.setAttribute('text-anchor', 'middle');
            icon.setAttribute('dy', '0.35em');
            icon.style.fontSize = node.type === 'email' ? '24px' : '18px';
            icon.style.pointerEvents = 'none';
            icon.textContent = node.icon;
            
            // Label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('dy', node.size/2 + 15);
            label.style.fontSize = '11px';
            label.style.fontWeight = 'bold';
            label.style.fill = '#2c3e50';
            label.style.pointerEvents = 'none';
            label.textContent = node.label;
            
            group.appendChild(circle);
            group.appendChild(icon);
            group.appendChild(label);
            
            // Risk indicator for critical platforms
            if (node.type === 'platform' && node.risk === 'critical') {
                const riskCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                riskCircle.setAttribute('r', '6');
                riskCircle.setAttribute('cx', '20');
                riskCircle.setAttribute('cy', '-20');
                riskCircle.setAttribute('fill', '#dc3545');
                group.appendChild(riskCircle);
            }
            
            this.svg.appendChild(group);
            this.nodeElements.push({ element: group, node: node });
        });
    }

    drawAttackPaths() {
        const connections = {
            'gmail.com': ['linkedin.com', 'github.com', 'dropbox.com'],
            'linkedin.com': ['slack.com', 'office365.com'],
            'github.com': ['stackoverflow.com', 'slack.com'],
            'coinbase.com': ['binance.com'],
            'steam.com': ['discord.com', 'twitch.tv'],
            'facebook.com': ['instagram.com']
        };

        this.attackPathLinks = [];
        Object.entries(connections).forEach(([source, targets]) => {
            const sourceNode = this.nodes.find(n => n.id === source);
            if (sourceNode) {
                targets.forEach(target => {
                    const targetNode = this.nodes.find(n => n.id === target);
                    if (targetNode) {
                        const link = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        link.setAttribute('x1', sourceNode.x);
                        link.setAttribute('y1', sourceNode.y);
                        link.setAttribute('x2', targetNode.x);
                        link.setAttribute('y2', targetNode.y);
                        link.setAttribute('stroke', '#fd7e14');
                        link.setAttribute('stroke-width', '2');
                        link.setAttribute('stroke-dasharray', '5,5');
                        link.setAttribute('marker-end', 'url(#arrowhead)');
                        link.setAttribute('opacity', '0.5');
                        link.setAttribute('class', 'attack-path');
                        
                        this.svg.appendChild(link);
                        this.attackPathLinks.push({ 
                            element: link, 
                            sourceId: sourceNode.id, 
                            targetId: targetNode.id 
                        });
                    }
                });
            }
        });
    }

    attachEventListeners() {
        // Add mouse event listeners to draggable nodes
        this.nodeElements.forEach(({ element, node }) => {
            if (node.draggable) {
                element.addEventListener('mousedown', (e) => this.handleMouseDown(e, node));
                element.addEventListener('mouseover', (e) => this.showTooltip(e, node));
                element.addEventListener('mouseout', () => this.hideTooltip());
            } else {
                element.addEventListener('mouseover', (e) => this.showTooltip(e, node));
                element.addEventListener('mouseout', () => this.hideTooltip());
            }
        });

        // Global mouse event listeners for dragging
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());
    }

    handleMouseDown(e, node) {
        e.preventDefault();
        this.isDragging = true;
        this.dragNode = node;
        
        const rect = this.svg.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left - node.x,
            y: e.clientY - rect.top - node.y
        };
        
        // Change cursor
        document.body.style.cursor = 'grabbing';
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.dragNode) return;
        
        const rect = this.svg.getBoundingClientRect();
        const newX = e.clientX - rect.left - this.dragOffset.x;
        const newY = e.clientY - rect.top - this.dragOffset.y;
        
        // Apply boundary constraints
        const margin = 50;
        const minX = margin;
        const maxX = this.width - margin;
        const minY = margin + 80;
        const maxY = this.height - margin;
        
        this.dragNode.x = Math.max(minX, Math.min(maxX, newX));
        this.dragNode.y = Math.max(minY, Math.min(maxY, newY));
        
        this.updateNodePosition(this.dragNode);
    }

    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.dragNode = null;
            document.body.style.cursor = '';
        }
    }

    updateNodePosition(node) {
        // Update node group position
        const nodeElement = this.nodeElements.find(n => n.node.id === node.id);
        if (nodeElement) {
            nodeElement.element.setAttribute('transform', `translate(${node.x},${node.y})`);
        }
        
        // Update breach links
        this.breachLinks.forEach(link => {
            if (link.nodeId === node.id) {
                link.element.setAttribute('x2', node.x);
                link.element.setAttribute('y2', node.y);
            }
        });
        
        // Update attack path links
        this.attackPathLinks.forEach(link => {
            if (link.sourceId === node.id) {
                link.element.setAttribute('x1', node.x);
                link.element.setAttribute('y1', node.y);
            }
            if (link.targetId === node.id) {
                link.element.setAttribute('x2', node.x);
                link.element.setAttribute('y2', node.y);
            }
        });
    }

    showTooltip(e, node) {
        this.hideTooltip(); // Remove any existing tooltip
        
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
        
        // Fade in
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
        
        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
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
                    <button onclick="window.pureAttackMap.showStartScreen()" class="btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button onclick="window.pureAttackMap.exportData()" class="btn-primary">
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
                <button onclick="window.pureAttackMap.showStartScreen()" class="btn-primary">
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
                <button onclick="window.pureAttackMap.showStartScreen()" class="btn-primary">
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
            nodes: this.nodes,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pure-attack-surface-${this.currentEmail}-${Date.now()}.json`;
        a.click();
    }
}

// Initialize the pure JavaScript attack surface map
window.pureAttackMap = new PureAttackSurfaceMap();
