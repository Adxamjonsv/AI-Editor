// usage-tracker.js - Budgets, tokens, and cost tracking
const fs = require('fs');

class UsageTracker {
  constructor(configPath) {
    this.configPath = configPath;
  }

  getUsageData() {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        return {
          dailyBudget: data.dailyBudget || 20.0,
          monthlyBudget: data.monthlyBudget || 100.0,
          maxCostPerTask: data.maxCostPerTask || 5.0,
          providers: data.providers || {
            claude: { usage: { cost: 1.25, tokens: 45000, requests: 12 } },
            chatgpt: { usage: { cost: 0.85, tokens: 32000, requests: 9 } },
            gemini: { usage: { cost: 0.15, tokens: 18000, requests: 6 } },
            higgsfield: { usage: { cost: 3.50, tokens: 0, requests: 2 } }
          }
        };
      }
    } catch(e) {}
    return {
      dailyBudget: 20.0,
      monthlyBudget: 100.0,
      maxCostPerTask: 5.0,
      providers: {}
    };
  }
}

module.exports = UsageTracker;
