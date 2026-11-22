import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up to 50 virtual users
    { duration: '1m', target: 200 },  // Sustain 200 concurrent requests
    { duration: '30s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<250'], // 95% of requests must complete under 250ms
    http_req_failed: ['rate<0.01'],    // Error rate must be under 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api/v1';

export default function () {
  // 1. Dynamic Fare Estimate Request
  const estimatePayload = JSON.stringify({
    pickupLatitude: 12.9716,
    pickupLongitude: 77.5946,
    dropoffLatitude: 12.9352,
    dropoffLongitude: 77.6245,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const estimateRes = http.post(`${BASE_URL}/trips/estimate`, estimatePayload, params);
  check(estimateRes, {
    'estimate status is 200': (r) => r.status === 200,
    'estimate response has distance': (r) => r.json('data.distanceKm') !== undefined,
  });

  sleep(1);
}
