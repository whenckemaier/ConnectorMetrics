import https from 'https';
import { updateStatuspage } from '../src/utils/statuspage.js';

jest.mock('https');

test('should update statuspage successfully', async () => {
  const mockResponse = {
    on: jest.fn((event, callback) => {
      if (event === 'data') callback();
      if (event === 'end') callback();
    }),
    statusCode: 200,
  };

  https.request.mockImplementation((url, options, callback) => {
    callback(mockResponse);
    return {
      write: jest.fn(),
      end: jest.fn(),
      on: jest.fn(),
    };
  });

  const metricId = 'test-metric-id';
  const metricData = { data: { timestamp: 1234567890, value: 1.23 } };
  const apiKey = 'test-api-key';
  const pageId = 'test-page-id';

  await expect(updateStatuspage(metricId, metricData, apiKey, pageId)).resolves.not.toThrow();
});