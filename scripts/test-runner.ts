#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

interface TestResult {
  suite: string;
  passed: number;
  failed: number;
  total: number;
  duration: number;
  errors: string[];
}

interface TestReport {
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    duration: number;
    coverage?: {
      lines: number;
      functions: number;
      branches: number;
      statements: number;
    };
  };
  suites: TestResult[];
  timestamp: string;
}

class TestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  async runAllTests(): Promise<TestReport> {
    console.log('🚀 Starting comprehensive test suite...\n');

    const testSuites = [
      {
        name: 'Route Tests',
        pattern: 'src/test/routes.test.tsx',
        description: 'Testing all route rendering and navigation'
      },
      {
        name: 'Authentication Tests',
        pattern: 'src/test/auth-flow.test.tsx',
        description: 'Testing authentication flows and protected routes'
      },
      {
        name: 'Component Tests',
        pattern: 'src/test/components.test.tsx',
        description: 'Testing UI components and interactions'
      },
      {
        name: 'Integration Tests',
        pattern: 'src/test/integration.test.tsx',
        description: 'Testing full user journeys and navigation flows'
      }
    ];

    for (const suite of testSuites) {
      console.log(`📋 Running ${suite.name}...`);
      console.log(`   ${suite.description}`);
      
      try {
        await this.runTestSuite(suite.name, suite.pattern);
        console.log(`✅ ${suite.name} completed\n`);
      } catch (error) {
        console.log(`❌ ${suite.name} failed\n`);
        this.results.push({
          suite: suite.name,
          passed: 0,
          failed: 1,
          total: 1,
          duration: 0,
          errors: [error as string]
        });
      }
    }

