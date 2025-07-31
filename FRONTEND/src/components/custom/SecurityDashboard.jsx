import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import MFASetup from './MFASetup';
import { toast } from "sonner";
import axios from "axios";

const SecurityDashboard = ({ user }) => {
  const [securityScore, setSecurityScore] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateSecurityScore();
    loadSecurityData();
  }, [user]);

  const calculateSecurityScore = () => {
    let score = 0;
    const recs = [];

    // Email verification
    if (user?.status === 'verified') {
      score += 20;
    } else {
      recs.push({
        type: 'warning',
        title: 'Verify your email',
        description: 'Email verification is required for account security.',
        action: 'Verify Email'
      });
    }

    // MFA enabled
    if (user?.mfaEnabled) {
      score += 30;
    } else {
      recs.push({
        type: 'high',
        title: 'Enable Multi-Factor Authentication',
        description: 'MFA provides an essential additional layer of security.',
        action: 'Enable MFA'
      });
    }

    // Password strength (assuming it's checked during registration)
    score += 20; // Base score for having a password

    // Profile completion
    if (user?.fullName && user?.phone) {
      score += 15;
    } else {
      recs.push({
        type: 'low',
        title: 'Complete your profile',
        description: 'A complete profile helps with account recovery.',
        action: 'Update Profile'
      });
    }

    // Recent activity
    score += 15; // Base score for account activity

    setSecurityScore(score);
    setRecommendations(recs);
  };

  const loadSecurityData = async () => {
    try {
      // In a real implementation, you'd load actual security data
      // For now, we'll simulate some data
      setLoginHistory([
        {
          id: 1,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          ip: '192.168.1.100',
          location: 'Current session',
          success: true,
          userAgent: 'Chrome 120.0'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          ip: '192.168.1.100',
          location: 'Same location',
          success: true,
          userAgent: 'Chrome 120.0'
        }
      ]);
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const handleMFAStatusChange = (enabled) => {
    // Update user state and recalculate security score
    if (user) {
      user.mfaEnabled = enabled;
      calculateSecurityScore();
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Security Score</CardTitle>
          <CardDescription>
            Your account security rating based on enabled features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className={`text-3xl font-bold ${getScoreColor(securityScore)}`}>
                {securityScore}/100
              </div>
              <div className="text-sm text-gray-500">
                {getScoreStatus(securityScore)}
              </div>
            </div>
            <div className="w-24 h-24">
              <div className="relative w-full h-full">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={getScoreColor(securityScore)}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${securityScore}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Security Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Email Verification</span>
              <Badge variant={user?.status === 'verified' ? 'default' : 'destructive'}>
                {user?.status === 'verified' ? 'Verified' : 'Pending'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Multi-Factor Authentication</span>
              <Badge variant={user?.mfaEnabled ? 'default' : 'destructive'}>
                {user?.mfaEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Strong Password</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span>Profile Complete</span>
              <Badge variant={user?.fullName && user?.phone ? 'default' : 'secondary'}>
                {user?.fullName && user?.phone ? 'Complete' : 'Partial'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Security Recommendations</CardTitle>
            <CardDescription>
              Improve your account security with these suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => (
              <Alert key={index} variant={rec.type === 'high' ? 'destructive' : 'default'}>
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <strong>{rec.title}</strong>
                      <p className="text-sm mt-1">{rec.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {rec.action}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* MFA Setup */}
      <MFASetup user={user} onMFAStatusChange={handleMFAStatusChange} />

      {/* Recent Login Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Login Activity</CardTitle>
          <CardDescription>
            Monitor your recent account access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loginHistory.map((login, index) => (
              <div key={login.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${login.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">{login.location}</span>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(login.timestamp)} • {login.ip} • {login.userAgent}
                    </div>
                  </div>
                  <Badge variant={login.success ? 'default' : 'destructive'}>
                    {login.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
                {index < loginHistory.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Notice suspicious activity?
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              If you notice any login attempts that weren't made by you, please change your password immediately and enable MFA.
            </p>
            <Button variant="outline" size="sm">
              Report Suspicious Activity
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Security Best Practices</CardTitle>
          <CardDescription>
            Keep your account secure with these tips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Password Security</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Use a unique password for this account</li>
                <li>• Include uppercase, lowercase, numbers, and symbols</li>
                <li>• Avoid personal information in passwords</li>
                <li>• Change passwords if you suspect compromise</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Account Protection</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Enable multi-factor authentication</li>
                <li>• Keep your email address secure</li>
                <li>• Log out from public computers</li>
                <li>• Review login activity regularly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;