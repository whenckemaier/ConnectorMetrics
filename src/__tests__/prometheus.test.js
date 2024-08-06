import { getFormattedDateTime, getPrometheusData } from '../src/utils/prometheus.js';
import axios from 'axios';

jest.mock('axios');

test('should format date and time correctly', () => {
  const dateTime = getFormattedDateTime();
  expect(dateTime).toMatch(/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} (AM|PM)$/);
});

test('should fetch data from Prometheus', async () => {
  const mockResponse = {
    data: {
      data: {
        result: [{ value: [null, '1.234'] }],
      },
    },
  };

  axios.get.mockResolvedValue(mockResponse);
  const query = 'up';
  const prometheusUrl = 'http://localhost:9090/api/v1/query';
  const result = await getPrometheusData(query, prometheusUrl);

  expect(result).toEqual([{ value: [null, '1.234'] }]);
});