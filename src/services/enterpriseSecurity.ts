// Enterprise security and compliance service
import { Workflow, User } from '@/types/workflow';

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  type: 'access_control' | 'data_protection' | 'audit' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  rules: SecurityRule[];
  compliance: ComplianceFramework[];
}

export interface SecurityRule {
  id: string;
  condition: string;
  action: 'allow' | 'deny' | 'require_approval' | 'log' | 'encrypt';
  parameters: Record<string, unknown>;
}

export interface ComplianceFramework {
  name: 'SOC2' | 'GDPR' | 'HIPAA' | 'PCI_DSS' | 'ISO27001' | 'CCPA';
  requirements: string[];
  status: 'compliant' | 'non_compliant' | 'partial' | 'unknown';
}

export interface SecurityAudit {
  id: string;
  timestamp: string;
  userId: string;
  workflowId?: string;
  action: string;
  resource: string;
  result: 'success' | 'failure' | 'blocked';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
}

export interface SecurityAssessment {
  workflowId: string;
  assessmentDate: string;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  vulnerabilities: SecurityVulnerability[];
  complianceStatus: Record<string, ComplianceFramework>;
  recommendations: SecurityRecommendation[];
  score: number; // 0-100
}

export interface SecurityVulnerability {
  id: string;
  type: 'data_exposure' | 'access_control' | 'encryption' | 'audit_trail' | 'input_validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  remediation: string;
  nodeId?: string;
  cve?: string;
}

export interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  implementation: {
    steps: string[];
    estimatedTime: string;
    requiredPermissions: string[];
  };
}

export class EnterpriseSecurityService {
  private static instance: EnterpriseSecurityService;
  private auditLog: SecurityAudit[] = [];
  private securityPolicies: SecurityPolicy[] = [];

  static getInstance(): EnterpriseSecurityService {
    if (!EnterpriseSecurityService.instance) {
      EnterpriseSecurityService.instance = new EnterpriseSecurityService();
      EnterpriseSecurityService.instance.initializeDefaultPolicies();
    }
    return EnterpriseSecurityService.instance;
  }

  private initializeDefaultPolicies(): void {
    this.securityPolicies = [
      {
        id: 'data-encryption',
        name: 'Data Encryption Policy',
        description: 'Ensure all sensitive data is encrypted in transit and at rest',
        type: 'data_protection',
        severity: 'critical',
        enabled: true,
        rules: [
          {
            id: 'encrypt-api-keys',
            condition: 'node.type === "api_connector" && node.config.apiKey',
            action: 'encrypt',
            parameters: { algorithm: 'AES-256-GCM' },
          },
        ],
        compliance: [
          { name: 'GDPR', requirements: ['Article 32'], status: 'compliant' },
          { name: 'SOC2', requirements: ['CC6.1'], status: 'compliant' },
        ],
      },
      {
        id: 'access-control',
        name: 'Role-Based Access Control',
        description: 'Enforce role-based access control for all workflow operations',
        type: 'access_control',
        severity: 'high',
        enabled: true,
        rules: [
          {
            id: 'admin-only-delete',
            condition: 'action === "delete" && resource === "workflow"',
            action: 'require_approval',
            parameters: { requiredRole: 'admin' },
          },
        ],
        compliance: [{ name: 'SOC2', requirements: ['CC6.2'], status: 'compliant' }],
      },
    ];
  }

  async assessWorkflowSecurity(workflow: Workflow): Promise<SecurityAssessment> {
    // Simulate security assessment
    await new Promise(resolve => setTimeout(resolve, 2000));

    const vulnerabilities = this.identifyVulnerabilities(workflow);
    const complianceStatus = this.checkCompliance(workflow);
    const recommendations = this.generateRecommendations(vulnerabilities);
    const score = this.calculateSecurityScore(vulnerabilities, complianceStatus);

    return {
      workflowId: workflow.id,
      assessmentDate: new Date().toISOString(),
      overallRisk: this.calculateOverallRisk(vulnerabilities),
      vulnerabilities,
      complianceStatus,
      recommendations,
      score,
    };
  }

  private identifyVulnerabilities(workflow: Workflow): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    const nodes = workflow.nodes || [];

