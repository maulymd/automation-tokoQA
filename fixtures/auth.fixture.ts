import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const AUTH_DIR = path.resolve(__dirname, '../.auth');

setup('setup customer and admin auth state', async ({ request }) => {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  // 1. Customer login
  const customerUser = process.env.CUSTOMER_USER || 'customer';
  const customerPass = process.env.CUSTOMER_PASS || 'rahasia123';
  const customerRes = await request.post('/api/login', {
    data: { username: customerUser, password: customerPass },
  });
  if (customerRes.ok()) {
    const data = await customerRes.json();
    fs.writeFileSync(
      path.join(AUTH_DIR, 'customer.json'),
      JSON.stringify(
        {
          cookies: [],
          origins: [
            {
              origin: process.env.BASE_URL || 'https://playground.aminhamzah.com',
              localStorage: [
                {
                  name: 'tokoqa_token',
                  value: data.token,
                },
              ],
            },
          ],
        },
        null,
        2,
      ),
    );
  }

  // 2. Admin login
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'admin123';
  const adminRes = await request.post('/api/login', {
    data: { username: adminUser, password: adminPass },
  });
  if (adminRes.ok()) {
    const data = await adminRes.json();
    fs.writeFileSync(
      path.join(AUTH_DIR, 'admin.json'),
      JSON.stringify(
        {
          cookies: [],
          origins: [
            {
              origin: process.env.BASE_URL || 'https://playground.aminhamzah.com',
              localStorage: [
                {
                  name: 'tokoqa_token',
                  value: data.token,
                },
              ],
            },
          ],
        },
        null,
        2,
      ),
    );
  }
});
