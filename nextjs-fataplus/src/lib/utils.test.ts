import { formatPrice, truncateString, getInitials, isExternalUrl } from './utils';

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('formats price with default currency', () => {
      expect(formatPrice(1000)).toBe('1,000 Ar');
    });

    it('formats price with custom currency', () => {
      expect(formatPrice(1000, '$')).toBe('1,000 $');
    });

    it('handles zero', () => {
      expect(formatPrice(0)).toBe('0 Ar');
    });
  });

  describe('truncateString', () => {
    it('truncates string longer than specified length', () => {
      const longString = 'This is a very long string that needs to be truncated';
      expect(truncateString(longString, 20)).toBe('This is a very long ...');
    });

    it('does not truncate string shorter than specified length', () => {
      const shortString = 'Short string';
      expect(truncateString(shortString, 20)).toBe(shortString);
    });

    it('uses default length if not specified', () => {
      const longString = 'a'.repeat(150);
      expect(truncateString(longString)).toBe('a'.repeat(100) + '...');
    });
  });

  describe('getInitials', () => {
    it('returns initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('returns first letter from single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('returns empty string for empty name', () => {
      expect(getInitials('')).toBe('');
    });
  });

  describe('isExternalUrl', () => {
    it('identifies http URLs as external', () => {
      expect(isExternalUrl('http://example.com')).toBe(true);
    });

    it('identifies https URLs as external', () => {
      expect(isExternalUrl('https://example.com')).toBe(true);
    });

    it('identifies protocol-relative URLs as external', () => {
      expect(isExternalUrl('//example.com')).toBe(true);
    });

    it('identifies relative URLs as internal', () => {
      expect(isExternalUrl('/about')).toBe(false);
    });
  });
});