    // Check for unencrypted API keys
    nodes.forEach(node => {
      if (node.type === 'api_connector' && node.data?.config?.apiKey) {
        vulnerabilities.push({
          id: `vuln-${node.id}-api-key`,
          type: 'data_exposure',
          severity: 'critical',
          title: 'Unencrypted API Key',
          description: 'API key is stored in plain text and could be exposed',
          impact: 'Unauthorized access to external services',
          remediation: 'Encrypt API key using secure key management',
          nodeId: node.id,
        });
      }
    });

    // Check for missing input validation
    const inputNodes = nodes.filter(
      node => node.type === 'webhook_trigger' || node.type === 'form_input'
    );

    inputNodes.forEach(node => {
      if (!node.data?.config?.validation) {
        vulnerabilities.push({
          id: `vuln-${node.id}-validation`,
          type: 'input_validation',
          severity: 'medium',
          title: 'Missing Input Validation',
          description: 'User input is not properly validated',
          impact: 'Potential injection attacks or data corruption',
          remediation: 'Implement comprehensive input validation',
          nodeId: node.id,
        });
      }
    });

    // Check for audit trail gaps
    if (!workflow.settings?.enableLogging) {
      vulnerabilities.push({
        id: 'vuln-audit-trail',
        type: 'audit_trail',
        severity: 'medium',
        title: 'Insufficient Audit Trail',
        description: 'Workflow execution is not being logged',
        impact: 'Inability to track security incidents or compliance violations',
        remediation: 'Enable comprehensive audit logging',
      });
    }

