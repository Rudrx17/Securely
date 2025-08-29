// Optimized Attack Surface Map
class OptimizedAttackSurfaceMap {
    constructor() {
        this.container = document.getElementById('attack-surface-map');
        this.svg = null;
        this.width = 0;
        this.height = 0;
        this.nodes = [];
        this.links = [];
        this.simulation = null;
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
                    <h2>Attack Surface Analyzer</h2>
                    <p>Visualize how your breached accounts create attack paths</p>
                    
                    <div class="quick-test">
                        <h3>Test with sample profiles:</h3>
                        <div class="profile-cards">
                            <div class="profile-card gaming" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.loadProfile('aryanbhopale7@gmail.com')">
                                <div class="profile-header">
                                    <span class="profile-icon">🎮</span>
                                    <span class="profile-type">Gaming Enthusiast</span>
                                </div>
                                <div class="profile-email">aryanbhopale7@gmail.com</div>
                                <div class="profile-stats">7 breaches found</div>
                            </div>
                            
                            <div class="profile-card professional" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.loadProfile('ayushkumbhar1111@gmail.com')">
                                <div class="profile-header">
                                    <span class="profile-icon">💼</span>
                                    <span class="profile-type">Professional</span>
                                </div>
                                <div class="profile-email">ayushkumbhar1111@gmail.com</div>
                                <div class="profile-stats">8 breaches found</div>
                            </div>
                            
                            <div class="profile-card healthcare" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.loadProfile('pj28032006@gmail.com')">
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
                <p>Building attack surface map...</p>
            </div>
        `;

        try {
            const breaches = await this.fetchBreaches(email);
            if (breaches.length > 0) {
                this.createVisualization(email, breaches);
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

    createVisualization(email, breaches) {
        this.container.innerHTML = '';
        this.setupSVG();
        this.generateNodes(email, breaches);
        this.generateLinks();
        this.renderVisualization();
        this.addControls(email, breaches);
    }

    setupSVG() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('background', 'radial-gradient(circle, #f8f9fa 0%, #e9ecef 100%)');

        // Add arrow marker
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
    }

    generateNodes(email, breaches) {
        this.nodes = [];
        
        // Central email node
        this.nodes.push({
            id: 'center',
            label: email,
            type: 'email',
            x: this.width / 2,
            y: this.height / 2,
            fx: this.width / 2, // Fixed position
            fy: this.height / 2,
            icon: '📧',
            color: '#dc3545',
            size: 60,
            breaches: breaches.length
        });

        // Platform nodes with better positioning
        breaches.forEach((breach, i) => {
            const platform = this.getPlatformInfo(breach.website);
            const angle = (i / breaches.length) * 2 * Math.PI;
            const radius = Math.min(200, (Math.min(this.width, this.height) / 2) - 100);
            
            // Calculate initial position
            const x = this.width / 2 + Math.cos(angle) * radius;
            const y = this.height / 2 + Math.sin(angle) * radius;
            
            this.nodes.push({
                id: breach.website,
                label: this.formatLabel(breach.website),
                type: 'platform',
                x: x,
                y: y,
                // Set preferred position to reduce movement
                targetX: x,
                targetY: y,
                icon: platform.icon,
                color: platform.color,
                size: 45,
                risk: platform.risk,
                category: platform.category,
                breach: breach,
                date: breach.breach_date
            });
        });
    }

    generateLinks() {
        this.links = [];
        
        // Connect all platforms to center
        this.nodes.filter(n => n.type === 'platform').forEach(node => {
            this.links.push({
                source: 'center',
                target: node.id,
                type: 'breach-link'
            });
        });

        // Add some logical connections between platforms
        const platforms = this.nodes.filter(n => n.type === 'platform');
        const connections = {
            'gmail.com': ['linkedin.com', 'github.com', 'dropbox.com'],
            'linkedin.com': ['slack.com', 'office365.com'],
            'github.com': ['stackoverflow.com', 'slack.com'],
            'coinbase.com': ['binance.com'],
            'steam.com': ['discord.com', 'twitch.tv'],
            'facebook.com': ['instagram.com']
        };

        Object.entries(connections).forEach(([source, targets]) => {
            const sourceNode = platforms.find(p => p.id === source);
            if (sourceNode) {
                targets.forEach(target => {
                    const targetNode = platforms.find(p => p.id === target);
                    if (targetNode) {
                        this.links.push({
                            source: source,
                            target: target,
                            type: 'attack-path'
                        });
                    }
                });
            }
        });
    }

    renderVisualization() {
        // NO SIMULATION - Pure static positioning
        this.simulation = null;

        // Draw links
        const links = this.svg.selectAll('.link')
            .data(this.links)
            .enter().append('line')
            .attr('class', 'link')
            .attr('stroke', d => d.type === 'breach-link' ? '#dc3545' : '#fd7e14')
            .attr('stroke-width', d => d.type === 'breach-link' ? 3 : 2)
            .attr('stroke-dasharray', d => d.type === 'attack-path' ? '5,5' : 'none')
            .attr('marker-end', d => d.type === 'attack-path' ? 'url(#arrowhead)' : 'none')
            .attr('opacity', d => d.type === 'breach-link' ? 0.8 : 0.5);

        // Draw nodes
        const nodeGroups = this.svg.selectAll('.node')
            .data(this.nodes)
            .enter().append('g')
            .attr('class', 'node')
            .style('cursor', d => d.type === 'email' ? 'default' : 'move')
            .call(d3.drag()
                .on('start', this.dragStarted.bind(this))
                .on('drag', this.dragged.bind(this))
                .on('end', this.dragEnded.bind(this))
                .filter((event, d) => d.type !== 'email')); // Prevent dragging center node

        // Node circles
        nodeGroups.append('circle')
            .attr('r', d => d.size/2)
            .attr('fill', d => d.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .style('filter', d => d.type === 'email' ? 'drop-shadow(0 0 10px rgba(220,53,69,0.5))' : 'none');

        // Node icons
        nodeGroups.append('text')
            .text(d => d.icon)
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('font-size', d => d.type === 'email' ? '24px' : '18px')
            .style('pointer-events', 'none');

        // Node labels
        nodeGroups.append('text')
            .text(d => d.label)
            .attr('text-anchor', 'middle')
            .attr('dy', d => d.size/2 + 15)
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('fill', '#2c3e50')
            .style('pointer-events', 'none');

        // Risk indicators
        nodeGroups.filter(d => d.type === 'platform' && d.risk === 'critical')
            .append('circle')
            .attr('r', 6)
            .attr('cx', 20)
            .attr('cy', -20)
            .attr('fill', '#dc3545')
            .append('title')
            .text('Critical Risk');

        // Tooltips
        nodeGroups.on('mouseover', this.showTooltip.bind(this))
                  .on('mouseout', this.hideTooltip.bind(this));

        // Static positioning - no simulation
        this.updateStaticPositions(links, nodeGroups);
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
                    <button onclick="window.attackSurfaceMap.showStartScreen()" class="btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button onclick="window.attackSurfaceMap.exportData()" class="btn-primary">
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
                <button onclick="window.attackSurfaceMap.showStartScreen()" class="btn-primary">
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
                <button onclick="window.attackSurfaceMap.showStartScreen()" class="btn-primary">
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
            links: this.links,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attack-surface-${this.currentEmail}-${Date.now()}.json`;
        a.click();
    }

