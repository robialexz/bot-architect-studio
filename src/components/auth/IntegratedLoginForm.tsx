/**
 * Integrated Login Form
 * Works with both frontend and backend authentication systems
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useIntegratedAuth } from '@/hooks/useIntegratedAuth';
import { toast } from 'sonner';

interface IntegratedLoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  showRegisterLink?: boolean;
}

export function IntegratedLoginForm({ 
  onSuccess, 
  redirectTo,
  showRegisterLink = true 
}: IntegratedLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, authSystem, isUsingBackend } = useIntegratedAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || redirectTo || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login({ email, password });
      
      if (result) {
        toast.success(`Welcome back! Logged in via ${authSystem}`);
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/auth/register', { state: { from: location.state?.from } });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your FlowsyAI account
        </CardDescription>
        
        {/* Auth System Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          {isUsingBackend ? (
            <>
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Backend Authentication</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3 text-yellow-500" />
              <span>Frontend Authentication</span>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="current-password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>

          {showRegisterLink && (
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={handleRegisterClick}
                disabled={isLoading}
              >
                Sign up
              </Button>
            </div>
          )}

          {/* Forgot Password Link (only for backend auth) */}
          {isUsingBackend && (
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-normal text-sm text-muted-foreground"
                onClick={() => navigate('/auth/forgot-password')}
                disabled={isLoading}
              >
                Forgot your password?
              </Button>
            </div>
          )}
        </form>

        {/* Demo Credentials (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs">
              <div>Email: demo@flowsyai.com</div>
              <div>Password: demo123</div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => {
                setEmail('demo@flowsyai.com');
                setPassword('demo123');
              }}
              disabled={isLoading}
            >
              Use Demo Credentials
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