    return vulnerabilities;
  }

  private checkCompliance(workflow: Workflow): Record<string, ComplianceFramework> {
    return {
      GDPR: {
        name: 'GDPR',
        requirements: [
          'Data minimization',
          'Purpose limitation',
          'Storage limitation',
          'Security of processing',
        ],
        status: 'partial',
      },
      SOC2: {
        name: 'SOC2',
        requirements: [
          'Security controls',
          'Availability controls',
          'Processing integrity',
          'Confidentiality',
          'Privacy',
        ],
        status: 'compliant',
      },
      HIPAA: {
        name: 'HIPAA',
        requirements: ['Administrative safeguards', 'Physical safeguards', 'Technical safeguards'],
        status: 'non_compliant',
      },
    };
  }

  private generateRecommendations(
    vulnerabilities: SecurityVulnerability[]
  ): SecurityRecommendation[] {
    const recommendations: SecurityRecommendation[] = [];

    if (vulnerabilities.some(v => v.type === 'data_exposure')) {
      recommendations.push({
        id: 'rec-encryption',
        title: 'Implement End-to-End Encryption',
        description: 'Encrypt all sensitive data including API keys, credentials, and PII',
        priority: 'critical',
        effort: 'medium',
        implementation: {
          steps: [
            'Set up secure key management system',
            'Encrypt existing sensitive data',
            'Update workflows to use encrypted storage',
            'Implement key rotation policies',
          ],
          estimatedTime: '2-3 days',
          requiredPermissions: ['admin', 'security_officer'],
        },
      });
    }

    if (vulnerabilities.some(v => v.type === 'input_validation')) {
      recommendations.push({
        id: 'rec-validation',
        title: 'Enhance Input Validation',
        description: 'Implement comprehensive input validation and sanitization',
        priority: 'high',
        effort: 'low',
        implementation: {
          steps: [
            'Define validation schemas for all inputs',
            'Implement server-side validation',
            'Add input sanitization',
            'Set up validation error handling',
          ],
          estimatedTime: '1-2 days',
          requiredPermissions: ['developer', 'admin'],
        },
      });
    }

    return recommendations;
  }

  private calculateSecurityScore(
    vulnerabilities: SecurityVulnerability[],
    complianceStatus: Record<string, ComplianceFramework>
  ): number {
    let score = 100;

    // Deduct points for vulnerabilities
    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 8;
          break;
        case 'low':
          score -= 3;
          break;
      }
    });

    // Deduct points for compliance issues
    Object.values(complianceStatus).forEach(framework => {
      if (framework.status === 'non_compliant') {
        score -= 10;
      } else if (framework.status === 'partial') {
        score -= 5;
      }
    });

    return Math.max(0, score);
  }

  private calculateOverallRisk(
    vulnerabilities: SecurityVulnerability[]
  ): 'low' | 'medium' | 'high' | 'critical' {
    const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
    const highCount = vulnerabilities.filter(v => v.severity === 'high').length;

    if (criticalCount > 0) return 'critical';
    if (highCount > 2) return 'high';
    if (highCount > 0 || vulnerabilities.length > 5) return 'medium';
    return 'low';
  }

  async logSecurityEvent(event: Omit<SecurityAudit, 'id' | 'timestamp'>): Promise<void> {
    const auditEntry: SecurityAudit = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...event,
    };

    this.auditLog.push(auditEntry);

    // In a real implementation, this would be sent to a secure audit service
    console.log('Security event logged:', auditEntry);
  }

  async getAuditLog(filters?: {
    userId?: string;
    workflowId?: string;
    action?: string;
    riskLevel?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<SecurityAudit[]> {
    let filteredLog = [...this.auditLog];

    if (filters) {
      if (filters.userId) {
        filteredLog = filteredLog.filter(entry => entry.userId === filters.userId);
      }
      if (filters.workflowId) {
        filteredLog = filteredLog.filter(entry => entry.workflowId === filters.workflowId);
      }
      if (filters.action) {
        filteredLog = filteredLog.filter(entry => entry.action.includes(filters.action));
      }
      if (filters.riskLevel) {
        filteredLog = filteredLog.filter(entry => entry.riskLevel === filters.riskLevel);
      }
    }

    return filteredLog.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async enforceSecurityPolicy(
    action: string,
    resource: string,
    user: User,
    context: Record<string, unknown>
  ): Promise<{ allowed: boolean; reason?: string; requiresApproval?: boolean }> {
    const applicablePolicies = this.securityPolicies.filter(
      policy =>
        policy.enabled && this.evaluatePolicyConditions(policy, action, resource, user, context)
    );

    for (const policy of applicablePolicies) {
      for (const rule of policy.rules) {
        if (this.evaluateRuleCondition(rule.condition, { action, resource, user, ...context })) {
          switch (rule.action) {
            case 'deny':
              await this.logSecurityEvent({
                userId: user.id,
                action,
                resource,
                result: 'blocked',
                riskLevel: policy.severity,
                details: { policy: policy.name, rule: rule.id },
                ipAddress: context.ipAddress || 'unknown',
                userAgent: context.userAgent || 'unknown',
              });
              return { allowed: false, reason: `Blocked by policy: ${policy.name}` };

            case 'require_approval':
              return {
                allowed: false,
                requiresApproval: true,
                reason: `Requires approval per policy: ${policy.name}`,
              };

            case 'log':
              await this.logSecurityEvent({
                userId: user.id,
                action,
                resource,
                result: 'success',
                riskLevel: 'low',
                details: { policy: policy.name, rule: rule.id },
                ipAddress: context.ipAddress || 'unknown',
                userAgent: context.userAgent || 'unknown',
              });
              break;
          }
        }
      }
    }

    return { allowed: true };
  }

  private evaluatePolicyConditions(
    policy: SecurityPolicy,
    action: string,
    resource: string,
    user: User,
    context: Record<string, unknown>
  ): boolean {
    // Simple policy evaluation - in a real implementation, this would be more sophisticated
    return true;
  }

  private evaluateRuleCondition(condition: string, context: Record<string, unknown>): boolean {
    // Simple condition evaluation - in a real implementation, this would use a proper expression engine
    try {
      // This is a simplified evaluation - in production, use a secure expression evaluator
      const func = new Function(...Object.keys(context), `return ${condition}`);
      return func(...Object.values(context));
    } catch {
      return false;
    }
  }

  async generateComplianceReport(workflowIds: string[]): Promise<{
    reportId: string;
    generatedAt: string;
    frameworks: Record<
      string,
      {
        status: 'compliant' | 'non_compliant' | 'partial';
        score: number;
        issues: string[];
        recommendations: string[];
      }
    >;
    overallCompliance: number;
  }> {
    // Simulate compliance report generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    return {
      reportId: `compliance-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      frameworks: {
        GDPR: {
          status: 'partial',
          score: 75,
          issues: ['Missing data retention policies', 'Incomplete consent management'],
          recommendations: ['Implement automated data deletion', 'Add consent tracking'],
        },
        SOC2: {
          status: 'compliant',
          score: 95,
          issues: [],
          recommendations: ['Enhance monitoring capabilities'],
        },
        HIPAA: {
          status: 'non_compliant',
          score: 45,
          issues: ['Missing encryption', 'Insufficient access controls'],
          recommendations: ['Implement end-to-end encryption', 'Add role-based access control'],
        },
      },
      overallCompliance: 72,
    };
  }
}
