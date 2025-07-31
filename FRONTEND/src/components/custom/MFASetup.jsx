import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";

const MFASetup = ({ user, onMFAStatusChange }) => {
  const [step, setStep] = useState('setup'); // 'setup', 'verify', 'complete'
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setupMFA = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mfa/setup`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setQrCode(response.data.qrCode);
        setSecret(response.data.secret);
        setStep('verify');
        toast.success('MFA setup initialized. Scan the QR code with your authenticator app.');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to setup MFA';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnableMFA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mfa/enable`,
        { token: verificationCode },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setBackupCodes(response.data.backupCodes);
        setStep('complete');
        toast.success('MFA enabled successfully!');
        onMFAStatusChange?.(true);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to verify MFA code';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const disableMFA = async () => {
    const password = prompt('Enter your password to disable MFA:');
    const mfaToken = prompt('Enter your current MFA code:');
    
    if (!password || !mfaToken) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mfa/disable`,
        { password, mfaToken },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success('MFA disabled successfully');
        onMFAStatusChange?.(false);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to disable MFA';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const generateNewBackupCodes = async () => {
    const password = prompt('Enter your password:');
    const mfaToken = prompt('Enter your current MFA code:');
    
    if (!password || !mfaToken) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mfa/backup-codes`,
        { password, mfaToken },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setBackupCodes(response.data.backupCodes);
        toast.success('New backup codes generated');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate backup codes';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (user?.mfaEnabled && step === 'setup') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Multi-Factor Authentication
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Enabled
            </Badge>
          </CardTitle>
          <CardDescription>
            Your account is secured with two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              MFA is currently enabled on your account. This adds an extra layer of security by requiring a code from your authenticator app when you log in.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={generateNewBackupCodes}
              disabled={loading}
            >
              Generate New Backup Codes
            </Button>
            <Button 
              variant="destructive" 
              onClick={disableMFA}
              disabled={loading}
            >
              Disable MFA
            </Button>
          </div>
          
          {backupCodes.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">New Backup Codes:</h4>
              <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                {backupCodes.map((code, index) => (
                  <code key={index} className="block text-sm font-mono">
                    {code}
                  </code>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Save these codes in a secure location. Each code can only be used once.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enable Multi-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'setup' && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Multi-factor authentication (MFA) significantly increases your account security by requiring a second form of verification when you log in.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h4 className="font-semibold">What you'll need:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                <li>An authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>Your current password</li>
                <li>Access to your registered email</li>
              </ul>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button onClick={setupMFA} disabled={loading} className="w-full">
              {loading ? 'Setting up...' : 'Set Up MFA'}
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Scan QR Code</h4>
              <p className="text-sm text-gray-600 mb-4">
                Use your authenticator app to scan this QR code:
              </p>
              {qrCode && (
                <img 
                  src={qrCode} 
                  alt="MFA QR Code" 
                  className="mx-auto border rounded"
                />
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Or enter this key manually:</h4>
              <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm break-all">
                {secret}
              </code>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verification-code">
                Enter the 6-digit code from your authenticator app:
              </Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('setup')}>
                Back
              </Button>
              <Button 
                onClick={verifyAndEnableMFA} 
                disabled={loading || verificationCode.length !== 6}
                className="flex-1"
              >
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                🎉 MFA has been successfully enabled on your account!
              </AlertDescription>
            </Alert>
            
            <div>
              <h4 className="font-semibold mb-2">Important: Save Your Backup Codes</h4>
              <p className="text-sm text-gray-600 mb-3">
                These backup codes can be used to access your account if you lose your authenticator device. 
                Each code can only be used once.
              </p>
              
              <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                {backupCodes.map((code, index) => (
                  <code key={index} className="block text-sm font-mono">
                    {code}
                  </code>
                ))}
              </div>
              
              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>⚠️ Important:</strong> Store these codes in a secure location (like a password manager). 
                  Do not share them with anyone.
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                setStep('setup');
                setQrCode('');
                setSecret('');
                setVerificationCode('');
                setBackupCodes([]);
              }} 
              className="w-full"
            >
              Done
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MFASetup;