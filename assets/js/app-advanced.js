// Advanced Threat Analysis Platform - Main Application Controller
class ThreatScopeApp {
    constructor() {
        this.currentFeature = 'threat-engine';
        this.threatAnalyzer = null;
        this.attackSurfaceMap = null;
        this.threatSimulation = null;
        this.init();
    }

    init() {
        this.setupFeatureNavigation();
        this.initializeComponents();
        this.setupKeyboardShortcuts();
    }

    setupFeatureNavigation() {
        // Feature switching functionality
        window.showFeature = (featureId) => {
            // Update active feature button
            document.querySelectorAll('.feature-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.closest('.feature-btn').classList.add('active');

            // Show corresponding feature panel
            document.querySelectorAll('.feature-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(featureId).classList.add('active');

            this.currentFeature = featureId;

            // Close mobile sidebar if open
            if (window.innerWidth <= 768) {
                this.closeMobileSidebar();
            }

            // Initialize feature-specific components
            if (featureId === 'attack-surface' && !this.attackSurfaceMap) {
                // Delay to ensure panel is visible
                setTimeout(() => {
                    this.attackSurfaceMap = new AttackSurfaceMap();
                    window.attackSurfaceMap = this.attackSurfaceMap;
                }, 100);
            }
        };

        // Mobile sidebar toggle functionality
        window.toggleSidebar = () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('open');
        };
    }

    initializeComponents() {
        // Initialize AI Threat Analyzer
        this.threatAnalyzer = new ThreatAnalyzer();
        
        // Initialize Attack Surface Map when panel becomes active
        // (Will be lazy-loaded when first accessed)
        
        // Initialize Threat Simulation
        this.threatSimulation = new ThreatSimulation();
        window.threatSimulation = this.threatSimulation;
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Quick feature switching with keyboard
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.switchToFeature('threat-engine');
                        break;
                    case '2':
                        e.preventDefault();
                        this.switchToFeature('attack-surface');
                        break;
                    case '3':
                        e.preventDefault();
                        this.switchToFeature('simulation');
                        break;
                    case 'Enter':
                        e.preventDefault();
                        this.executeCurrentFeatureAction();
                        break;
                }
            }
        });
    }

    switchToFeature(featureId) {
        const button = document.querySelector(`[onclick="showFeature('${featureId}')"]`);
        if (button) {
            button.click();
        }
    }

    executeCurrentFeatureAction() {
        switch(this.currentFeature) {
            case 'threat-engine':
                const emailForm = document.getElementById('threat-analysis-form');
                if (emailForm) emailForm.dispatchEvent(new Event('submit'));
                break;
            case 'attack-surface':
                loadSampleProfile();
                break;
            case 'simulation':
                startSimulation();
                break;
        }
    }

    // Mobile sidebar control methods
    closeMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    }

    // Cross-feature communication methods
    shareDataBetweenFeatures(sourceFeature, data) {
        switch(sourceFeature) {
            case 'threat-engine':
                // Update attack surface map with threat analysis results
                if (this.attackSurfaceMap && data.breaches) {
                    this.attackSurfaceMap.updateWithBreaches(data.breaches);
                }
                break;
            case 'attack-surface':
                // Could trigger relevant simulation scenarios
                break;
        }
    }

    // Utility methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 2000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
        
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Demo mode for testing without backend
    enableDemoMode() {
        console.log('🎭 Demo mode enabled - Using mock data');
        this.showNotification('Demo mode active - Using sample data', 'info');
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.threatScopeApp = new ThreatScopeApp();
    
    // Enable demo mode since we might not have PHP running
    window.threatScopeApp.enableDemoMode();
    
    // Add some interactive Easter eggs
    document.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('logo')) {
            window.threatScopeApp.showNotification('🕵️ Advanced mode unlocked!', 'success');
        }
    });
    
    console.log(`
    🛡️ ThreatScope AI Loaded
    ========================
    Keyboard Shortcuts:
    • Ctrl/Cmd + 1: AI Threat Engine
    • Ctrl/Cmd + 2: Attack Surface Map  
    • Ctrl/Cmd + 3: What If Simulation
    • Ctrl/Cmd + Enter: Execute current feature
    
    Sample test data:
    • john.doe@techcorp.com (High risk profile)
    • sarah.smith@financebank.com (Financial sector)
    `);
});
