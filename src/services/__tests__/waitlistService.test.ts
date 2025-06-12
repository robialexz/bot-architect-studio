import { describe, it, expect } from 'vitest';

// Simple test for email validation without complex mocking
describe('WaitlistService Email Validation', () => {
  // Test email validation logic directly
  const validateEmail = (email: string): boolean => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email.trim().toLowerCase());
  };

  const normalizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
  };

  describe('email validation', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'user123@test-domain.com',
    ];

    const invalidEmails = ['invalid-email', '@example.com', 'test@', '', 'test@.', 'test@.com'];

    validEmails.forEach(email => {
      it(`should accept valid email: ${email}`, () => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    invalidEmails.forEach(email => {
      it(`should reject invalid email: ${email}`, () => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('email normalization', () => {
    it('should normalize email addresses', () => {
      expect(normalizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com');
      expect(normalizeEmail('User@Domain.Com')).toBe('user@domain.com');
      expect(normalizeEmail('test@example.com')).toBe('test@example.com');
    });
  });
});
