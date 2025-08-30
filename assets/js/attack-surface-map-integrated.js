// Attack Surface Map with Threat Integration
document.addEventListener('DOMContentLoaded', function() {
    console.log('Attack Surface Map loaded, checking for threat data...');
    
    // Check for stored threat data from AI Threat Engine
    const storedData = localStorage.getItem('threatAnalysisData');
    const lastEmail = localStorage.getItem('lastThreatAnalysisEmail');
    
    if (storedData) {
        const threatData = JSON.parse(storedData);
        console.log('Found stored threat data:', threatData);
        
        if (threatData.hasBreaches && threatData.breaches.length > 0) {
            // Create attack surface with threat-based nodes
            createThreatBasedAttackSurface(threatData);
        } else {
            // Show secure state
            showSecureState(threatData.email);
        }
    } else {
        // Show default empty state
        showEmptyState();
    }
    
    // Listen for real-time threat analysis updates
    window.addEventListener('threatAnalysisComplete', function(event) {
        const threatData = event.detail;
        console.log('Received threat analysis update:', threatData);
        
        if (threatData.hasBreaches && threatData.breaches.length > 0) {
            createThreatBasedAttackSurface(threatData);
        } else {
            showSecureState(threatData.email);
        }
    });
});

function createAttackSurface() {
    const container = document.getElementById('attack-surface-map');
    
    // Get container dimensions
    const containerWidth = container.clientWidth || 1000;
    const containerHeight = Math.max(container.clientHeight || 500, 500);
    
    // Calculate center and positions
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radius = Math.min(centerX, centerY) - 80; // Leave margin
    
    // Create SVG that fits the container
    container.innerHTML = '';
    const svg = d3.select('#attack-surface-map')
        .append('svg')
        .attr('width', '100%')
        .attr('height', containerHeight)
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .style('background', 'transparent');
    
    // Sample data with authentic brand colors
    const platformData = [
        { name: 'Steam', icon: 'fab fa-steam', color: '#1b2838', textColor: '#ffffff' },
        { name: 'Discord', icon: 'fab fa-discord', color: '#5865f2', textColor: '#ffffff' },
        { name: 'Epic', icon: 'fas fa-gamepad', color: '#313131', textColor: '#ffffff' },
        { name: 'Twitch', icon: 'fab fa-twitch', color: '#9146ff', textColor: '#ffffff' },
        { name: 'Spotify', icon: 'fab fa-spotify', color: '#1db954', textColor: '#ffffff' },
        { name: 'Netflix', icon: 'fas fa-tv', color: '#e50914', textColor: '#ffffff' },
        { name: 'Gmail', icon: 'far fa-envelope', color: '#ea4335', textColor: '#ffffff' }
    ];
    
    // Calculate positions in a circle
    const platforms = platformData.map((platform, index) => {
        const angle = (index / platformData.length) * 2 * Math.PI - Math.PI / 2; // Start from top
        return {
            ...platform,
            x: centerX + Math.cos(angle) * radius * 0.8,
            y: centerY + Math.sin(angle) * radius * 0.8
        };
    });
    
    // Draw connections - minimal sleek lines
    platforms.forEach(platform => {
        svg.append('line')
            .attr('x1', centerX)
            .attr('y1', centerY)
            .attr('x2', platform.x)
            .attr('y2', platform.y)
            .attr('stroke', '#666')
            .attr('stroke-width', 1)
            .attr('opacity', 0.4)
            .attr('stroke-dasharray', '2,2');
    });
    
    // Draw center node - sleek minimal
    svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', 40)
        .attr('fill', '#2a2a2a')
        .attr('stroke', '#666')
        .attr('stroke-width', 2);
    
    // Center icon
    svg.append('text')
        .attr('x', centerX)
        .attr('y', centerY + 2)
        .attr('text-anchor', 'middle')
        .style('font-family', 'FontAwesome')
        .style('font-size', '18px')
        .style('fill', 'white')
        .text('\uf0e0');
        
    svg.append('text')
        .attr('x', centerX)
        .attr('y', centerY - 22)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', '500')
        .style('fill', '#999')
        .text('CORE');
    
    // Draw platform nodes
    platforms.forEach(platform => {
        const group = svg.append('g')
            .attr('transform', `translate(${platform.x}, ${platform.y})`)
            .style('cursor', 'pointer');
        
        group.append('circle')
            .attr('r', 28)
            .attr('fill', platform.color)
            .attr('stroke', '#444')
            .attr('stroke-width', 1);
        
        // Add FontAwesome icon using foreignObject
        const foreign = group.append('foreignObject')
            .attr('x', -12)
            .attr('y', -12)
            .attr('width', 24)
            .attr('height', 24);
        
        const iconDiv = foreign.append('xhtml:div')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('justify-content', 'center')
            .style('width', '24px')
            .style('height', '24px')
            .style('color', platform.textColor)
            .style('font-size', '16px');
        
        iconDiv.append('xhtml:i')
            .attr('class', platform.icon);
        
        group.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '45px')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .text(platform.name);
        
        // Add hover effect
        group.on('mouseenter', function() {
            d3.select(this).select('circle')
                .transition().duration(200)
                .attr('r', 35);
        })
        .on('mouseleave', function() {
            d3.select(this).select('circle')
                .transition().duration(200)
                .attr('r', 30);
        })
        .on('click', function() {
            d3.select(this).select('circle')
                .transition().duration(300)
                .attr('stroke-width', 6)
                .transition().duration(300)
                .attr('stroke-width', 3);
        });
        
        // Add drag functionality
        const drag = d3.drag()
            .on('start', function(event) {
                d3.select(this).select('circle')
                    .attr('stroke-width', 5)
                    .attr('opacity', 0.8);
                console.log('Started dragging:', platform.name);
            })
            .on('drag', function(event) {
                // Update platform position
                platform.x = event.x;
                platform.y = event.y;
                
                // Move the node group
                d3.select(this)
                    .attr('transform', `translate(${platform.x}, ${platform.y})`);
                
                // Update the connection line
                svg.selectAll('line')
                    .filter(function(d, i) {
                        return platforms[i] === platform;
                    })
                    .attr('x2', platform.x)
                    .attr('y2', platform.y);
            })
            .on('end', function(event) {
                d3.select(this).select('circle')
                    .attr('stroke-width', 3)
                    .attr('opacity', 1);
                console.log('Finished dragging:', platform.name, 'to position:', platform.x, platform.y);
            });
        
        // Apply drag to the group
        group.call(drag);
    });
    
    console.log('Attack surface created successfully!');
}

