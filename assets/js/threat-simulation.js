// "What If?" Threat Simulation Engine
class ThreatSimulation {
    constructor() {
        this.currentScenario = null;
        this.isRunning = false;
        this.currentStep = 0;
        this.scenarios = this.defineScenarios();
        this.init();
    }

    init() {
        this.container = document.getElementById('simulation-theater');
        this.timeline = document.getElementById('simulation-timeline');
    }

    defineScenarios() {
        return {
            'credential-stuffing': {
                title: 'Credential Stuffing Attack',
                steps: [
                    {
                        title: 'Initial Compromise',
                        description: 'Attacker obtains your leaked LinkedIn password from a data breach',
                        scene: {
                            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3 class="typing-effect">🎯 Day 0: Your LinkedIn password "password123" is discovered...</h3>
                                    <p>A cybercriminal finds your credentials in a breach database sold on the dark web for $50.</p>
                                    <div style="margin-top: 2rem; font-family: monospace; font-size: 0.9rem; opacity: 0.8;">
                                        > Searching breach-db.txt...<br>
                                        > Found: john.doe@techcorp.com:password123<br>
                                        > Source: LinkedIn breach 2023-01-15
                                    </div>
                                </div>
                            `
                        }
                    },
                    {
                        title: 'Credential Testing',
                        description: 'Testing your password across multiple platforms',
                        scene: {
                            background: 'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>🔄 Day 1: Automated credential testing begins...</h3>
                                    <p>Bots test your LinkedIn password against 200+ popular platforms</p>
                                    <div style="margin-top: 2rem;">
                                        <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem;">
                                            <div>✅ Gmail.com - SUCCESS</div>
                                            <div>✅ GitHub.com - SUCCESS</div>
                                            <div>❌ Facebook.com - FAILED</div>
                                            <div>✅ Dropbox.com - SUCCESS</div>
                                            <div>❌ Twitter.com - FAILED</div>
                                            <div>✅ Slack.com - SUCCESS</div>
                                        </div>
                                        <p style="margin-top: 1rem; color: #e74c3c; font-weight: bold;">4/6 platforms compromised!</p>
                                    </div>
                                </div>
                            `
                        }
                    },
                    {
                        title: 'Account Takeover',
                        description: 'Gaining control of your critical accounts',
                        scene: {
                            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>⚠️ Day 2: Multiple account takeovers...</h3>
                                    <p>The attacker now controls your professional and personal digital life</p>
                                    <div style="margin-top: 2rem; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto;">
                                        <div style="margin-bottom: 1rem;">📧 <strong>Gmail:</strong> Monitoring all emails, password resets</div>
                                        <div style="margin-bottom: 1rem;">💻 <strong>GitHub:</strong> Accessing TechCorp's private repositories</div>
                                        <div style="margin-bottom: 1rem;">📁 <strong>Dropbox:</strong> Downloading sensitive documents</div>
                                        <div style="margin-bottom: 1rem;">💬 <strong>Slack:</strong> Reading internal company communications</div>
                                    </div>
                                </div>
                            `
                        }
                    },
                    {
                        title: 'Impact Escalation',
                        description: 'Maximum damage: Corporate espionage and data theft',
                        scene: {
                            background: 'linear-gradient(135deg, #2c3e50 0%, #e74c3c 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>💥 Day 7: Corporate espionage complete</h3>
                                    <p>Your compromised accounts become the gateway to TechCorp's crown jewels</p>
                                    <div style="margin-top: 2rem; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">
                                        <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px;">
                                            <div>🏢 <strong>Corporate Impact:</strong></div>
                                            <div style="margin-left: 1rem; margin-top: 0.5rem;">
                                                • Source code stolen from GitHub<br>
                                                • Client database accessed via Slack conversations<br>
                                                • API keys extracted from Dropbox documents<br>
                                                • Colleagues targeted through email impersonation
                                            </div>
                                            <div style="margin-top: 1rem; color: #e74c3c;">
                                                <strong>Total damage: $2.3M in IP theft + regulatory fines</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        }
                    }
                ]
            },
            'spear-phishing': {
                title: 'Spear Phishing Campaign',
                steps: [
                    {
                        title: 'Target Research',
                        description: 'Attacker builds detailed profile using breach data',
                        scene: {
                            background: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>🕵️ Research Phase: Building your digital dossier...</h3>
                                    <p>Using your LinkedIn breach data to create the perfect attack</p>
                                    <div style="margin-top: 2rem; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.9rem;">
                                        Target: John Doe<br>
                                        Position: Senior Software Engineer<br>
                                        Company: TechCorp Inc.<br>
                                        Location: San Francisco<br>
                                        Colleagues: 890 LinkedIn connections<br>
                                        Projects: React, Node.js, AWS<br>
                                        Recent: Promoted 6 months ago
                                    </div>
                                </div>
                            `
                        }
                    },
                    {
                        title: 'Crafted Attack',
                        description: 'Personalized phishing email created',
                        scene: {
                            background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>📧 Weaponized Email: Perfectly crafted for you...</h3>
                                    <div style="margin-top: 2rem; background: white; color: #2c3e50; padding: 2rem; border-radius: 10px; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                                        <div style="border-bottom: 1px solid #ddd; padding-bottom: 1rem; margin-bottom: 1rem;">
                                            <strong>From:</strong> hr-security@techcorp.com<br>
                                            <strong>To:</strong> john.doe@techcorp.com<br>
                                            <strong>Subject:</strong> 🚨 Urgent: GitHub Security Alert - Action Required
                                        </div>
                                        <p>Hi John,</p>
                                        <p>We detected suspicious activity on your GitHub account linked to TechCorp repositories. As a Senior Software Engineer, your access to our React and AWS projects requires immediate verification.</p>
                                        <p><strong>Click here to secure your account: </strong><span style="color: #3498db; text-decoration: underline;">github-security-verify.com</span></p>
                                        <p style="color: #e74c3c; font-size: 0.9rem; margin-top: 1rem;">⚠️ This email uses your real job title, company, and technology stack from LinkedIn!</p>
                                    </div>
                                </div>
                            `
                        }
                    },
                    {
                        title: 'Credential Harvest',
                        description: 'You unknowingly provide additional credentials',
                        scene: {
                            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>🎣 Success: Credentials harvested...</h3>
                                    <p>The fake GitHub security page captures your real GitHub password</p>
                                    <div style="margin-top: 2rem; background: rgba(0,0,0,0.4); padding: 1.5rem; border-radius: 10px; max-width: 500px; margin-left: auto; margin-right: auto;">
                                        <div style="margin-bottom: 1rem;">📊 <strong>Campaign Statistics:</strong></div>
                                        <div>• 1,247 TechCorp employees targeted</div>
                                        <div>• 23% opened the email (287 people)</div>
                                        <div>• 8% clicked the link (67 people)</div>
                                        <div>• 3% entered credentials (19 people)</div>
                                        <div style="margin-top: 1rem; color: #f1c40f;">
                                            <strong>You were one of the 19.</strong>
                                        </div>
                                    </div>
                                </div>
                            `
                        }
                    },
                    {
                        title: 'Corporate Infiltration',
                        description: 'Full compromise of TechCorp systems',
                        scene: {
                            background: 'linear-gradient(135deg, #2c3e50 0%, #8e44ad 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>🏢 Total Corporate Compromise</h3>
                                    <p>Your GitHub access becomes the key to TechCorp's entire infrastructure</p>
                                    <div style="margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; max-width: 800px; margin-left: auto; margin-right: auto;">
                                        <div style="background: rgba(231, 76, 60, 0.2); padding: 1rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
                                            <strong>Week 1:</strong><br>
                                            Source code stolen<br>
                                            API keys extracted<br>
                                            Customer database mapped
                                        </div>
                                        <div style="background: rgba(231, 76, 60, 0.3); padding: 1rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
                                            <strong>Week 2:</strong><br>
                                            Backdoors planted<br>
                                            Admin accounts created<br>
                                            Financial records accessed
                                        </div>
                                        <div style="background: rgba(231, 76, 60, 0.4); padding: 1rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
                                            <strong>Week 3:</strong><br>
                                            Data exfiltration<br>
                                            Ransomware deployed<br>
                                            Company reputation destroyed
                                        </div>
                                    </div>
                                    <div style="margin-top: 2rem; color: #f1c40f; font-size: 1.2rem;">
                                        <strong>All from one reused password.</strong>
                                    </div>
                                </div>
                            `
                        }
                    }
                ]
            },
            'social-engineering': {
                title: 'Social Engineering Attack',
                steps: [
                    {
                        title: 'Profile Building',
                        description: 'Gathering intelligence from social media',
                        scene: {
                            background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>📱 Social Media Reconnaissance</h3>
                                    <p>Your Facebook breach reveals personal details perfect for manipulation</p>
                                </div>
                            `
                        }
                    },
                    {
                        title: 'Trust Building',
                        description: 'Establishing false relationships',
                        scene: {
                            background: 'linear-gradient(135deg, #f39c12 0%, #d35400 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>🤝 Building False Trust</h3>
                                    <p>Attacker poses as a colleague using information from your breached accounts</p>
                                </div>
                            `
                        }
                    },
                    {
                        title: 'Information Extraction',
                        description: 'Manipulating you to reveal sensitive data',
                        scene: {
                            background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>🗣️ Psychological Manipulation</h3>
                                    <p>Using personal details to gain your trust and extract more information</p>
                                </div>
                            `
                        }
                    },
                    {
                        title: 'Full Exploitation',
                        description: 'Complete identity theft and corporate breach',
                        scene: {
                            background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>💀 Identity Theft Complete</h3>
                                    <p>Your personal trust becomes the key to corporate secrets</p>
                                </div>
                            `
                        }
                    }
                ]
            },
            'lateral-movement': {
                title: 'Corporate Lateral Movement',
                steps: [
                    {
                        title: 'Initial Foothold',
                        description: 'Gaining access through compromised credentials',
                        scene: {
                            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>🚪 Initial Access: Your GitHub Account</h3>
                                    <p>Attacker uses your leaked password to access TechCorp repositories</p>
                                </div>
                            `
                        }
                    },
                    {
                        title: 'Network Discovery',
                        description: 'Mapping internal corporate systems',
                        scene: {
                            background: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>🗺️ Network Reconnaissance</h3>
                                    <p>Using your GitHub access to discover internal systems and APIs</p>
                                </div>
                            `
                        }
                    },
                    {
                        title: 'Privilege Escalation',
                        description: 'Gaining administrative access',
                        scene: {
                            background: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>⬆️ Escalating Privileges</h3>
                                    <p>Your senior engineer access becomes administrative control</p>
                                </div>
                            `
                        }
                    },
                    {
                        title: 'Data Exfiltration',
                        description: 'Stealing corporate intellectual property',
                        scene: {
                            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                            content: `
                                <div class="scene-content">
                                    <h3>💾 Corporate Data Theft</h3>
                                    <p>Intellectual property worth millions stolen through your compromised account</p>
                                </div>
                            `
                        }
                    }
                ]
            }
        };
    }

