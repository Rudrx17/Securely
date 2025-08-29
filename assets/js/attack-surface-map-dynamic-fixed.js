// Enhanced Dynamic Attack Surface Map - FIXED VERSION
// This version eliminates random node movement while keeping the beautiful dynamic visuals
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
        // Auto-load a sample profile immediately like before
        this.loadSampleDataDirectly();
    }

    // Load sample data directly without backend dependency
    loadSampleDataDirectly() {
        const sampleEmail = 'aryanbhopale7@gmail.com';
        const sampleBreaches = [
            {
                website: 'steam.com',
                breach_date: '2023-02-15',
                data_types: 'emails,passwords,usernames',
                attack_vector: 'credential_stuffing'
            },
            {
                website: 'discord.com',
                breach_date: '2023-01-20',
                data_types: 'emails,passwords,phone_numbers',
                attack_vector: 'data_breach'
            },
            {
                website: 'epic.games',
                breach_date: '2022-11-10',
                data_types: 'emails,passwords,payment_info',
                attack_vector: 'sql_injection'
            },
            {
                website: 'twitch.tv',
                breach_date: '2023-03-05',
                data_types: 'emails,usernames,passwords',
                attack_vector: 'phishing'
            },
            {
                website: 'spotify.com',
                breach_date: '2022-12-18',
                data_types: 'emails,passwords',
                attack_vector: 'credential_stuffing'
            },
            {
                website: 'netflix.com',
                breach_date: '2023-01-08',
                data_types: 'emails,passwords,payment_info',
                attack_vector: 'account_takeover'
            },
            {
                website: 'gmail.com',
                breach_date: '2022-10-22',
                data_types: 'emails,passwords,personal_info',
                attack_vector: 'phishing'
            }
        ];

        this.currentEmail = sampleEmail;
        
        // Show loading state briefly for visual feedback
        this.container.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <h3>Analyzing Attack Surface for ${sampleEmail}</h3>
                <p>Generating dynamic network visualization...</p>
            </div>
        `;
        
        // Load after short delay for better UX
        setTimeout(() => {
            this.generateFixedNodes(sampleBreaches);
            this.generateIntelligentAttackPaths(sampleBreaches);
            this.setupSVG();
            this.renderFixedMap();
            this.showProfileSummary(sampleEmail, sampleBreaches);
        }, 800);
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
                <p>Click "Load Sample Profile" to see personalized attack surface visualization</p>
                <div class="sample-emails" style="margin-top: 2rem;">
                    <h4>Available sample profiles:</h4>
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
            
            // Generate FIXED nodes with static positions
            this.generateFixedNodes(breachData);
            this.generateIntelligentAttackPaths(breachData);
            
            // Setup SVG for dynamic content
            this.setupSVG();
            this.renderFixedMap(); // Use FIXED rendering instead of dynamic
            
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

    // FIXED VERSION - Static positioning instead of force simulation
    generateFixedNodes(breachData) {
        this.nodes = [];
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 600;
        
        // Create central email node - FIXED position
        this.nodes.push({
            id: 'email-center',
            label: 'Email Account',
            type: 'email',
            category: 'core',
            x: width / 2,
            y: height / 2,
            fx: width / 2, // FIXED X position - prevents movement
            fy: height / 2, // FIXED Y position - prevents movement
            icon: '📧',
            color: '#dc3545',
            riskLevel: 'critical',
            breached: true,
            breachCount: breachData.length
        });

        // Generate nodes for each breached platform - FIXED positions
        breachData.forEach((breach, index) => {
            const platform = this.categorizePlatform(breach.website);
            const angle = (index / breachData.length) * 2 * Math.PI;
            const radius = 180;
            
            const x = width / 2 + Math.cos(angle) * radius;
            const y = height / 2 + Math.sin(angle) * radius;
            
            const node = {
                id: breach.website,
                label: this.formatPlatformName(breach.website),
                type: 'platform',
                category: platform.category,
                x: x,
                y: y,
                fx: x, // FIXED X position - prevents movement
                fy: y, // FIXED Y position - prevents movement
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

        // Add potential secondary attack targets - FIXED positions
        this.addPotentialTargetsFixed(breachData, width, height);
    }

    addPotentialTargetsFixed(breachData, width, height) {
        const breachedWebsites = breachData.map(b => b.website);
        
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
                
                const x = width / 2 + Math.cos(angle) * radius;
                const y = height / 2 + Math.sin(angle) * radius;
                
                this.nodes.push({
                    id: target.website,
                    label: this.formatPlatformName(target.website),
                    type: 'potential-target',
                    category: platform.category,
                    x: x,
                    y: y,
                    fx: x, // FIXED X position - prevents movement
                    fy: y, // FIXED Y position - prevents movement
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

    // FIXED RENDERING - No force simulation, no random movement
    renderFixedMap() {
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 600;

        // Create links with FIXED positions
        const linkGroup = this.svg.append('g').attr('class', 'links');
        
        const links = linkGroup.selectAll('line')
            .data(this.links)
            .enter()
            .append('line')
            .attr('class', d => `link ${d.type}`)
            .attr('stroke', d => this.getLinkColor(d.riskLevel))
            .attr('stroke-width', d => d.type === 'compromise-path' ? 3 : 2)
            .attr('stroke-opacity', 0.8)
            .attr('marker-end', d => `url(#arrowhead-${d.riskLevel})`)
            .attr('stroke-dasharray', d => d.type === 'potential-attack' ? '5,5' : null);

        // Create nodes with FIXED positions
        const nodeGroup = this.svg.append('g').attr('class', 'nodes');
        
        const nodes = nodeGroup.selectAll('g')
            .data(this.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`) // FIXED positions
            .style('cursor', 'pointer');

        // Add node circles
        nodes.append('circle')
            .attr('r', d => d.type === 'email' ? 35 : 25)
            .attr('fill', d => d.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .attr('opacity', d => d.breached ? 1 : 0.6);

        // Add node icons
        nodes.append('text')
            .text(d => d.icon)
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('font-size', d => d.type === 'email' ? '20px' : '16px')
            .style('pointer-events', 'none');

        // Add node labels
        nodes.append('text')
            .text(d => d.label)
            .attr('text-anchor', 'middle')
            .attr('dy', '3em')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .style('pointer-events', 'none');

        // Update link positions based on FIXED node positions
        links.attr('x1', d => {
                const sourceNode = this.nodes.find(n => n.id === d.source);
                return sourceNode ? sourceNode.x : 0;
            })
            .attr('y1', d => {
                const sourceNode = this.nodes.find(n => n.id === d.source);
                return sourceNode ? sourceNode.y : 0;
            })
            .attr('x2', d => {
                const targetNode = this.nodes.find(n => n.id === d.target);
                return targetNode ? targetNode.x : 0;
            })
            .attr('y2', d => {
                const targetNode = this.nodes.find(n => n.id === d.target);
                return targetNode ? targetNode.y : 0;
            });

        // Add hover effects (NO MOVEMENT, just visual feedback)
        nodes
            .on('mouseenter', function(event, d) {
                d3.select(this)
                    .select('circle')
                    .transition()
                    .duration(200)
                    .attr('r', d.type === 'email' ? 40 : 30);
                
                // Show tooltip
                const tooltip = d3.select('body')
                    .append('div')
                    .attr('class', 'node-tooltip')
                    .style('opacity', 0)
                    .style('position', 'absolute')
                    .style('background', 'rgba(0,0,0,0.8)')
                    .style('color', 'white')
                    .style('padding', '8px')
                    .style('border-radius', '4px')
                    .style('font-size', '12px')
                    .style('pointer-events', 'none')
                    .style('z-index', '1000');

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);

                tooltip.html(`
                    <strong>${d.label}</strong><br/>
                    Category: ${d.category}<br/>
                    Risk: ${d.riskLevel.toUpperCase()}<br/>
                    Status: ${d.breached ? 'BREACHED' : 'Secure'}
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseleave', function(event, d) {
                d3.select(this)
                    .select('circle')
                    .transition()
                    .duration(200)
                    .attr('r', d.type === 'email' ? 35 : 25);
                
                // Remove tooltip
                d3.selectAll('.node-tooltip').remove();
            });

        // Add CONTROLLED drag functionality - move only when dragging
        const drag = d3.drag()
            .on('start', function(event, d) {
                // Visual feedback when drag starts
                d3.select(this)
                    .select('circle')
                    .transition()
                    .duration(200)
                    .attr('stroke-width', 5)
                    .attr('opacity', 0.8);
                
                console.log('Started dragging:', d.label);
            })
            .on('drag', function(event, d) {
                // Update node position ONLY during drag
                d.x = event.x;
                d.y = event.y;
                d.fx = event.x; // Update fixed position
                d.fy = event.y; // Update fixed position
                
                // Move the node visually
                d3.select(this)
                    .attr('transform', `translate(${d.x}, ${d.y})`);
                
                // Update connected links
                linkGroup.selectAll('line')
                    .filter(link => link.source === d.id || link.target === d.id)
                    .attr('x1', link => {
                        const sourceNode = this.nodes.find(n => n.id === link.source);
                        return sourceNode ? sourceNode.x : 0;
                    }.bind(this))
                    .attr('y1', link => {
                        const sourceNode = this.nodes.find(n => n.id === link.source);
                        return sourceNode ? sourceNode.y : 0;
                    }.bind(this))
                    .attr('x2', link => {
                        const targetNode = this.nodes.find(n => n.id === link.target);
                        return targetNode ? targetNode.x : 0;
                    }.bind(this))
                    .attr('y2', link => {
                        const targetNode = this.nodes.find(n => n.id === link.target);
                        return targetNode ? targetNode.y : 0;
                    }.bind(this));
            }.bind(this))
            .on('end', function(event, d) {
                // Visual feedback when drag ends
                d3.select(this)
                    .select('circle')
                    .transition()
                    .duration(200)
                    .attr('stroke-width', 3)
                    .attr('opacity', d.breached ? 1 : 0.6);
                
                console.log('Finished dragging:', d.label, 'to position:', d.x, d.y);
            });
        
        // Apply drag behavior to nodes
        nodes.call(drag);
        
        // Add click handlers for non-drag clicks
        nodes.on('click', function(event, d) {
            // Only trigger if this wasn't a drag event
            if (event.defaultPrevented) return;
            
            // Visual feedback only - pulse effect
            d3.select(this)
                .select('circle')
                .transition()
                .duration(300)
                .attr('stroke-width', 6)
                .transition()
                .duration(300)
                .attr('stroke-width', 3);
                
            console.log('Node clicked:', d.label);
        });
    }

    getLinkColor(riskLevel) {
        const colors = {
            'low': '#28a745',
            'medium': '#ffc107',
            'high': '#fd7e14',
            'critical': '#dc3545'
        };
        return colors[riskLevel] || '#6c757d';
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

    showNoBreachesFound(email) {
        this.container.innerHTML = `
            <div class="no-breaches-state">
                <i class="fas fa-shield-check" style="font-size: 4rem; color: #28a745; margin-bottom: 1rem;"></i>
                <h3>No Breaches Found! 🎉</h3>
                <p><strong>${email}</strong> wasn't found in any known data breaches.</p>
                <button onclick="window.attackSurfaceMap.loadDefaultState()" class="btn btn-primary">
                    Try Another Email
                </button>
            </div>
        `;
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #dc3545; margin-bottom: 1rem;"></i>
                <h3>Error Loading Profile</h3>
                <p>${message}</p>
                <button onclick="window.attackSurfaceMap.loadDefaultState()" class="btn btn-secondary">
                    Go Back
                </button>
            </div>
        `;
    }

    showProfileSummary(email, breaches) {
        const riskScore = this.calculateRiskScore(breaches);
        const categories = this.getUniqueCategories(breaches);
        
        const summaryHtml = `
            <div class="profile-summary" style="margin-top: 20px; padding: 15px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h4><i class="fas fa-user-shield"></i> Attack Surface Summary for ${email}</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 10px;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #dc3545;">${breaches.length}</div>
                        <div style="font-size: 0.8rem; color: #666;">Total Breaches</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #fd7e14;">${riskScore}</div>
                        <div style="font-size: 0.8rem; color: #666;">Risk Score</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #007bff;">${categories.length}</div>
                        <div style="font-size: 0.8rem; color: #666;">Categories</div>
                    </div>
                </div>
            </div>
        `;
        
        this.container.insertAdjacentHTML('afterend', summaryHtml);
    }

    calculateRiskScore(breaches) {
        const riskValues = { critical: 25, high: 15, medium: 8, low: 3 };
        let score = 0;
        breaches.forEach(breach => {
            const platform = this.categorizePlatform(breach.website);
            score += riskValues[platform.riskLevel] || 5;
        });
        return Math.min(score, 100);
    }

    getUniqueCategories(breaches) {
        const categories = new Set();
        breaches.forEach(breach => {
            const platform = this.categorizePlatform(breach.website);
            categories.add(platform.category);
        });
        return Array.from(categories);
    }

    // Method to force update existing breaches (for compatibility)
    updateWithBreaches(breaches) {
        if (breaches && breaches.length > 0) {
            this.generateFixedNodes(breaches);
            this.generateIntelligentAttackPaths(breaches);
            this.setupSVG();
            this.renderFixedMap();
        }
    }
}

// Global initialization
window.DynamicAttackSurfaceMap = DynamicAttackSurfaceMap;