// Show empty state when no threat data exists
function showEmptyState() {
    const container = document.getElementById('attack-surface-map');
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-shield-alt"></i>
            <h3>No Threat Analysis Found</h3>
            <p>Run a threat analysis first to see your attack surface map</p>
            <a href="threat-engine.html" class="btn-primary">Analyze Email Threats</a>
        </div>
    `;
}

// Show secure state when no breaches found
function showSecureState(email) {
    const container = document.getElementById('attack-surface-map');
    container.innerHTML = `
        <div class="secure-state">
            <i class="fas fa-shield-check"></i>
            <h3>✅ Attack Surface Clear</h3>
            <p class="email-display">${email}</p>
            <p>No data breaches detected. Your digital footprint appears secure.</p>
            <div class="security-status">
                <h4>🛡️ Security Status</h4>
                <div class="status-row">
                    <span>Risk Level:</span>
                    <strong class="status-low">LOW</strong>
                </div>
                <div class="status-row">
                    <span>Breaches Found:</span>
                    <strong class="status-low">0</strong>
                </div>
            </div>
        </div>
    `;
}

// Create threat-based attack surface with dynamic nodes
function createThreatBasedAttackSurface(threatData) {
    const container = document.getElementById('attack-surface-map');
    
    // Show loading state first
    container.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <h3>Generating Attack Surface for ${threatData.email}</h3>
            <p>Mapping ${threatData.breaches.length} security breach${threatData.breaches.length > 1 ? 'es' : ''}...</p>
        </div>
    `;
    
    // Create visualization after brief loading
    setTimeout(() => {
        createDynamicAttackSurface(threatData);
    }, 1500);
}