    startSimulation() {
        const scenarioType = document.getElementById('attack-scenario').value;
        this.currentScenario = this.scenarios[scenarioType];
        this.currentStep = 0;
        this.isRunning = true;

        // Show timeline
        this.timeline.style.display = 'flex';
        
        // Reset timeline steps
        document.querySelectorAll('.timeline-step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index === 0) step.classList.add('active');
        });

        // Start the scenario
        this.playStep(0);
    }

    async playStep(stepIndex) {
        if (!this.isRunning || stepIndex >= this.currentScenario.steps.length) {
            this.completeSimulation();
            return;
        }

        const step = this.currentScenario.steps[stepIndex];
        
        // Update timeline
        this.updateTimeline(stepIndex);
        
        // Create and show scene
        this.showScene(step.scene);
        
        // Wait for scene duration
        await this.delay(5000); // 5 seconds per step
        
        // Move to next step
        this.currentStep++;
        this.playStep(stepIndex + 1);
    }

    showScene(scene) {
        this.container.innerHTML = '';
        
        const sceneDiv = document.createElement('div');
        sceneDiv.className = 'simulation-scene active';
        sceneDiv.style.background = scene.background;
        sceneDiv.innerHTML = scene.content;
        
        this.container.appendChild(sceneDiv);
    }

    updateTimeline(activeStep) {
        document.querySelectorAll('.timeline-step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index < activeStep) {
                step.classList.add('completed');
            } else if (index === activeStep) {
                step.classList.add('active');
            }
        });
    }

    completeSimulation() {
        this.isRunning = false;
        
        // Mark all steps as completed
        document.querySelectorAll('.timeline-step').forEach(step => {
            step.classList.remove('active');
            step.classList.add('completed');
        });
        
        // Show completion message
        this.container.innerHTML = `
            <div class="simulation-scene active" style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);">
                <div class="scene-content">
                    <h3>✅ Simulation Complete</h3>
                    <p>You've witnessed how a single breach can escalate into major corporate espionage.</p>
                    <div style="margin-top: 2rem;">
                        <button onclick="startSimulation()" style="padding: 1rem 2rem; background: rgba(255,255,255,0.2); color: white; border: 2px solid white; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                            <i class="fas fa-redo"></i>
                            Run Another Scenario
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global function to start simulation
function startSimulation() {
    if (!window.threatSimulation) {
        window.threatSimulation = new ThreatSimulation();
    }
    window.threatSimulation.startSimulation();
}

// Export for global use
window.ThreatSimulation = ThreatSimulation;
