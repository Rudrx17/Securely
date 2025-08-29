// Enhanced Dynamic Attack Surface Map
class DynamicAttackSurfaceMap {
    constructor() {
        this.svg = null;
        this.nodes = [];
        this.links = [];
        this.simulation = null;
        this.container = document.getElementById('attack-surface-map');
        this.currentEmail = null;
        this.platformCategories = this.definePlatformCategories();
        this.init();
    }

    init() {
        this.setupSVG();
        this.loadDefaultState();
    }

    definePlatformCategories() {
        return {
            'social': {
                platforms: ['facebook.com', 'instagram.com', 'twitter.com', 'snapchat.com'],
                icon: '👥',
                color: '#3b5998',
                category: 'Social Media',
                riskLevel: 'medium'
            },
            'professional': {
                platforms: ['linkedin.com', 'slack.com', 'office365.com', 'zoom.com', 'teams.microsoft.com'],
                icon: '💼',
                color: '#0077b5',
                category: 'Professional',
                riskLevel: 'high'
            },
            'development': {
                platforms: ['github.com', 'gitlab.com', 'stackoverflow.com', 'npm.js', 'bitbucket.org'],
                icon: '💻',
                color: '#333333',
                category: 'Development',
                riskLevel: 'high'
            },
            'financial': {
                platforms: ['coinbase.com', 'binance.com', 'paypal.com', 'robinhood.com', 'wells.com'],
                icon: '💰',
                color: '#ff9500',
                category: 'Financial',
                riskLevel: 'critical'
            },
            'gaming': {
                platforms: ['steam.com', 'epic.games', 'playstation.com', 'xbox.com', 'discord.com', 'twitch.tv'],
                icon: '🎮',
                color: '#7289da',
                category: 'Gaming',
                riskLevel: 'low'
            },
            'cloud': {
                platforms: ['dropbox.com', 'google.com', 'gmail.com', 'onedrive.com', 'icloud.com'],
                icon: '☁️',
                color: '#4285f4',
                category: 'Cloud Storage',
                riskLevel: 'high'
            },
            'entertainment': {
                platforms: ['netflix.com', 'spotify.com', 'youtube.com', 'hulu.com', 'amazon.com'],
                icon: '🎬',
                color: '#e50914',
                category: 'Entertainment',
                riskLevel: 'low'
            },
            'healthcare': {
                platforms: ['anthem.com', 'wellsfargo.com', 'healthgrades.com', 'webmd.com'],
                icon: '🏥',
                color: '#dc143c',
                category: 'Healthcare',
                riskLevel: 'critical'
            }
        };
    }