function createDynamicAttackSurface(threatData) {
    const container = document.getElementById('attack-surface-map');
    
    // Get container dimensions
    const containerWidth = container.clientWidth || 1000;
    const containerHeight = Math.max(container.clientHeight || 500, 500);
    
    // Calculate center and positions
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radius = Math.min(centerX, centerY) - 80;
    
    // Clear container and create SVG
    container.innerHTML = '';
    const svg = d3.select('#attack-surface-map')
        .append('svg')
        .attr('width', '100%')
        .attr('height', containerHeight)
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .style('background', 'transparent');
    
    // Use actual breach data from threat analysis
    const platforms = threatData.breaches.map((breach, index) => {
        const angle = (index / threatData.breaches.length) * 2 * Math.PI - Math.PI / 2;
        return {
            ...breach,
            x: centerX + Math.cos(angle) * radius * 0.8,
            y: centerY + Math.sin(angle) * radius * 0.8
        };
    });
    
    // Draw attack path connections - red/orange for breached connections
    platforms.forEach(platform => {
        svg.append('line')
            .attr('x1', centerX)
            .attr('y1', centerY)
            .attr('x2', platform.x)
            .attr('y2', platform.y)
            .attr('stroke', '#dc3545')
            .attr('stroke-width', 2)
            .attr('opacity', 0.7)
            .style('filter', 'drop-shadow(0 0 3px rgba(220, 53, 69, 0.3))');
    });
    
    // Draw center node (user's email)
    const centerGroup = svg.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`);
    
    centerGroup.append('circle')
        .attr('r', 45)
        .attr('fill', '#dc3545')
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .style('filter', 'drop-shadow(0 0 8px rgba(220, 53, 69, 0.4))');
    
    // Center email icon
    centerGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '5px')
        .style('font-family', 'FontAwesome')
        .style('font-size', '20px')
        .style('fill', 'white')
        .text('\uf0e0');
    
    // Center label
    centerGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-30px')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('fill', '#fff')
        .text('COMPROMISED');
    
    centerGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '35px')
        .style('font-size', '9px')
        .style('fill', '#333')
        .style('font-weight', '500')
        .text(threatData.email.split('@')[0]);
    
    // Draw breach platform nodes
    platforms.forEach((platform, index) => {
        const group = svg.append('g')
            .attr('transform', `translate(${platform.x}, ${platform.y})`)
            .style('cursor', 'pointer');
        
        // Breach node with red warning styling
        group.append('circle')
            .attr('r', 32)
            .attr('fill', platform.color || '#dc3545')
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .style('filter', 'drop-shadow(0 0 6px rgba(220, 53, 69, 0.3))');
        
        // Warning indicator
        group.append('circle')
            .attr('cx', 20)
            .attr('cy', -20)
            .attr('r', 8)
            .attr('fill', '#ff9800')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);
        
        group.append('text')
            .attr('x', 20)
            .attr('y', -16)
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .text('!');
        
        // Platform icon
        const foreign = group.append('foreignObject')
            .attr('x', -12)
            .attr('y', -12)
            .attr('width', 24)
            .attr('height', 24);
        
        const iconDiv = foreign.append('xhtml:div')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('justify-content', 'center')
            .style('width', '24px')
            .style('height', '24px')
            .style('color', platform.textColor || '#ffffff')
            .style('font-size', '16px');
        
        iconDiv.append('xhtml:i')
            .attr('class', platform.icon);
        
        // Platform name
        group.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '50px')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .text(platform.name);
        
        // Breach date (if available)
        if (platform.breachDate) {
            group.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '62px')
                .style('font-size', '9px')
                .style('fill', '#666')
                .text(platform.breachDate);
        }
        
        // Add interaction effects
        group.on('mouseenter', function() {
            d3.select(this).select('circle')
                .transition().duration(200)
                .attr('r', 38);
        })
        .on('mouseleave', function() {
            d3.select(this).select('circle')
                .transition().duration(200)
                .attr('r', 32);
        })
        .on('click', function() {
            // Show breach details tooltip
            showBreachDetails(platform, d3.event);
        });
    });
    
    // Add the attack surface summary
    addThreatBasedSummary(threatData, container);
    
    console.log('Dynamic attack surface created with', platforms.length, 'breach nodes');
}

function addThreatBasedSummary(threatData, container) {
    const summary = document.createElement('div');
    summary.className = 'attack-summary';
    
    const riskColor = threatData.riskScore > 70 ? '#dc3545' : 
                     threatData.riskScore > 40 ? '#fd7e14' : '#28a745';
    
    summary.innerHTML = `
        <h4>🚨 Attack Surface Analysis for ${threatData.email}</h4>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-value" style="color: #dc3545;">${threatData.breaches.length}</div>
                <div class="stat-label">Active Breaches</div>
            </div>
            <div class="stat-item">
                <div class="stat-value" style="color: ${riskColor};">${threatData.riskScore}</div>
                <div class="stat-label">Risk Score</div>
            </div>
            <div class="stat-item">
                <div class="stat-value" style="color: #fd7e14;">${threatData.threatLevel}</div>
                <div class="stat-label">Threat Level</div>
            </div>
        </div>
        <div class="summary-note">
            <small>Each connection represents a compromised account that could be used for lateral attacks</small>
        </div>
    `;
    
    container.parentNode.insertBefore(summary, container.nextSibling);
}

function showBreachDetails(platform, event) {
    // Create temporary tooltip with breach information
    const tooltip = document.createElement('div');
    tooltip.className = 'breach-tooltip';
    
    tooltip.innerHTML = `
        <div class="tooltip-title">${platform.name} Breach</div>
        ${platform.breachDate ? `<div>Date: ${platform.breachDate}</div>` : ''}
        ${platform.compromisedData ? `<div>Compromised: ${platform.compromisedData.slice(0, 3).join(', ')}</div>` : ''}
    `;
    
    // Position tooltip
    tooltip.style.left = (event.pageX + 10) + 'px';
    tooltip.style.top = (event.pageY - 10) + 'px';
    
    document.body.appendChild(tooltip);
    
    // Remove tooltip after 3 seconds
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, 3000);
}

// Load sample profile function (keep existing functionality)
function loadEmailProfile(email) {
    // Simulate loading a specific email profile
    const sampleThreatData = {
        email: email,
        hasBreaches: true,
        breaches: [
            { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0077b5', textColor: '#ffffff', breachDate: '2023-01-15' },
            { name: 'GitHub', icon: 'fab fa-github', color: '#333333', textColor: '#ffffff', breachDate: '2023-02-10' }
        ],
        riskScore: 87,
        threatLevel: 'CRITICAL'
    };
    
    createThreatBasedAttackSurface(sampleThreatData);
}

// Mobile sidebar toggle
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}
