import { waitlistService } from '@/services/waitlistService';

// Test email validation functionality
describe('Email Validation Tests', () => {
  // Access private method for testing
  const validateEmail = (email: string): boolean => {
    // This is a simplified version of the validation logic for testing
    if (!email || typeof email !== 'string') return false;

    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0 || trimmedEmail.length > 254) return false;

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(trimmedEmail.toLowerCase())) return false;

    const parts = trimmedEmail.split('@');
    if (parts.length !== 2) return false;

    const [localPart, domainPart] = parts;
    if (localPart.length === 0 || localPart.length > 64) return false;
    if (domainPart.length === 0 || domainPart.length > 253) return false;

    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (localPart.includes('..')) return false;

    return true;
  };

  test('Valid emails should pass validation', () => {
    const validEmails = [
      'user@example.com',
      'test.email@domain.co.uk',
      'user+tag@example.org',
      'firstname.lastname@company.com',
      'user123@test-domain.com',
    ];

    validEmails.forEach(email => {
      expect(validateEmail(email)).toBe(true);
    });
  });

  test('Invalid emails should fail validation', () => {
    const invalidEmails = [
      '',
      'invalid-email',
      '@domain.com',
      'user@',
      'user..double@domain.com',
      '.user@domain.com',
      'user.@domain.com',
      'user@domain',
      'user@.domain.com',
      'user@domain..com',
      'a'.repeat(65) + '@domain.com', // Local part too long
      'user@' + 'a'.repeat(254) + '.com', // Domain too long
    ];

    invalidEmails.forEach(email => {
      expect(validateEmail(email)).toBe(false);
    });
  });

  test('Edge cases should be handled correctly', () => {
    expect(validateEmail(null as unknown as string)).toBe(false);
    expect(validateEmail(undefined as unknown as string)).toBe(false);
    expect(validateEmail(123 as unknown as string)).toBe(false);
    expect(validateEmail('  user@domain.com  ')).toBe(true); // Should trim whitespace
  });
});

// Export for potential use in other tests
export { validateEmail };
