import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AuthTestPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, isInitialized, login, logout } = useAuth();
  const [email, setEmail] = useState('robialexzi0@gmail.com');
  const [password, setPassword] = useState('');
  const [testResult, setTestResult] = useState<string>('');

  const handleTestLogin = async () => {
    try {
      setTestResult('Testing login...');
      const result = await login(email, password);
      setTestResult(`Login successful: ${result.email}`);
    } catch (error: unknown) {
      setTestResult(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleTestLogout = async () => {
    try {
      setTestResult('Testing logout...');
      await logout();
      setTestResult('Logout successful');
    } catch (error: unknown) {
      setTestResult(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Authentication Test Page</h1>

        {/* Auth State Display */}
        <Card>
          <CardHeader>
            <CardTitle>Current Authentication State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Is Authenticated:</strong>
                <Badge variant={isAuthenticated ? 'default' : 'secondary'} className="ml-2">
                  {isAuthenticated ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div>
                <strong>Is Loading:</strong>
                <Badge variant={isLoading ? 'destructive' : 'secondary'} className="ml-2">
                  {isLoading ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div>
                <strong>Is Initialized:</strong>
                <Badge variant={isInitialized ? 'default' : 'secondary'} className="ml-2">
                  {isInitialized ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div>
                <strong>User Email:</strong>
                <span className="ml-2">{user?.email || 'None'}</span>
              </div>
            </div>

            {user && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">User Details:</h3>
                <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleTestLogin} disabled={isLoading}>
                Test Login
              </Button>
              <Button onClick={handleTestLogout} variant="outline" disabled={isLoading}>
                Test Logout
              </Button>
            </div>

            {testResult && (
              <div className="p-4 bg-muted rounded-lg">
                <strong>Test Result:</strong> {testResult}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                Current URL: <code>{window.location.pathname}</code>
              </p>
              <p>Expected behavior:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>If authenticated: Should redirect to /account</li>
                <li>If not authenticated: Should stay on auth pages</li>
                <li>No rapid page switching should occur</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTestPage;
