import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Trash2, Eye, EyeOff } from 'lucide-react';

const AuthDebugPage: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    logout,
    logoutWithoutNavigation,
    forceAuthCleanup,
  } = useAuth();
  const [sessionData, setSessionData] = useState<{ user: unknown; session: unknown } | null>(null);
  const [storageData, setStorageData] = useState<Record<string, unknown>>({});
  const [showSensitive, setShowSensitive] = useState(false);

  const refreshSessionData = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      setSessionData({ session, error });
    } catch (err) {
      setSessionData({ error: err });
    }
  };

  const refreshStorageData = () => {
    const localStorage = {};
    const sessionStorage = {};

    // Get all localStorage items
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        localStorage[key] = window.localStorage.getItem(key);
      }
    }

    // Get all sessionStorage items
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key) {
        sessionStorage[key] = window.sessionStorage.getItem(key);
      }
    }

    setStorageData({ localStorage, sessionStorage });
  };

  const clearAllStorage = () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    refreshStorageData();
  };

  const clearSupabaseStorage = () => {
    // Clear Supabase-specific storage
    Object.keys(window.localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        window.localStorage.removeItem(key);
      }
    });
    Object.keys(window.sessionStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        window.sessionStorage.removeItem(key);
      }
    });
    refreshStorageData();
  };

  useEffect(() => {
    refreshSessionData();
    refreshStorageData();
  }, []);

  const formatValue = (value: unknown) => {
    if (typeof value === 'string') {
      try {
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch {
        return value;
      }
    }
    return JSON.stringify(value, null, 2);
  };

  const maskSensitiveData = (key: string, value: string) => {
    const sensitiveKeys = ['token', 'access_token', 'refresh_token', 'password', 'secret', 'key'];
    if (!showSensitive && sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      return '***HIDDEN***';
    }
    return value;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Authentication Debug</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowSensitive(!showSensitive)} variant="outline" size="sm">
            {showSensitive ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showSensitive ? 'Hide' : 'Show'} Sensitive
          </Button>
          <Button
            onClick={() => {
              refreshSessionData();
              refreshStorageData();
            }}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Auth Hook State */}
      <Card>
        <CardHeader>
          <CardTitle>useAuth Hook State</CardTitle>
          <CardDescription>Current state from the useAuth hook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Authenticated</label>
              <Badge variant={isAuthenticated ? 'default' : 'secondary'}>
                {isAuthenticated ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Loading</label>
              <Badge variant={isLoading ? 'destructive' : 'secondary'}>
                {isLoading ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Initialized</label>
              <Badge variant={isInitialized ? 'default' : 'secondary'}>
                {isInitialized ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium">User</label>
              <Badge variant={user ? 'default' : 'secondary'}>{user ? 'Present' : 'Null'}</Badge>
            </div>
          </div>

          {user && (
            <div className="mt-4">
              <label className="text-sm font-medium">User Details</label>
              <pre className="mt-2 p-3 bg-muted rounded text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supabase Session */}
      <Card>
        <CardHeader>
          <CardTitle>Supabase Session</CardTitle>
          <CardDescription>Current session from Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-3 bg-muted rounded text-sm overflow-auto max-h-96">
            {formatValue(sessionData)}
          </pre>
        </CardContent>
      </Card>

      {/* Storage Data */}
      <Card>
        <CardHeader>
          <CardTitle>Browser Storage</CardTitle>
          <CardDescription>localStorage and sessionStorage contents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={clearSupabaseStorage} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Supabase Storage
            </Button>
            <Button onClick={clearAllStorage} variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Storage
            </Button>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">localStorage</h3>
              <div className="space-y-2 max-h-96 overflow-auto">
                {Object.entries(storageData.localStorage || {}).map(([key, value]) => (
                  <div key={key} className="p-2 bg-muted rounded">
                    <div className="font-mono text-sm font-medium">{key}</div>
                    <div className="font-mono text-xs text-muted-foreground mt-1 break-all">
                      {maskSensitiveData(key, value as string)}
                    </div>
                  </div>
                ))}
                {Object.keys(storageData.localStorage || {}).length === 0 && (
                  <div className="text-muted-foreground text-sm">No localStorage data</div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">sessionStorage</h3>
              <div className="space-y-2 max-h-96 overflow-auto">
                {Object.entries(storageData.sessionStorage || {}).map(([key, value]) => (
                  <div key={key} className="p-2 bg-muted rounded">
                    <div className="font-mono text-sm font-medium">{key}</div>
                    <div className="font-mono text-xs text-muted-foreground mt-1 break-all">
                      {maskSensitiveData(key, value as string)}
                    </div>
                  </div>
                ))}
                {Object.keys(storageData.sessionStorage || {}).length === 0 && (
                  <div className="text-muted-foreground text-sm">No sessionStorage data</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Test authentication actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {isAuthenticated && (
              <>
                <Button
                  onClick={async () => {
                    console.log('🚪 Debug page logout button clicked!');
                    try {
                      await logout();
                      console.log('✅ Debug page logout completed');
                    } catch (error) {
                      console.error('❌ Debug page logout failed:', error);
                    }
                  }}
                  variant="destructive"
                >
                  Logout
                </Button>
                <Button onClick={forceAuthCleanup} variant="destructive">
                  Force Auth Cleanup
                </Button>
                <Button
                  onClick={async () => {
                    console.log('🧪 Testing simple logout without navigation...');
                    try {
                      await logoutWithoutNavigation();
                      console.log('✅ Simple logout completed');
                    } catch (error) {
                      console.error('❌ Simple logout failed:', error);
                    }
                  }}
                  variant="outline"
                >
                  Simple Logout (No Nav)
                </Button>
                <Button
                  onClick={async () => {
                    console.log('🧪 Testing Supabase signOut directly...');
                    try {
                      const { error } = await supabase.auth.signOut();
                      if (error) {
                        console.error('❌ Direct signOut failed:', error);
                      } else {
                        console.log('✅ Direct signOut successful');
                      }
                    } catch (error) {
                      console.error('❌ Direct signOut error:', error);
                    }
                  }}
                  variant="outline"
                >
                  Test Direct SignOut
                </Button>
              </>
            )}
            <Button onClick={() => (window.location.href = '/auth')} variant="outline">
              Go to Auth Page
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthDebugPage;
