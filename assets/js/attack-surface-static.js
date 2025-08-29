// Static Attack Surface Map - No D3 Simulation
class StaticAttackSurfaceMap {
    constructor() {
        this.container = document.getElementById('attack-surface-map');
        this.svg = null;
        this.width = 0;
        this.height = 0;
        this.nodes = [];
        this.links = [];
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
                    <h2>Static Attack Surface Analyzer</h2>
                    <p>Completely static visualization with no random movement</p>
                    
                    <div class="quick-test">
                        <h3>Test with sample profiles:</h3>
                        <div class="profile-cards">
                            <div class="profile-card gaming" onclick="window.staticAttackMap.loadProfile('aryanbhopale7@gmail.com')">
                                <div class="profile-header">
                                    <span class="profile-icon">🎮</span>
                                    <span class="profile-type">Gaming Enthusiast</span>
                                </div>
                                <div class="profile-email">aryanbhopale7@gmail.com</div>
                                <div class="profile-stats">7 breaches found</div>
                            </div>
                            
                            <div class="profile-card professional" onclick="window.staticAttackMap.loadProfile('ayushkumbhar1111@gmail.com')">
                                <div class="profile-header">
                                    <span class="profile-icon">💼</span>
                                    <span class="profile-type">Professional</span>
                                </div>
                                <div class="profile-email">ayushkumbhar1111@gmail.com</div>
                                <div class="profile-stats">8 breaches found</div>
                            </div>
                            
                            <div class="profile-card healthcare" onclick="window.staticAttackMap.loadProfile('pj28032006@gmail.com')">
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
                <p>Building static attack surface map...</p>
            </div>
        `;

        try {
            const breaches = await this.fetchBreaches(email);
            if (breaches.length > 0) {
                this.createStaticVisualization(email, breaches);
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

    createStaticVisualization(email, breaches) {
        this.container.innerHTML = '';
        this.generateStaticNodes(email, breaches);
        this.renderStaticSVG();
        this.addControls(email, breaches);
    }

    generateStaticNodes(email, breaches) {
        this.nodes = [];
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Central email node - FIXED position
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
            fixed: true // Mark as non-draggable
        });

        // Platform nodes arranged in circle - CALCULATED positions
        const radius = Math.min(180, (Math.min(this.width, this.height) / 2) - 120);
        
        breaches.forEach((breach, i) => {
            const platform = this.getPlatformInfo(breach.website);
            const angle = (i / breaches.length) * 2 * Math.PI;
            
            // Calculate exact position
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
                fixed: false // Allow dragging
            });
        });
    }

    renderStaticSVG() {
        // Create SVG with D3 but NO SIMULATION
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('background', 'radial-gradient(circle, #f8f9fa 0%, #e9ecef 100%)');

        // Add arrow marker for attack paths
        this.svg.append('defs')
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-10 -10 20 20')
            .attr('refX', 15)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .append('path')
            .attr('d', 'M-8,-5L3,0L-8,5')
            .attr('fill', '#dc3545')
            .attr('opacity', 0.7);

        // Draw breach links (red lines to center)
        const breachLinks = this.svg.selectAll('.breach-link')
            .data(this.nodes.filter(n => n.type === 'platform'))
            .enter()
            .append('line')
            .attr('class', 'breach-link')
            .attr('x1', this.width / 2)
            .attr('y1', this.height / 2)
            .attr('x2', d => d.x)
            .attr('y2', d => d.y)
            .attr('stroke', '#dc3545')
            .attr('stroke-width', 3)
            .attr('opacity', 0.8);

        // Draw attack path links (orange dashed lines between platforms)
        this.drawAttackPaths();

        // Draw nodes with NO DRAG BEHAVIOR initially
        this.drawNodes();
        
        // Store link references for drag updates
        this.breachLinks = breachLinks;
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

        const attackPaths = [];
        Object.entries(connections).forEach(([source, targets]) => {
            const sourceNode = this.nodes.find(n => n.id === source);
            if (sourceNode) {
                targets.forEach(target => {
                    const targetNode = this.nodes.find(n => n.id === target);
                    if (targetNode) {
                        attackPaths.push({ source: sourceNode, target: targetNode });
                    }
                });
            }
        });

        this.attackPathLinks = this.svg.selectAll('.attack-path')
            .data(attackPaths)
            .enter()
            .append('line')
            .attr('class', 'attack-path')
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
            .attr('stroke', '#fd7e14')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('marker-end', 'url(#arrowhead)')
            .attr('opacity', 0.5);
    }

    drawNodes() {
        // Create node groups
        this.nodeGroups = this.svg.selectAll('.node')
            .data(this.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .style('cursor', d => d.fixed ? 'default' : 'move');

        // Add simple drag behavior ONLY for platform nodes
        this.nodeGroups
            .filter(d => !d.fixed)
            .call(d3.drag()
                .on('start', this.staticDragStart.bind(this))
                .on('drag', this.staticDragged.bind(this))
                .on('end', this.staticDragEnd.bind(this)));

        // Draw circles
        this.nodeGroups.append('circle')
            .attr('r', d => d.size / 2)
            .attr('fill', d => d.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .style('filter', d => d.type === 'email' ? 'drop-shadow(0 0 10px rgba(220,53,69,0.5))' : 'none');

        // Add icons
        this.nodeGroups.append('text')
            .text(d => d.icon)
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('font-size', d => d.type === 'email' ? '24px' : '18px')
            .style('pointer-events', 'none');

        // Add labels
        this.nodeGroups.append('text')
            .text(d => d.label)
            .attr('text-anchor', 'middle')
            .attr('dy', d => d.size/2 + 15)
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('fill', '#2c3e50')
            .style('pointer-events', 'none');

        // Add risk indicators for critical platforms
        this.nodeGroups
            .filter(d => d.type === 'platform' && d.risk === 'critical')
            .append('circle')
            .attr('r', 6)
            .attr('cx', 20)
            .attr('cy', -20)
            .attr('fill', '#dc3545');

        // Add tooltips
        this.nodeGroups
            .on('mouseover', this.showTooltip.bind(this))
            .on('mouseout', this.hideTooltip.bind(this));
    }

    // Static drag handlers - NO SIMULATION
    staticDragStart(event, d) {
        // Just record starting position
        d.startX = d.x;
        d.startY = d.y;
    }

    staticDragged(event, d) {
        // Apply boundary constraints
        const margin = 50;
        const minX = margin;
        const maxX = this.width - margin;
        const minY = margin + 80;
        const maxY = this.height - margin;

        // Update node position with constraints
        d.x = Math.max(minX, Math.min(maxX, event.x));
        d.y = Math.max(minY, Math.min(maxY, event.y));

        // Update node visual position immediately
        d3.select(event.sourceEvent.target.parentNode)
            .attr('transform', `translate(${d.x},${d.y})`);

        // Update connected links immediately
        this.updateLinksForNode(d);
    }

    staticDragEnd(event, d) {
        // Node stays at final position - no reset
        console.log(`Node ${d.label} moved to (${d.x}, ${d.y})`);
    }

    updateLinksForNode(movedNode) {
        // Update breach links
        this.breachLinks
            .filter(function(d) { return d.id === movedNode.id; })
            .attr('x2', movedNode.x)
            .attr('y2', movedNode.y);

        // Update attack path links
        if (this.attackPathLinks) {
            this.attackPathLinks
                .filter(function(d) { 
                    return d.source.id === movedNode.id || d.target.id === movedNode.id; 
                })
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
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
                    <button onclick="window.staticAttackMap.showStartScreen()" class="btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button onclick="window.staticAttackMap.exportData()" class="btn-primary">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>
        `;
        
        this.container.appendChild(controls);
    }