    setupSVG() {
        this.container.innerHTML = '';
        
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 600;
        
        this.svg = d3.select('#attack-surface-map')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', 'transparent');
        
        // Add arrow markers for different risk levels
        const defs = this.svg.append('defs');
        
        ['low', 'medium', 'high', 'critical'].forEach(level => {
            const colors = {
                'low': '#28a745',
                'medium': '#ffc107', 
                'high': '#fd7e14',
                'critical': '#dc3545'
            };
            
            defs.append('marker')
                .attr('id', `arrowhead-${level}`)
                .attr('viewBox', '-0 -5 10 10')
                .attr('refX', 13)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 13)
                .attr('markerHeight', 13)
                .append('path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', colors[level]);
        });
    }

    loadDefaultState() {
        this.container.innerHTML = `
            <div class="map-placeholder">
                <i class="fas fa-project-diagram"></i>
                <h3>Dynamic Attack Surface Mapping</h3>
                <p>Enter an email in the AI Threat Engine to see personalized attack surface visualization</p>
                <div class="sample-emails" style="margin-top: 2rem;">
                    <h4>Try these sample emails:</h4>
                    <div style="display: grid; gap: 1rem; margin-top: 1rem;">
                        <button onclick="loadEmailProfile('aryanbhopale7@gmail.com')" class="sample-email-btn">
                            🎮 aryanbhopale7@gmail.com <span>(Gaming enthusiast)</span>
                        </button>
                        <button onclick="loadEmailProfile('ayushkumbhar1111@gmail.com')" class="sample-email-btn">
                            💼 ayushkumbhar1111@gmail.com <span>(Professional developer)</span>
                        </button>
                        <button onclick="loadEmailProfile('pj28032006@gmail.com')" class="sample-email-btn">
                            🏥 pj28032006@gmail.com <span>(Healthcare professional)</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async loadEmailProfile(email) {
        this.currentEmail = email;
        
        // Show loading state
        this.container.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <h3>Analyzing Attack Surface for ${email}</h3>
                <p>Generating dynamic network visualization...</p>
            </div>
        `;
        
        try {
            // Fetch breach data for this email
            const breachData = await this.fetchBreachData(email);
            
            if (breachData.length === 0) {
                this.showNoBreachesFound(email);
                return;
            }
            
            // Generate dynamic nodes and attack paths
            this.generateDynamicNodes(breachData);
            this.generateIntelligentAttackPaths(breachData);
            
            // Setup SVG for dynamic content
            this.setupSVG();
            this.renderDynamicMap();
            
            // Show profile summary
            this.showProfileSummary(email, breachData);
            
        } catch (error) {
            this.showError(`Failed to load profile: ${error.message}`);
        }
    }

    async fetchBreachData(email) {
        try {
            const response = await fetch('../backend/breach_checker.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });
            
            const data = await response.json();
            return data.breaches || [];
        } catch (error) {
            console.error('Failed to fetch breach data:', error);
            return [];
        }
    }

    generateDynamicNodes(breachData) {
        this.nodes = [];
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 600;
        
        // Create central email node
        this.nodes.push({
            id: 'email-center',
            label: 'Email Account',
            type: 'email',
            category: 'core',
            x: width / 2,
            y: height / 2,
            icon: '📧',
            color: '#dc3545',
            riskLevel: 'critical',
            breached: true,
            breachCount: breachData.length
        });

        // Generate nodes for each breached platform
        breachData.forEach((breach, index) => {
            const platform = this.categorizePlatform(breach.website);
            const angle = (index / breachData.length) * 2 * Math.PI;
            const radius = 180;
            
            const node = {
                id: breach.website,
                label: this.formatPlatformName(breach.website),
                type: 'platform',
                category: platform.category,
                x: width / 2 + Math.cos(angle) * radius,
                y: height / 2 + Math.sin(angle) * radius,
                icon: platform.icon,
                color: platform.color,
                riskLevel: platform.riskLevel,
                breached: true,
                breachInfo: breach,
                breachDate: breach.breach_date,
                dataTypes: breach.data_types ? breach.data_types.split(',') : []
            };
            
            this.nodes.push(node);
        });

        // Add potential secondary attack targets (not yet breached)
        this.addPotentialTargets(breachData);
    }

    categorizePlatform(website) {
        for (const [category, info] of Object.entries(this.platformCategories)) {
            if (info.platforms.some(platform => website.includes(platform.replace('.com', '')))) {
                return info;
            }
        }
        
        // Default categorization for unknown platforms
        return {
            icon: '🌐',
            color: '#6c757d',
            category: 'Other',
            riskLevel: 'medium'
        };
    }

    addPotentialTargets(breachData) {
        const breachedWebsites = breachData.map(b => b.website);
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 600;
        
        // Add high-risk targets that aren't breached yet
        const potentialTargets = [
            { website: 'banking.com', category: 'financial', priority: 'high' },
            { website: 'corporate-vpn.com', category: 'professional', priority: 'high' },
            { website: 'password-manager.com', category: 'security', priority: 'critical' }
        ];
        
        potentialTargets.forEach((target, index) => {
            if (!breachedWebsites.includes(target.website)) {
                const platform = this.categorizePlatform(target.website);
                const angle = ((breachData.length + index) / (breachData.length + potentialTargets.length)) * 2 * Math.PI;
                const radius = 120;
                
                this.nodes.push({
                    id: target.website,
                    label: this.formatPlatformName(target.website),
                    type: 'potential-target',
                    category: platform.category,
                    x: width / 2 + Math.cos(angle) * radius,
                    y: height / 2 + Math.sin(angle) * radius,
                    icon: platform.icon,
                    color: platform.color,
                    riskLevel: target.priority,
                    breached: false,
                    potential: true
                });
            }
        });
    }

    generateIntelligentAttackPaths(breachData) {
        this.links = [];
        
        // Define intelligent attack progression rules
        const attackLogic = {
            'gmail.com': ['linkedin.com', 'github.com', 'dropbox.com', 'netflix.com'],
            'linkedin.com': ['slack.com', 'office365.com', 'github.com', 'zoom.com'],
            'github.com': ['slack.com', 'stackoverflow.com', 'gitlab.com'],
            'slack.com': ['office365.com', 'zoom.com', 'dropbox.com'],
            'coinbase.com': ['binance.com', 'gmail.com', 'paypal.com'],
            'binance.com': ['coinbase.com', 'gmail.com'],
            'facebook.com': ['instagram.com', 'gmail.com', 'netflix.com'],
            'epic.games': ['steam.com', 'discord.com', 'twitch.tv'],
            'steam.com': ['discord.com', 'twitch.tv', 'paypal.com'],
            'discord.com': ['twitch.tv', 'github.com', 'spotify.com'],
            'anthem.com': ['office365.com', 'zoom.com', 'linkedin.com'],
            'office365.com': ['linkedin.com', 'teams.microsoft.com', 'onedrive.com']
        };
        
        // Generate paths from breached platforms to email center
        this.nodes.filter(n => n.type === 'platform' && n.breached).forEach(sourceNode => {
            this.links.push({
                source: sourceNode.id,
                target: 'email-center',
                type: 'compromise-path',
                riskLevel: sourceNode.riskLevel,
                description: `${sourceNode.label} breach compromises email security`
            });
        });

        // Generate lateral movement paths between platforms
        breachData.forEach(breach => {
            const website = breach.website;
            if (attackLogic[website]) {
                attackLogic[website].forEach(targetWebsite => {
                    const targetNode = this.nodes.find(n => n.id === targetWebsite);
                    if (targetNode) {
                        this.links.push({
                            source: website,
                            target: targetWebsite,
                            type: 'lateral-movement',
                            riskLevel: this.calculatePathRisk(breach, targetNode),
                            description: `Credential reuse attack path`
                        });
                    }
                });
            }
        });

        // Generate paths to potential future targets
        this.nodes.filter(n => n.potential).forEach(potentialNode => {
            const breachedPlatforms = this.nodes.filter(n => n.breached && n.type === 'platform');
            const relevantBreach = breachedPlatforms.find(b => 
                this.isCategoryRelated(b.category, potentialNode.category)
            );
            
            if (relevantBreach) {
                this.links.push({
                    source: relevantBreach.id,
                    target: potentialNode.id,
                    type: 'potential-attack',
                    riskLevel: potentialNode.riskLevel,
                    description: `Potential future attack vector`
                });
            }
        });
    }

    calculatePathRisk(sourceBreach, targetNode) {
        const riskMapping = {
            'critical': 4,
            'high': 3,
            'medium': 2,
            'low': 1
        };
        
        const sourceRisk = this.categorizePlatform(sourceBreach.website).riskLevel;
        const avgRisk = (riskMapping[sourceRisk] + riskMapping[targetNode.riskLevel]) / 2;
        
        if (avgRisk >= 3.5) return 'critical';
        if (avgRisk >= 2.5) return 'high';
        if (avgRisk >= 1.5) return 'medium';
        return 'low';
    }

    isCategoryRelated(category1, category2) {
        const relatedCategories = {
            'Professional': ['Cloud Storage', 'Development'],
            'Financial': ['Professional', 'Cloud Storage'],
            'Development': ['Professional', 'Cloud Storage'],
            'Gaming': ['Social Media', 'Entertainment']
        };
        
        return relatedCategories[category1]?.includes(category2) || 
               relatedCategories[category2]?.includes(category1);
    }

    formatPlatformName(website) {
        return website
            .replace('.com', '')
            .replace('.org', '')
            .replace('.net', '')
            .split('.')[0]
            .split('-')[0]
            .charAt(0).toUpperCase() + 
            website.split('.')[0].slice(1);
    }

    renderDynamicMap() {
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 600;
        
        // Clear previous content
        this.svg.selectAll('*').remove();
        
        // Re-add definitions
        this.setupSVG();
        
        // Create force simulation with enhanced physics
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(d => {
                if (d.type === 'compromise-path') return 80;
                if (d.type === 'lateral-movement') return 120;
                if (d.type === 'potential-attack') return 100;
                return 100;
            }))
            .force('charge', d3.forceManyBody().strength(d => d.type === 'email' ? -800 : -400))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(50));

        // Render attack path links
        const link = this.svg.append('g')
            .selectAll('line')
            .data(this.links)
            .enter().append('line')
            .attr('stroke', d => {
                const colors = {
                    'low': '#28a745',
                    'medium': '#ffc107',
                    'high': '#fd7e14', 
                    'critical': '#dc3545'
                };
                return colors[d.riskLevel] || '#6c757d';
            })
            .attr('stroke-width', d => {
                const widths = {
                    'compromise-path': 4,
                    'lateral-movement': 3,
                    'potential-attack': 2
                };
                return widths[d.type] || 2;
            })
            .attr('stroke-dasharray', d => d.type === 'potential-attack' ? '5,5' : 'none')
            .attr('marker-end', d => `url(#arrowhead-${d.riskLevel})`)
            .style('opacity', 0)
            .transition()
            .delay((d, i) => i * 200)
            .duration(1000)
            .style('opacity', d => d.type === 'potential-attack' ? 0.5 : 0.8);

        // Render nodes with enhanced styling
        const node = this.svg.append('g')
            .selectAll('g')
            .data(this.nodes)
            .enter().append('g')
            .attr('class', 'attack-node')
            .call(d3.drag()
                .on('start', this.dragstarted.bind(this))
                .on('drag', this.dragged.bind(this))
                .on('end', this.dragended.bind(this)));

        // Add node circles
        node.append('circle')
            .attr('r', d => {
                if (d.type === 'email') return 50;
                if (d.breached) return 35;
                return 25;
            })
            .attr('fill', d => {
                if (d.type === 'email') return '#dc3545';
                if (d.breached) return d.color;
                return '#f8f9fa';
            })
            .attr('stroke', d => d.breached ? '#fff' : d.color)
            .attr('stroke-width', d => d.breached ? 4 : 2)
            .style('filter', d => {
                if (d.type === 'email') return 'drop-shadow(0 0 15px rgba(220, 53, 69, 0.8))';
                if (d.breached) return `drop-shadow(0 0 10px ${d.color}40)`;
                return 'none';
            })
            .on('mouseover', this.showEnhancedTooltip.bind(this))
            .on('mouseout', this.hideTooltip.bind(this))
            .on('click', this.showNodeDetails.bind(this));

        // Add icons
        node.append('text')
            .text(d => d.icon)
            .attr('text-anchor', 'middle')
            .attr('dy', 8)
            .style('font-size', d => d.type === 'email' ? '24px' : '18px')
            .style('pointer-events', 'none');

        // Add labels
        node.append('text')
            .text(d => d.label)
            .attr('text-anchor', 'middle')
            .attr('dy', d => d.type === 'email' ? 70 : 50)
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('fill', '#2c3e50')
            .style('pointer-events', 'none');

        // Add breach indicators
        node.filter(d => d.breached && d.type !== 'email')
            .append('circle')
            .attr('r', 8)
            .attr('cx', 25)
            .attr('cy', -25)
            .attr('fill', '#dc3545')
            .style('opacity', 0)
            .transition()
            .delay(1000)
            .duration(500)
            .style('opacity', 1);

        node.filter(d => d.breached && d.type !== 'email')
            .append('text')
            .text('!')
            .attr('x', 25)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .style('font-weight', 'bold')
            .style('fill', 'white')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .transition()
            .delay(1000)
            .duration(500)
            .style('opacity', 1);

        // Update positions on tick
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });
    }

    showEnhancedTooltip(event, d) {
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'enhanced-node-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.95)')
            .style('color', 'white')
            .style('padding', '15px')
            .style('border-radius', '10px')
            .style('font-size', '12px')
            .style('max-width', '300px')
            .style('pointer-events', 'none')
            .style('z-index', '1000')
            .style('box-shadow', '0 4px 20px rgba(0,0,0,0.3)');
        
        let content = `<div style="margin-bottom: 10px;"><strong>${d.icon} ${d.label}</strong></div>`;
        
        if (d.type === 'email') {
            content += `<div style="color: #dc3545;">🚨 <strong>EMAIL COMPROMISED</strong></div>`;
            content += `<div>Total Breaches: ${d.breachCount}</div>`;
            content += `<div style="margin-top: 8px; font-size: 10px; opacity: 0.8;">Click to see detailed analysis</div>`;
        } else if (d.breached) {
            content += `<div style="color: #dc3545;">🔴 BREACHED</div>`;
            content += `<div>Date: ${d.breachDate}</div>`;
            content += `<div>Risk Level: ${d.riskLevel.toUpperCase()}</div>`;
            if (d.dataTypes && d.dataTypes.length > 0) {
                content += `<div style="margin-top: 8px;">Exposed Data:</div>`;
                content += `<div style="font-size: 10px;">${d.dataTypes.slice(0, 3).join(', ')}${d.dataTypes.length > 3 ? '...' : ''}</div>`;
            }
        } else if (d.potential) {
            content += `<div style="color: #ffc107;">⚠️ POTENTIAL TARGET</div>`;
            content += `<div>Risk Level: ${d.riskLevel.toUpperCase()}</div>`;
            content += `<div style="font-size: 10px; opacity: 0.8;">Not yet compromised</div>`;
        }
        
        tooltip.html(content)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 15) + 'px')
            .transition()
            .duration(200)
            .style('opacity', 1);
    }

    hideTooltip() {
        d3.selectAll('.enhanced-node-tooltip').remove();
    }

    showNodeDetails(event, d) {
        // Could implement a detailed modal here
        console.log('Node details for:', d.label, d);
    }

    showProfileSummary(email, breachData) {
        // Add profile summary overlay
        const summary = document.createElement('div');
        summary.className = 'profile-summary';
        summary.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.95);
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            max-width: 300px;
            z-index: 100;
        `;
        
        const riskCounts = this.calculateRiskDistribution(breachData);
        const totalRiskScore = this.calculateTotalRiskScore(breachData);
        
        summary.innerHTML = `
            <h4 style="margin: 0 0 1rem 0; color: #2c3e50;">
                <i class="fas fa-user-shield"></i>
                Attack Surface Analysis
            </h4>
            <div style="margin-bottom: 1rem;">
                <strong>Email:</strong> ${email}<br>
                <strong>Total Breaches:</strong> ${breachData.length}<br>
                <strong>Risk Score:</strong> <span style="color: ${totalRiskScore >= 70 ? '#dc3545' : totalRiskScore >= 40 ? '#ffc107' : '#28a745'}">${totalRiskScore}/100</span>
            </div>
            <div style="font-size: 0.9rem;">
                <div>🔴 Critical: ${riskCounts.critical}</div>
                <div>🟠 High: ${riskCounts.high}</div>
                <div>🟡 Medium: ${riskCounts.medium}</div>
                <div>🟢 Low: ${riskCounts.low}</div>
            </div>
        `;
        
        this.container.style.position = 'relative';
        this.container.appendChild(summary);
    }

    calculateRiskDistribution(breachData) {
        const counts = { critical: 0, high: 0, medium: 0, low: 0 };
        
        breachData.forEach(breach => {
            const platform = this.categorizePlatform(breach.website);
            counts[platform.riskLevel]++;
        });
        
        return counts;
    }

    calculateTotalRiskScore(breachData) {
        const riskValues = { critical: 25, high: 15, medium: 8, low: 3 };
        let totalScore = 0;
        
        breachData.forEach(breach => {
            const platform = this.categorizePlatform(breach.website);
            totalScore += riskValues[platform.riskLevel] || 5;
        });
        
        return Math.min(totalScore, 100);
    }

    showNoBreachesFound(email) {
        this.container.innerHTML = `
            <div class="no-breaches-state">
                <i class="fas fa-shield-alt" style="font-size: 4rem; color: #28a745; margin-bottom: 1rem;"></i>
                <h3>No Breaches Found</h3>
                <p>Great news! ${email} wasn't found in any known data breaches.</p>
                <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.7;">
                    This means your attack surface is minimal for this email address.
                </p>
                <button onclick="window.attackSurfaceMap.loadDefaultState()" style="margin-top: 2rem; padding: 0.8rem 1.5rem; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-arrow-left"></i>
                    Try Another Email
                </button>
            </div>
        `;
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ffc107; margin-bottom: 1rem;"></i>
                <h3>Analysis Error</h3>
                <p>${message}</p>
                <button onclick="window.attackSurfaceMap.loadDefaultState()" style="margin-top: 2rem; padding: 0.8rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-redo"></i>
                    Try Again
                </button>
            </div>
        `;
    }

    // Drag handlers
    dragstarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    dragended(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

// Global functions for the page
function loadEmailProfile(email) {
    if (window.dynamicAttackSurfaceMap) {
        window.dynamicAttackSurfaceMap.loadEmailProfile(email);
    }
}

function loadSampleProfile() {
    // Default to one of the rich profiles
    loadEmailProfile('ayushkumbhar1111@gmail.com');
}

// Export for global use
window.DynamicAttackSurfaceMap = DynamicAttackSurfaceMap;
