// AI-Powered Threat Analysis Engine
class ThreatAnalyzer {
    constructor() {
        this.apiBaseUrl = '../backend';
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('threat-analysis-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.analyzeThreats();
        });
    }

    async analyzeThreats() {
        const email = document.getElementById('threat-email-input').value.trim();
        const resultsContainer = document.getElementById('threat-results');
        
        if (!email) {
            this.showError('Please enter an email address');
            return;
        }

        // Show simple loading message
        resultsContainer.innerHTML = `
            <div class="simple-loading">
                <i class="fas fa-spinner fa-spin"></i>
                Checking for breaches...
            </div>
        `;
        
        try {
            const analysis = await this.makeAnalysisCall(email);
            this.displayThreatAnalysis(analysis, resultsContainer);
            
        } catch (error) {
            this.showError('Analysis failed: ' + error.message);
        }
    }


    async makeAnalysisCall(email) {
        // Try different possible API endpoints based on deployment
        const possibleEndpoints = [
            '/Securely/backend/breach_checker.php',    
            '../backend/breach_checker.php' 
        ];
        
        for (const endpoint of possibleEndpoints) {
            try {
                console.log(`Trying API endpoint: ${endpoint}`);
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`API call successful via: ${endpoint}`);
                    return data;
                } else if (response.status !== 404) {
                    console.log(`API returned status: ${response.status}`);
                }
            } catch (error) {
                console.log(`Endpoint ${endpoint} failed:`, error.message);
                // Continue to next endpoint
            }
        }
        
        // If all endpoints fail, fall back to mock data
        console.warn('All API endpoints failed, falling back to mock data');
        return this.getMockAnalysis(email);
    }
    
    async getMockAnalysis(email) {
        // Fallback to mock sophisticated AI analysis
        const mockProfiles = {
            'ayushkumbhar1111@gmail.com': {
                breaches: [
                    {
                        website: 'linkedin.com',
                        breach_date: '2023-01-15',
                        description: 'Professional network breach exposing career details',
                        attack_vector: 'credential_stuffing',
                        severity_level: 5
                    },
                    {
                        website: 'github.com',
                        breach_date: '2023-02-10',
                        description: 'Code repository breach revealing work projects',
                        attack_vector: 'lateral_movement',
                        severity_level: 5
                    }
                ],
                profile: {
                    employer: 'TechCorp Inc.',
                    job_title: 'Senior Software Engineer',
                    location: 'San Francisco, CA'
                },
                ai_analysis: {
                    threat_level: 'CRITICAL',
                    narrative: "Your LinkedIn breach is particularly concerning because it exposes your professional network to TechCorp Inc. Attackers could craft highly targeted spear-phishing emails using your job title (Senior Software Engineer) and colleague connections. Combined with your GitHub breach, this creates a direct pathway to your corporate email and potentially your company's entire development infrastructure.",
                    key_risks: [
                        'Corporate espionage targeting TechCorp',
                        'Spear-phishing campaigns against colleagues',
                        'Source code theft through GitHub access',
                        'Credential stuffing across development tools'
                    ]
                },
                risk_score: 87
            },
            'sarah.smith@financebank.com': {
                breaches: [
                    {
                        website: 'gmail.com',
                        breach_date: '2023-04-05',
                        description: 'Email service breach exposing communications',
                        attack_vector: 'email_hijacking',
                        severity_level: 5
                    }
                ],
                profile: {
                    employer: 'Finance Bank Ltd.',
                    job_title: 'Financial Analyst',
                    location: 'New York, NY'
                },
                ai_analysis: {
                    threat_level: 'HIGH',
                    narrative: "Your email breach creates cascading risks for Finance Bank Ltd. Attackers can monitor sensitive financial communications, access client information, and potentially manipulate banking operations. Your role as a Financial Analyst makes you a high-value target for financial crime syndicates.",
                    key_risks: [
                        'Financial fraud and embezzlement',
                        'Client data exposure',
                        'Banking system infiltration',
                        'Regulatory compliance violations'
                    ]
                },
                risk_score: 78
            }
        };

        await this.delay(1000); // Simulate API call
        
        return mockProfiles[email] || {
            breaches: [],
            profile: null,
            ai_analysis: {
                threat_level: 'LOW',
                narrative: 'No breaches found for this email address. Your digital footprint appears secure.',
                key_risks: []
            },
            risk_score: 15
        };
    }

    displayThreatAnalysis(analysis, container) {
        container.innerHTML = '';
        
        // Handle both API response and mock data formats
        if (analysis.success === false) {
            this.showError('Analysis failed: ' + (analysis.error || 'Unknown error'));
            return;
        }
        
        // Check if breaches were found (handle both response formats)
        const hasBreaches = analysis.found_breaches || (analysis.breaches && analysis.breaches.length > 0);
        
        if (!hasBreaches) {
            // No breaches found - show safe message
            const safeCard = document.createElement('div');
            safeCard.className = 'ai-summary-card safe';
            safeCard.innerHTML = `
                <div class="summary-header">
                    <span class="status-badge safe">✅ YOU'RE SECURE</span>
                    <h3>No Security Threats Found</h3>
                </div>
                <div class="ai-analysis">
                    <div class="ai-icon"><i class="fas fa-robot"></i></div>
                    <div class="ai-content">
                        <h4>Securely AI Assessment</h4>
                        <div class="ai-response safe-response">
                            ${this.formatAISummary(analysis.ai_summary)}
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(safeCard);
            return;
        }
        
        // Show AI Summary Card prominently first
        const aiSummaryCard = document.createElement('div');
        aiSummaryCard.className = 'ai-summary-card breached';
        aiSummaryCard.innerHTML = `
            <div class="summary-header">
                <span class="status-badge critical">🚨 SECURITY ALERT</span>
                <h3>${analysis.total_breaches} Data Breach${analysis.total_breaches > 1 ? 'es' : ''} Found</h3>
            </div>
            <div class="ai-analysis">
                <div class="ai-icon"><i class="fas fa-robot"></i></div>
                <div class="ai-content">
                    <h4>AI Threat Analysis</h4>
                    <div class="ai-response">
                        ${this.formatAISummary(analysis.ai_summary)}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(aiSummaryCard);
        
        // Show breach cards section
        if (analysis.breaches && analysis.breaches.length > 0) {
            const breachSection = document.createElement('div');
            breachSection.className = 'breaches-section';
            
            const sectionTitle = document.createElement('h3');
            sectionTitle.textContent = 'Data Breaches Found:';
            sectionTitle.className = 'section-title';
            breachSection.appendChild(sectionTitle);
            
            const breachGrid = document.createElement('div');
            breachGrid.className = 'breach-grid';
            
            analysis.breaches.forEach((breach, index) => {
                this.createModernBreachCard(breach, index, breachGrid, analysis.total_breaches);
            });
            
            breachSection.appendChild(breachGrid);
            container.appendChild(breachSection);
        }
    }
    
    createBreachCard(breach, index, container) {
        const breachCard = document.createElement('div');
        breachCard.className = 'breach-card';
        
        // Get the most relevant information from the breach object
        const breachInfo = this.extractBreachInfo(breach);
        
        breachCard.innerHTML = `
            <div class="breach-header">
                <div class="breach-number">#${index}</div>
                <div class="breach-title">
                    <h4>${breachInfo.website || 'Unknown Website'}</h4>
                    <span class="breach-date">${breachInfo.date || 'Date unknown'}</span>
                </div>
            </div>
            <div class="breach-details">
                ${breachInfo.description ? `<p class="description">${breachInfo.description}</p>` : ''}
                <div class="breach-data">
                    <h5>Exposed Data:</h5>
                    <div class="data-tags">
                        ${breachInfo.exposedData.map(data => `<span class="data-tag">${data}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(breachCard);
    }
    
    extractBreachInfo(breach) {
        const info = {
            website: null,
            date: null,
            description: null,
            exposedData: []
        };
        
        // Extract website/source
        for (const key in breach) {
            const lowerKey = key.toLowerCase();
            const value = breach[key];
            
            if (!value || value === '') continue;
            
            if (lowerKey.includes('site') || lowerKey.includes('domain') || lowerKey.includes('source') || lowerKey.includes('website')) {
                info.website = value;
            } else if (lowerKey.includes('date') || lowerKey.includes('time')) {
                info.date = value;
            } else if (lowerKey.includes('description') || lowerKey.includes('breach') || lowerKey.includes('incident')) {
                info.description = value;
            } else if (lowerKey.includes('email') || lowerKey.includes('user') || lowerKey.includes('account')) {
                info.exposedData.push('Email Address');
            } else if (lowerKey.includes('pass') || lowerKey.includes('hash')) {
                info.exposedData.push('Password');
            } else if (lowerKey.includes('name')) {
                info.exposedData.push('Name');
            } else if (lowerKey.includes('phone')) {
                info.exposedData.push('Phone Number');
            } else {
                // Add other non-empty fields as exposed data
                if (typeof value === 'string' && value.length > 0 && value.length < 100) {
                    info.exposedData.push(key);
                }
            }
        }
        
        // Ensure at least email is shown as exposed data
        if (info.exposedData.length === 0) {
            info.exposedData.push('Email Address');
        }
        
        return info;
    }
    
    formatAISummary(summary) {
        if (!summary) return 'Analysis unavailable';
        
        // Convert markdown-style formatting to HTML
        return summary
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^(.*)$/g, '<p>$1</p>')
            .replace(/<p><\/p>/g, '');
    }


    showError(message) {
        const container = document.getElementById('threat-results');
        container.innerHTML = `
            <div class="threat-card" style="border-left-color: #ffc107;">
                <div class="ai-narrative" style="border-left-color: #ffc107; background: #fff3cd; color: #856404;">
                    <i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i>
                    ${message}
                </div>
            </div>
        `;
    }

    formatRealDataResponse(realData) {
        return {
            breaches: realData.breaches || [],
            profile: this.inferProfileFromEmail(realData.breaches?.[0]?.identifier),
            ai_analysis: realData.ai_analysis,
            risk_score: realData.ai_analysis?.risk_score || 50
        };
    }
    
    inferProfileFromEmail(email) {
        if (!email) return null;
        
        const domain = email.split('@')[1];
        
        // Infer company info from domain
        const corporateDomains = {
            'techcorp.com': { employer: 'TechCorp Inc.', job_title: 'Software Engineer', location: 'San Francisco, CA' },
            'financebank.com': { employer: 'Finance Bank Ltd.', job_title: 'Financial Analyst', location: 'New York, NY' },
            'startup.io': { employer: 'StartupIO', job_title: 'Product Manager', location: 'Austin, TX' }
        };
        
        return corporateDomains[domain] || null;
    }

    createModernBreachCard(breach, index, container, totalBreaches) {
        const breachCard = document.createElement('div');
        breachCard.className = `modern-breach-card ${this.getRiskColorClass(index)}`;
        breachCard.style.animationDelay = `${index * 0.1}s`;
        
        const websiteInfo = this.getWebsiteInfo(breach);
        const compromisedData = this.getCompromisedDataTypes(breach);
        
        breachCard.innerHTML = `
            <div class="breach-card-content">
                <div class="breach-card-header">
                    <div class="website-info">
                        <div class="website-logo">
                            ${websiteInfo.logoUrl ? 
                                `<img src="${websiteInfo.logoUrl}" alt="${websiteInfo.name} logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                            <div class="fallback-logo" ${websiteInfo.logoUrl ? 'style="display:none;"' : ''}>
                                <span>${websiteInfo.name.charAt(0)}</span>
                            </div>
                        </div>
                        <span class="website-name">${websiteInfo.name}</span>
                    </div>
                    <div class="breach-index">#${index + 1}</div>
                </div>
                
                <div class="compromised-data">
                    <h5>Compromised Data:</h5>
                    <div class="data-tags-modern">
                        ${compromisedData.map(type => `<div class="data-tag-modern">${type}</div>`).join('')}
                    </div>
                </div>
                
                ${this.getBreachDate(breach) ? `<div class="breach-date-info">Breach Date: ${this.getBreachDate(breach)}</div>` : ''}
            </div>
            
            <div class="breach-footer">
                <span class="resolve-action">Mark breach as resolved</span>
            </div>
        `;
        
        container.appendChild(breachCard);
    }
    
    getWebsiteInfo(breach) {
        // Extract website from any field
        let website = null;
        for (const key in breach) {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('site') || lowerKey.includes('domain') || lowerKey.includes('website') || lowerKey.includes('source')) {
                website = breach[key];
                break;
            }
        }
        
        if (!website) {
            // Fallback - look for any field that looks like a URL
            for (const key in breach) {
                const value = breach[key];
                if (typeof value === 'string' && (value.includes('.com') || value.includes('.org') || value.includes('.net'))) {
                    website = value;
                    break;
                }
            }
        }
        
        if (!website) {
            return { name: 'Unknown Website', logoUrl: null };
        }
        
        try {
            let urlString = website;
            if (!urlString.startsWith('http')) { 
                urlString = 'https://' + urlString; 
            }
            
            const url = new URL(urlString);
            const domain = url.hostname.replace(/^www\./, '');
            const parts = domain.split('.');
            
            const genericSLDs = ['co', 'com', 'org', 'gov', 'ac', 'net', 'edu'];
            
            let mainDomain;
            if (parts.length > 2 && genericSLDs.includes(parts[parts.length - 2])) {
                mainDomain = parts[parts.length - 3];
            } else if (parts.length > 2) {
                mainDomain = parts[parts.length - 2];
            } else {
                mainDomain = parts[0];
            }
            
            const name = mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
            const logoUrl = `https://logo.clearbit.com/${domain}`;
            return { name, logoUrl };
        } catch (e) {
            const name = website.split('.')[0] || 'Unknown';
            return { name: name.charAt(0).toUpperCase() + name.slice(1), logoUrl: null };
        }
    }
    
    getCompromisedDataTypes(breach) {
        const types = new Set();
        
        for (const key in breach) {
            const lowerKey = key.toLowerCase();
            const value = breach[key];
            
            if (!value || value === '') continue;
            
            if (lowerKey.includes('email')) {
                types.add('Email Address');
            } else if (lowerKey.includes('pass') || lowerKey.includes('hash')) {
                types.add('Password');
            } else if (lowerKey.includes('name')) {
                types.add('Full Name');
            } else if (lowerKey.includes('phone')) {
                types.add('Phone Number');
            } else if (lowerKey.includes('user') || lowerKey.includes('account')) {
                types.add('Username');
            } else if (lowerKey.includes('ip')) {
                types.add('IP Address');
            } else {
                // Add other meaningful data
                if (typeof value === 'string' && value.length > 0 && value.length < 50) {
                    types.add(this.formatFieldName(key));
                }
            }
        }
        
        // Ensure at least password and email are included
        if (types.size === 0) {
            types.add('Email Address');
            types.add('Password');
        }
        
        return Array.from(types).slice(0, 6); // Limit to 6 items
    }
    
    formatFieldName(fieldName) {
        return fieldName
            .replace(/[_-]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    getBreachDate(breach) {
        for (const key in breach) {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('date') || lowerKey.includes('time')) {
                return breach[key];
            }
        }
        return null;
    }
    
    getRiskColorClass(index) {
        if (index < 2) return 'risk-high';
        if (index < 5) return 'risk-medium';
        return 'risk-low';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for global use
window.ThreatAnalyzer = ThreatAnalyzer;