    return this.generateReport();
  }

  private async runTestSuite(suiteName: string, pattern: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      const command = `npx vitest run ${pattern} --reporter=json --reporter=verbose`;
      const output = execSync(command, { 
        encoding: 'utf-8',
        stdio: 'pipe'
      });

      const duration = Date.now() - startTime;
      
      // Parse test results (simplified)
      const lines = output.split('\n');
      const passedLine = lines.find(line => line.includes('passed'));
      const failedLine = lines.find(line => line.includes('failed'));
      
      const passed = passedLine ? parseInt(passedLine.match(/(\d+)/)?.[1] || '0') : 0;
      const failed = failedLine ? parseInt(failedLine.match(/(\d+)/)?.[1] || '0') : 0;

      this.results.push({
        suite: suiteName,
        passed,
        failed,
        total: passed + failed,
        duration,
        errors: []
      });

    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      this.results.push({
        suite: suiteName,
        passed: 0,
        failed: 1,
        total: 1,
        duration,
        errors: [error.message || 'Unknown error']
      });
    }
  }

  private generateReport(): TestReport {
    const totalDuration = Date.now() - this.startTime;
    const totalTests = this.results.reduce((sum, result) => sum + result.total, 0);
    const passedTests = this.results.reduce((sum, result) => sum + result.passed, 0);
    const failedTests = this.results.reduce((sum, result) => sum + result.failed, 0);

    const report: TestReport = {
      summary: {
        totalTests,
        passedTests,
        failedTests,
        duration: totalDuration
      },
      suites: this.results,
      timestamp: new Date().toISOString()
    };

    return report;
  }

  async generateTestReport(report: TestReport): Promise<void> {
    // Ensure reports directory exists
    const reportsDir = 'test-reports';
    if (!existsSync(reportsDir)) {
      mkdirSync(reportsDir, { recursive: true });
    }

    // Generate JSON report
    const jsonReport = join(reportsDir, 'test-results.json');
    writeFileSync(jsonReport, JSON.stringify(report, null, 2));

    // Generate HTML report
    const htmlReport = this.generateHtmlReport(report);
    const htmlReportPath = join(reportsDir, 'test-results.html');
    writeFileSync(htmlReportPath, htmlReport);

    console.log(`📊 Test reports generated:`);
    console.log(`   JSON: ${jsonReport}`);
    console.log(`   HTML: ${htmlReportPath}`);
  }

  private generateHtmlReport(report: TestReport): string {
    const { summary, suites } = report;
    const successRate = Math.round((summary.passedTests / summary.totalTests) * 100);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upzy Test Results</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #2563eb; margin: 0; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .metric.success { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); }
        .metric.warning { background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%); }
        .metric.error { background: linear-gradient(135deg, #ff5722 0%, #e53935 100%); }
        .metric-value { font-size: 2.5rem; font-weight: bold; margin: 0; }
        .metric-label { font-size: 0.9rem; opacity: 0.9; margin: 5px 0 0 0; }
        .suites { display: grid; gap: 20px; }
        .suite { border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .suite-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #e0e0e0; }
        .suite-name { font-weight: 600; color: #333; margin: 0; }
        .suite-stats { padding: 15px; }
        .stat-bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; margin: 10px 0; }
        .stat-passed { background: #4caf50; }
        .stat-failed { background: #f44336; }
        .errors { margin-top: 15px; }
        .error { background: #ffebee; border-left: 4px solid #f44336; padding: 10px; margin: 5px 0; font-family: monospace; font-size: 0.9rem; }
        .timestamp { text-align: center; color: #666; margin-top: 30px; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Upzy Test Results</h1>
            <p>Comprehensive route and component testing</p>
        </div>
        
        <div class="summary">
            <div class="metric ${successRate >= 90 ? 'success' : successRate >= 70 ? 'warning' : 'error'}">
                <p class="metric-value">${successRate}%</p>
                <p class="metric-label">Success Rate</p>
            </div>
            <div class="metric">
                <p class="metric-value">${summary.totalTests}</p>
                <p class="metric-label">Total Tests</p>
            </div>
            <div class="metric success">
                <p class="metric-value">${summary.passedTests}</p>
                <p class="metric-label">Passed</p>
            </div>
            <div class="metric error">
                <p class="metric-value">${summary.failedTests}</p>
                <p class="metric-label">Failed</p>
            </div>
            <div class="metric">
                <p class="metric-value">${Math.round(summary.duration / 1000)}s</p>
                <p class="metric-label">Duration</p>
            </div>
        </div>

        <div class="suites">
            ${suites.map(suite => `
                <div class="suite">
                    <div class="suite-header">
                        <h3 class="suite-name">${suite.suite}</h3>
                    </div>
                    <div class="suite-stats">
                        <p><strong>Tests:</strong> ${suite.total} | <strong>Passed:</strong> ${suite.passed} | <strong>Failed:</strong> ${suite.failed} | <strong>Duration:</strong> ${Math.round(suite.duration / 1000)}s</p>
                        <div class="stat-bar">
                            <div class="stat-passed" style="width: ${(suite.passed / suite.total) * 100}%"></div>
                            <div class="stat-failed" style="width: ${(suite.failed / suite.total) * 100}%"></div>
                        </div>
                        ${suite.errors.length > 0 ? `
                            <div class="errors">
                                <h4>Errors:</h4>
                                ${suite.errors.map(error => `<div class="error">${error}</div>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="timestamp">
            Generated on ${new Date(report.timestamp).toLocaleString()}
        </div>
    </div>
</body>
</html>`;
  }

  printSummary(report: TestReport): void {
    const { summary } = report;
    const successRate = Math.round((summary.passedTests / summary.totalTests) * 100);

    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${summary.passedTests}`);
    console.log(`❌ Failed: ${summary.failedTests}`);
    console.log(`📊 Total:  ${summary.totalTests}`);
    console.log(`⚡ Success Rate: ${successRate}%`);
    console.log(`⏱️  Duration: ${Math.round(summary.duration / 1000)}s`);
    console.log('='.repeat(60));

    if (summary.failedTests > 0) {
      console.log('\n⚠️  Some tests failed. Check the detailed report for more information.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed! Your routes are working perfectly.');
    }
  }
}

// Run the test suite
async function main() {
  const runner = new TestRunner();
  
  try {
    const report = await runner.runAllTests();
    await runner.generateTestReport(report);
    runner.printSummary(report);
  } catch (error) {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  }
}

// Run only if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

export { TestRunner, TestResult, TestReport }; 