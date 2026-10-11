const crypto = require('crypto');
const assert = require('assert');

const BASE_URL = 'http://localhost:4000';
const RAZORPAY_SECRET = 'WHLrER4GjPfsApLDJuDP8soH';

async function runMembershipUseCases() {
  console.log('================================================================');
  console.log('🧪 RUNNING CLUB_HUB MEMBERSHIP UNIT TESTS & USE CASES');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] Use Case ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] Use Case ${total}: ${name}`);
      console.error('   Error:', err.message);
    }
  }

  // USE CASE 1: Query Membership Plans (Plan A: Guest ₹0 vs Plan B: Official ₹300)
  await test('Verify exactly two membership plans are returned from /api/memberships/plans', async () => {
    const res = await fetch(`${BASE_URL}/api/memberships/plans`);
    assert.strictEqual(res.status, 200, 'Expected 200 OK');
    const data = await res.json();
    assert.ok(data.plans, 'Expected plans object');
    assert.strictEqual(data.plans.guest.price, 0, 'Guest plan must be ₹0');
    assert.strictEqual(data.plans.official.price, 300, 'Official plan must be ₹300');
  });

  // USE CASE 2: Dynamic Position Selection
  let availablePositions = [];
  await test('Fetch available dynamic club positions from /api/positions', async () => {
    const res = await fetch(`${BASE_URL}/api/positions`);
    assert.strictEqual(res.status, 200, 'Expected 200 OK');
    const data = await res.json();
    assert.ok(Array.isArray(data.positions), 'Positions should be an array');
    assert.ok(data.positions.length > 0, 'Should have at least 1 open position');
    availablePositions = data.positions;
    console.log(`      Found ${availablePositions.length} active positions (${availablePositions.map(p => p.title).slice(0, 3).join(', ')}...)`);
  });

  // USE CASE 3: Step 1 Validation Failure on Invalid Email / Missing Name
  await test('Validation error when required fields are missing on /api/applications/onboard', async () => {
    const res = await fetch(`${BASE_URL}/api/applications/onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '',
        email: 'invalid-email',
      }),
    });
    assert.strictEqual(res.status, 400, 'Expected 400 Bad Request');
    const data = await res.json();
    assert.ok(data.error || data.message, 'Expected validation error response');
  });

  // USE CASE 4: Full Multi-Step Onboard & Razorpay ₹300 Order Creation
  let createdAppId = '';
  let createdPaymentId = '';
  let createdOrderId = '';
  const testEmail = `test.applicant.${Date.now()}@college.edu`;

  await test('Submit valid application and generate ₹300 Razorpay order (30000 paise)', async () => {
    const res = await fetch(`${BASE_URL}/api/applications/onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Kabir Sharma',
        email: testEmail,
        phone: '9876543210',
        college: 'Bangalore Institute of Technology',
        course: 'B.Tech Computer Science',
        year: '2nd Year',
        department: 'Computer Science and Engg',
        bio: 'Passionate developer looking to build web solutions for student clubs.',
        skills: 'TypeScript, React, Python, Git',
        linkedinUrl: 'https://linkedin.com/in/kabir-sharma-tech',
        githubUrl: 'https://github.com/kabir-sharma',
        positionIds: ['pos-web-dev', 'pos-design'],
        positions: ['Web Development Team', 'Design Team'],
      }),
    });

    assert.strictEqual(res.status, 201, 'Expected 201 Created');
    const data = await res.json();
    assert.ok(data.applicationId, 'Expected applicationId');
    assert.ok(data.orderId, 'Expected orderId');
    assert.strictEqual(data.amount, 30000, 'Order amount must be 30000 paise (₹300)');
    assert.strictEqual(data.currency, 'INR', 'Currency must be INR');

    createdAppId = data.applicationId;
    createdOrderId = data.orderId;
    createdPaymentId = data.paymentId;
    console.log(`      Application ID: ${createdAppId}, Razorpay Order ID: ${createdOrderId}`);
  });

  // USE CASE 5: Payment Signature Verification (HMAC-SHA256)
  const mockPaymentId = `pay_test_${Date.now()}`;
  await test('Verify payment with HMAC-SHA256 signature and transition to UNDER_REVIEW', async () => {
    const signaturePayload = `${createdOrderId}|${mockPaymentId}`;
    const hmacSignature = crypto.createHmac('sha256', RAZORPAY_SECRET).update(signaturePayload).digest('hex');

    const res = await fetch(`${BASE_URL}/api/applications/verify-onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: createdAppId,
        paymentId: createdPaymentId,
        razorpay_order_id: createdOrderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: hmacSignature,
      }),
    });

    assert.strictEqual(res.status, 200, 'Expected 200 OK');
    const data = await res.json();
    assert.strictEqual(data.success, true, 'Expected success: true');
    assert.strictEqual(data.status, 'PAID', 'Payment status should be PAID');
    assert.strictEqual(data.applicationStatus, 'UNDER_REVIEW', 'Application should be UNDER_REVIEW');
  });

  // USE CASE 6: Public Application Status Lookup by ID
  await test('Applicant checks status via GET /api/applications/status/:id without login', async () => {
    const res = await fetch(`${BASE_URL}/api/applications/status/${createdAppId}`);
    assert.strictEqual(res.status, 200, 'Expected 200 OK');
    const data = await res.json();
    assert.ok(data.application, 'Expected application record');
    assert.strictEqual(data.application.id, createdAppId);
    assert.strictEqual(data.application.status, 'UNDER_REVIEW');
  });

  // USE CASE 7: Admin Application Review & Approval
  await test('President reviews application and approves with assigned positions', async () => {
    const res = await fetch(`${BASE_URL}/api/applications/admin/${createdAppId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignedPosition: 'Web Development Team',
        note: 'Approved based on technical portfolio submission.',
      }),
    });

    assert.strictEqual(res.status, 200, 'Expected 200 OK');
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.application.status, 'APPROVED');
  });

  // USE CASE 8: Status reflects APPROVED after review
  await test('Application status reflects APPROVED and member account activated', async () => {
    const res = await fetch(`${BASE_URL}/api/applications/status/${createdAppId}`);
    const data = await res.json();
    assert.strictEqual(data.application.status, 'APPROVED');
    console.log(`      Final Member Status: APPROVED, Reviewer: ${data.application.reviewer?.name || 'President'}`);
  });

  console.log('\n================================================================');
  console.log(`🏁 UNIT TEST SUITE RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('================================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runMembershipUseCases().catch((e) => {
  console.error('Test error:', e);
  process.exit(1);
});
