import {
  cn,
  formatCurrency,
  formatAddress,
  formatDate,
  formatRelativeTime,
  isValidEmail,
  isValidWalletAddress,
  isValidPixKey,
  generateId,
  generateOrderId,
  generateTransactionId,
  debounce,
  throttle,
  copyToClipboard,
  downloadFile,
  getFileExtension,
  getFileSize,
  isValidImageFile,
  compressImage,
  sleep,
  retry,
  groupBy,
  sortBy,
  chunk,
  unique,
  capitalize,
  slugify,
  truncate,
  maskPixKey,
  validateCNPJ,
  formatCNPJ,
  formatCPF,
  formatPhone
} from '../utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
      expect(cn('class1', null, undefined, 'class2')).toBe('class1 class2');
      expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('R$ 1.000,00');
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
      expect(formatCurrency(0)).toBe('R$ 0,00');
      expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-1000)).toBe('-R$ 1.000,00');
    });
  });

  describe('formatAddress', () => {
    it('should format wallet address correctly', () => {
      const address = '0x1234567890123456789012345678901234567890';
      expect(formatAddress(address)).toBe('0x1234...7890');
      expect(formatAddress(address, 8)).toBe('0x12345678...12345678');
    });

    it('should handle short addresses', () => {
      expect(formatAddress('0x1234')).toBe('0x1234');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-12-25T10:30:00');
      expect(formatDate(date)).toBe('25/12/2023');
      expect(formatDate(date, 'en-US')).toBe('12/25/2023');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time correctly', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      expect(formatRelativeTime(oneHourAgo)).toContain('hora');
      expect(formatRelativeTime(oneDayAgo)).toContain('dia');
    });
  });

  describe('Validation Functions', () => {
    describe('isValidEmail', () => {
      it('should validate email correctly', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('invalid-email')).toBe(false);
        expect(isValidEmail('')).toBe(false);
        expect(isValidEmail('test@')).toBe(false);
      });
    });

    describe('isValidWalletAddress', () => {
      it('should validate wallet address correctly', () => {
        expect(isValidWalletAddress('0x1234567890123456789012345678901234567890')).toBe(true);
        expect(isValidWalletAddress('0x1234')).toBe(false);
        expect(isValidWalletAddress('invalid')).toBe(false);
        expect(isValidWalletAddress('')).toBe(false);
      });
    });

    describe('isValidPixKey', () => {
      it('should validate PIX key correctly', () => {
        expect(isValidPixKey('test@example.com')).toBe(true);
        expect(isValidPixKey('12345678901')).toBe(true);
        expect(isValidPixKey('invalid')).toBe(false);
        expect(isValidPixKey('')).toBe(false);
      });
    });

    describe('validateCNPJ', () => {
      it('should validate CNPJ correctly', () => {
        expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
        expect(validateCNPJ('11222333000181')).toBe(true);
        expect(validateCNPJ('11.222.333/0001-82')).toBe(false);
        expect(validateCNPJ('invalid')).toBe(false);
      });
    });
  });

  describe('ID Generation', () => {
    describe('generateId', () => {
      it('should generate unique IDs', () => {
        const id1 = generateId();
        const id2 = generateId();
        expect(id1).not.toBe(id2);
        expect(id1).toMatch(/^[a-zA-Z0-9]{8}$/);
      });
    });

    describe('generateOrderId', () => {
      it('should generate order IDs', () => {
        const orderId = generateOrderId();
        expect(orderId).toMatch(/^ORD-\d{8}-[A-Z0-9]{6}$/);
      });
    });

    describe('generateTransactionId', () => {
      it('should generate transaction IDs', () => {
        const txId = generateTransactionId();
        expect(txId).toMatch(/^TXN-\d{8}-[A-Z0-9]{8}$/);
      });
    });
  });

  describe('Performance Functions', () => {
    describe('debounce', () => {
      it('should debounce function calls', (done) => {
        let callCount = 0;
        const debouncedFn = debounce(() => {
          callCount++;
        }, 100);

        debouncedFn();
        debouncedFn();
        debouncedFn();

        setTimeout(() => {
          expect(callCount).toBe(1);
          done();
        }, 150);
      });
    });

    describe('throttle', () => {
      it('should throttle function calls', (done) => {
        let callCount = 0;
        const throttledFn = throttle(() => {
          callCount++;
        }, 100);

        throttledFn();
        throttledFn();
        throttledFn();

        setTimeout(() => {
          expect(callCount).toBe(1);
          done();
        }, 50);
      });
    });
  });

  describe('File Functions', () => {
    describe('getFileExtension', () => {
      it('should get file extension', () => {
        expect(getFileExtension('file.jpg')).toBe('jpg');
        expect(getFileExtension('file.PNG')).toBe('png');
        expect(getFileExtension('file')).toBe('');
        expect(getFileExtension('file.name.ext')).toBe('ext');
      });
    });

    describe('getFileSize', () => {
      it('should format file size', () => {
        expect(getFileSize(1024)).toBe('1 KB');
        expect(getFileSize(1024 * 1024)).toBe('1 MB');
        expect(getFileSize(1024 * 1024 * 1024)).toBe('1 GB');
        expect(getFileSize(500)).toBe('500 B');
      });
    });

    describe('isValidImageFile', () => {
      it('should validate image files', () => {
        expect(isValidImageFile('image.jpg')).toBe(true);
        expect(isValidImageFile('image.png')).toBe(true);
        expect(isValidImageFile('image.gif')).toBe(true);
        expect(isValidImageFile('document.pdf')).toBe(false);
        expect(isValidImageFile('')).toBe(false);
      });
    });

    describe('compressImage', () => {
      it('should compress image', async () => {
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const compressed = await compressImage(file, 0.8);
        expect(compressed).toBeInstanceOf(File);
      });
    });
  });

  describe('Browser Functions', () => {
    describe('copyToClipboard', () => {
      it('should copy text to clipboard', async () => {
        const mockClipboard = {
          writeText: jest.fn().mockResolvedValue(undefined)
        };
        Object.assign(navigator, { clipboard: mockClipboard });

        await copyToClipboard('test text');
        expect(mockClipboard.writeText).toHaveBeenCalledWith('test text');
      });
    });

    describe('downloadFile', () => {
      it('should download file', () => {
        const mockLink = {
          href: '',
          download: '',
          click: jest.fn()
        };
        const mockCreateElement = jest.fn().mockReturnValue(mockLink);
        document.createElement = mockCreateElement;

        downloadFile('test content', 'test.txt');
        expect(mockCreateElement).toHaveBeenCalledWith('a');
        expect(mockLink.click).toHaveBeenCalled();
      });
    });
  });

  describe('Async Functions', () => {
    describe('sleep', () => {
      it('should sleep for specified time', async () => {
        const start = Date.now();
        await sleep(100);
        const end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(100);
      });
    });

    describe('retry', () => {
      it('should retry failed operations', async () => {
        let attempts = 0;
        const failingFn = jest.fn().mockImplementation(() => {
          attempts++;
          if (attempts < 3) throw new Error('Failed');
          return 'success';
        });

        const result = await retry(failingFn, 3, 100);
        expect(result).toBe('success');
        expect(failingFn).toHaveBeenCalledTimes(3);
      });

      it('should throw after max attempts', async () => {
        const failingFn = jest.fn().mockRejectedValue(new Error('Failed'));

        await expect(retry(failingFn, 2, 100)).rejects.toThrow('Failed');
        expect(failingFn).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Array Functions', () => {
    describe('groupBy', () => {
      it('should group array by key', () => {
        const items = [
          { id: 1, category: 'A' },
          { id: 2, category: 'B' },
          { id: 3, category: 'A' }
        ];

        const grouped = groupBy(items, 'category');
        expect(grouped).toEqual({
          A: [{ id: 1, category: 'A' }, { id: 3, category: 'A' }],
          B: [{ id: 2, category: 'B' }]
        });
      });
    });

    describe('sortBy', () => {
      it('should sort array by key', () => {
        const items = [
          { id: 3, name: 'C' },
          { id: 1, name: 'A' },
          { id: 2, name: 'B' }
        ];

        const sorted = sortBy(items, 'id');
        expect(sorted[0].id).toBe(1);
        expect(sorted[1].id).toBe(2);
        expect(sorted[2].id).toBe(3);
      });
    });

    describe('chunk', () => {
      it('should chunk array into smaller arrays', () => {
        const array = [1, 2, 3, 4, 5, 6];
        const chunks = chunk(array, 2);
        expect(chunks).toEqual([[1, 2], [3, 4], [5, 6]]);
      });
    });

    describe('unique', () => {
      it('should remove duplicates from array', () => {
        const array = [1, 2, 2, 3, 3, 4];
        const uniqueArray = unique(array);
        expect(uniqueArray).toEqual([1, 2, 3, 4]);
      });
    });
  });

  describe('String Functions', () => {
    describe('capitalize', () => {
      it('should capitalize first letter', () => {
        expect(capitalize('hello')).toBe('Hello');
        expect(capitalize('world')).toBe('World');
        expect(capitalize('')).toBe('');
      });
    });

    describe('slugify', () => {
      it('should create URL-friendly slug', () => {
        expect(slugify('Hello World')).toBe('hello-world');
        expect(slugify('Test & Special Characters!')).toBe('test-special-characters');
        expect(slugify('')).toBe('');
      });
    });

    describe('truncate', () => {
      it('should truncate string', () => {
        expect(truncate('Hello World', 5)).toBe('Hello...');
        expect(truncate('Short', 10)).toBe('Short');
        expect(truncate('', 5)).toBe('');
      });
    });
  });

  describe('Formatting Functions', () => {
    describe('maskPixKey', () => {
      it('should mask PIX key', () => {
        expect(maskPixKey('test@example.com')).toBe('t***@example.com');
        expect(maskPixKey('12345678901')).toBe('123***78901');
      });
    });

    describe('formatCNPJ', () => {
      it('should format CNPJ', () => {
        expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
        expect(formatCNPJ('11.222.333/0001-81')).toBe('11.222.333/0001-81');
      });
    });

    describe('formatCPF', () => {
      it('should format CPF', () => {
        expect(formatCPF('12345678901')).toBe('123.456.789-01');
        expect(formatCPF('123.456.789-01')).toBe('123.456.789-01');
      });
    });

    describe('formatPhone', () => {
      it('should format phone number', () => {
        expect(formatPhone('11999999999')).toBe('(11) 99999-9999');
        expect(formatPhone('1199999999')).toBe('(11) 9999-9999');
        expect(formatPhone('119999999')).toBe('(11) 9999-999');
      });
    });
  });
}); 