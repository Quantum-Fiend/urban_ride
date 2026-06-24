import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // ramp up
    { duration: '1m', target: 20 },  // stable load
    { duration: '10s', target: 0 },  // ramp down
  ],
};

export default function () {
  const res = http.get('http://localhost:8080/health');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