    // Static positioning function
    updateStaticPositions(links, nodeGroups) {
        // Position links immediately
        links.each((d, i) => {
            const sourceNode = this.nodes.find(n => n.id === d.source);
            const targetNode = this.nodes.find(n => n.id === d.target);
            if (sourceNode && targetNode) {
                d3.select(links.nodes()[i])
                    .attr('x1', sourceNode.x)
                    .attr('y1', sourceNode.y)
                    .attr('x2', targetNode.x)
                    .attr('y2', targetNode.y);
            }
        });
        
        // Position nodes immediately
        nodeGroups.attr('transform', d => `translate(${d.x},${d.y})`);
        
        // Store references for drag updates
        this.linksSelection = links;
        this.nodeGroupsSelection = nodeGroups;
    }
    
    // Update single node position and related links
    updateNodePosition(draggedNode) {
        // Update the dragged node position
        this.nodeGroupsSelection
            .filter(d => d.id === draggedNode.id)
            .attr('transform', `translate(${draggedNode.x},${draggedNode.y})`);
        
        // Update all links connected to this node
        this.linksSelection.each((linkData, i) => {
            const sourceNode = this.nodes.find(n => n.id === linkData.source);
            const targetNode = this.nodes.find(n => n.id === linkData.target);
            
            if ((sourceNode && sourceNode.id === draggedNode.id) || 
                (targetNode && targetNode.id === draggedNode.id)) {
                d3.select(this.linksSelection.nodes()[i])
                    .attr('x1', sourceNode.x)
                    .attr('y1', sourceNode.y)
                    .attr('x2', targetNode.x)
                    .attr('y2', targetNode.y);
            }
        });
    }

    // Drag handlers - more controlled
    dragStarted(event, d) {
        // Don't restart simulation on drag to prevent chaos
        if (d.type !== 'email') {
            d.fx = d.x;
            d.fy = d.y;
        }
    }

    dragged(event, d) {
        if (d.type !== 'email') {
            // Only allow dragging within reasonable bounds
            const margin = 50;
            const minX = margin;
            const maxX = this.width - margin;
            const minY = margin + 80; // Account for controls
            const maxY = this.height - margin;
            
            d.fx = Math.max(minX, Math.min(maxX, event.x));
            d.fy = Math.max(minY, Math.min(maxY, event.y));
            
            // Update position immediately without simulation
            d.x = d.fx;
            d.y = d.fy;
            
            // Update visual positions immediately
            this.updateNodePosition(d);
        }
    }

    dragEnded(event, d) {
        // Keep the node fixed at its new position
        if (d.type !== 'email') {
            // Don't release the position - keep it fixed
            // d.fx = null;
            // d.fy = null;
        }
    }
}

// Global functions
window.loadProfile = function(email) {
    if (window.attackSurfaceMap) {
        window.attackSurfaceMap.loadProfile(email);
    }
};

window.loadSampleProfile = function() {
    window.loadProfile('ayushkumbhar1111@gmail.com');
};

// Initialize
window.OptimizedAttackSurfaceMap = OptimizedAttackSurfaceMap;