    showTooltip(event, d) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'attack-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.9)')
            .style('color', 'white')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', '1000');

        let content = `<strong>${d.icon} ${d.label}</strong><br>`;
        
        if (d.type === 'email') {
            content += `Total Breaches: ${d.breaches}`;
        } else {
            content += `Risk: ${d.risk.toUpperCase()}<br>`;
            content += `Category: ${d.category}<br>`;
            content += `Date: ${d.date}`;
        }

        tooltip.html(content)
               .style('left', (event.pageX + 10) + 'px')
               .style('top', (event.pageY - 10) + 'px')
               .transition().duration(200).style('opacity', 1);
    }

    hideTooltip() {
        d3.selectAll('.attack-tooltip').remove();
    }

    showNoBreaches(email) {
        this.container.innerHTML = `
            <div class="no-breaches">
                <i class="fas fa-shield-alt safe-icon"></i>
                <h2>All Clear! 🎉</h2>
                <p><strong>${email}</strong> wasn't found in any known breaches.</p>
                <button onclick="window.staticAttackMap.showStartScreen()" class="btn-primary">
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
                <button onclick="window.staticAttackMap.showStartScreen()" class="btn-primary">
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
        a.download = `static-attack-surface-${this.currentEmail}-${Date.now()}.json`;
        a.click();
    }
}

// Initialize the static attack surface map
window.staticAttackMap = new StaticAttackSurfaceMap();
