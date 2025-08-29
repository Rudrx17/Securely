// Digital Twin: Attack Surface Map
class AttackSurfaceMap {
    constructor() {
        this.svg = null;
        this.nodes = [];
        this.links = [];
        this.simulation = null;
        this.container = document.getElementById('attack-surface-map');
        this.init();
    }

    init() {
        this.setupSVG();
        this.loadDefaultNodes();
    }

    setupSVG() {
        // Clear existing content
        this.container.innerHTML = '';
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.svg = d3.select('#attack-surface-map')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', 'transparent');
        
        // Add arrow marker for attack paths
        this.svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 13)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 13)
            .attr('markerHeight', 13)
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#dc3545')
            .style('stroke', 'none');
    }

    loadDefaultNodes() {
        this.nodes = [
            { id: 'email', label: 'Email', type: 'secure', x: 200, y: 250, icon: '📧' },
            { id: 'linkedin', label: 'LinkedIn', type: 'secure', x: 100, y: 150, icon: '💼' },
            { id: 'github', label: 'GitHub', type: 'secure', x: 300, y: 150, icon: '💻' },
            { id: 'work', label: 'Work Systems', type: 'secure', x: 400, y: 250, icon: '🏢' },
            { id: 'personal', label: 'Personal Data', type: 'secure', x: 150, y: 350, icon: '👤' },
            { id: 'financial', label: 'Financial', type: 'secure', x: 350, y: 350, icon: '💳' }
        ];
        
        this.links = [];
        this.renderMap();
    }

    updateWithBreaches(breaches) {
        // Mark nodes as breached based on breach data
        this.nodes.forEach(node => {
            const breach = breaches.find(b => 
                b.website.toLowerCase().includes(node.id) || 
                node.id === 'email' && b.attack_vector === 'email_hijacking'
            );
            
            if (breach) {
                node.type = 'breached';
                node.breach_info = breach;
            }
        });
        
        // Create attack paths based on breached nodes
        this.generateAttackPaths(breaches);
        this.renderMap();
    }

    generateAttackPaths(breaches) {
        this.links = [];
        
        const breachedNodes = this.nodes.filter(n => n.type === 'breached');
        
        // Define attack path logic
        const attackPaths = {
            'email': ['linkedin', 'work', 'financial'],
            'linkedin': ['work', 'email'],
            'github': ['work', 'email'],
            'personal': ['financial', 'email'],
        };
        
        breachedNodes.forEach(sourceNode => {
            if (attackPaths[sourceNode.id]) {
                attackPaths[sourceNode.id].forEach(targetId => {
                    const targetNode = this.nodes.find(n => n.id === targetId);
                    if (targetNode) {
                        this.links.push({
                            source: sourceNode.id,
                            target: targetId,
                            type: 'attack-path'
                        });
                    }
                });
            }
        });
    }

    renderMap() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        // Clear previous render
        this.svg.selectAll('*').remove();
        
        // Re-add arrow marker
        this.svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 13)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 13)
            .attr('markerHeight', 13)
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#dc3545')
            .style('stroke', 'none');
        
        // Create force simulation
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(120))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));
        
        // Render links (attack paths)
        const link = this.svg.append('g')
            .selectAll('line')
            .data(this.links)
            .enter().append('line')
            .attr('stroke', '#dc3545')
            .attr('stroke-width', 3)
            .attr('marker-end', 'url(#arrowhead)')
            .style('opacity', 0)
            .transition()
            .delay((d, i) => i * 500)
            .duration(1000)
            .style('opacity', 0.8);
        
        // Render nodes
        const node = this.svg.append('g')
            .selectAll('g')
            .data(this.nodes)
            .enter().append('g')
            .call(d3.drag()
                .on('start', this.dragstarted.bind(this))
                .on('drag', this.dragged.bind(this))
                .on('end', this.dragended.bind(this)));
        
        // Add circles for nodes
        node.append('circle')
            .attr('r', 40)
            .attr('fill', d => d.type === 'breached' ? '#dc3545' : '#28a745')
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .style('filter', d => d.type === 'breached' ? 'drop-shadow(0 0 10px rgba(220, 53, 69, 0.6))' : 'none')
            .on('mouseover', this.showNodeTooltip.bind(this))
            .on('mouseout', this.hideNodeTooltip.bind(this));
        
        // Add icons
        node.append('text')
            .text(d => d.icon)
            .attr('text-anchor', 'middle')
            .attr('dy', 8)
            .style('font-size', '20px')
            .style('pointer-events', 'none');
        
        // Add labels
        node.append('text')
            .text(d => d.label)
            .attr('text-anchor', 'middle')
            .attr('dy', 60)
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', '#2c3e50')
            .style('pointer-events', 'none');
        
        // Update positions on simulation tick
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            node
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });
        
        // Animate breached nodes
        this.animateBreachedNodes();
    }

    animateBreachedNodes() {
        this.svg.selectAll('circle')
            .filter(d => d.type === 'breached')
            .transition()
            .duration(1000)
            .ease(d3.easeElastic)
            .attr('r', 45)
            .transition()
            .duration(1000)
            .attr('r', 40)
            .on('end', function() {
                d3.select(this)
                    .transition()
                    .duration(2000)
                    .ease(d3.easeSinInOut)
                    .style('filter', 'drop-shadow(0 0 20px rgba(220, 53, 69, 0.8))')
                    .transition()
                    .duration(2000)
                    .style('filter', 'drop-shadow(0 0 10px rgba(220, 53, 69, 0.6))')
                    .on('end', function() {
                        // Repeat animation
                        d3.select(this).node().parentNode.__data__.type === 'breached' && 
                        d3.select(this).transition().duration(0).call(arguments.callee);
                    });
            });
    }

    showNodeTooltip(event, d) {
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'node-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.9)')
            .style('color', 'white')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', '1000');
        
        let content = `<strong>${d.label}</strong><br>`;
        content += `Status: ${d.type === 'breached' ? '🔴 BREACHED' : '🟢 SECURE'}<br>`;
        
        if (d.breach_info) {
            content += `Breach Date: ${d.breach_info.breach_date}<br>`;
            content += `Attack Vector: ${d.breach_info.attack_vector}`;
        }
        
        tooltip.html(content)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .transition()
            .duration(200)
            .style('opacity', 1);
    }

    hideNodeTooltip() {
        d3.selectAll('.node-tooltip').remove();
    }

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

// Load sample profile function
function loadSampleProfile() {
    if (window.attackSurfaceMap) {
        // Simulate loading John Doe's profile with breaches
        const sampleBreaches = [
            {
                website: 'linkedin.com',
                breach_date: '2023-01-15',
                attack_vector: 'credential_stuffing',
                severity_level: 5
            },
            {
                website: 'github.com',
                breach_date: '2023-02-10',
                attack_vector: 'lateral_movement',
                severity_level: 5
            }
        ];
        
        window.attackSurfaceMap.updateWithBreaches(sampleBreaches);
        
        // Show notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 500;
        `;
        notification.innerHTML = '<i class="fas fa-check"></i> Sample profile loaded - John Doe (TechCorp)';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Export for global use
window.AttackSurfaceMap = AttackSurfaceMap;
