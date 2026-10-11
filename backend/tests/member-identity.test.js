const crypto = require('crypto');
const assert = require('assert');
const jwt = require('jsonwebtoken');
const prisma = require('../src/lib/prisma');
const { env } = require('../src/config/env');

const BASE_URL = 'http://localhost:4000';
const RAZORPAY_SECRET = 'WHLrER4GjPfsApLDJuDP8soH';

async function runMemberIdentityTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING CLUB_HUB MEMBER ID & QR CODE IDENTIFICATION TESTS');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] Test ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] Test ${total}: ${name}`);
      console.error('   Error:', err.message);
    }
  }

  // TEST 1: Member ID Sequential Format Check
  const { generateSequentialMemberCode } = require('../src/services/memberIdentity.service');
  await test('Sequential Member ID format matches MEM-YYYY-NNNN', async () => {
    const code = await generateSequentialMemberCode();
    const currentYear = new Date().getFullYear();
    const regex = new RegExp(`^MEM-${currentYear}-\\d{4}$`);
    assert.ok(regex.test(code), `Generated code ${code} should match format MEM-${currentYear}-NNNN`);
    console.log(`      Sample Next Sequential ID: ${code}`);
  });

  // TEST 2: High-Entropy Cryptographic QR Token & Data URL Generation
  const { generateSecureQrToken, generateQrDataUrl } = require('../src/services/memberIdentity.service');
  let sampleToken = '';
  let sampleDataUrl = '';
  await test('Generate high-entropy 64-char hex QR token and valid Base64 Data URL', async () => {
    sampleToken = generateSecureQrToken();
    assert.strictEqual(sampleToken.length, 64, 'Token length should be 64 hex characters');
    sampleDataUrl = await generateQrDataUrl(`http://localhost:5173/verify/${sampleToken}`);
    assert.ok(sampleDataUrl.startsWith('data:image/png;base64,'), 'QR code should be a valid Base64 PNG image');
  });

  // Setup / Find President user with PRESIDENT roleAssignment
  let presidentUser = await prisma.user.findFirst({
    where: { roleAssignments: { some: { role: 'PRESIDENT' } } },
  });

  if (!presidentUser) {
    presidentUser = await prisma.user.findFirst({
      where: { email: { contains: 'president' } },
    });
  }

  if (!presidentUser) {
    presidentUser = await prisma.user.create({
      data: {
        email: `president.test.${Date.now()}@clubhub.org`,
        name: 'Club President',
        password: 'hashed_password',
      },
    });
  }

  // Ensure role assignment exists for president
  const existingRole = await prisma.roleAssignment.findFirst({
    where: { userId: presidentUser.id, role: 'PRESIDENT' },
  });
  if (!existingRole) {
    await prisma.roleAssignment.create({
      data: {
        userId: presidentUser.id,
        role: 'PRESIDENT',
        positionTitle: 'President',
      },
    });
  }

  const presidentToken = jwt.sign(
    { sub: presidentUser.id },
    env.JWT_SECRET || 'clubhub-super-secret-jwt-key-2026',
    { expiresIn: '1d' }
  );

  // TEST 3: End-to-End Application Onboard -> Payment -> Approval -> Member ID Issuance
  const testEmail = `identity.student.${Date.now()}@college.edu`;
  let appId = '';
  let orderId = '';
  let paymentId = '';
  let applicantToken = '';

  await test('Onboard applicant and generate ₹300 Razorpay order', async () => {
    const res = await fetch(`${BASE_URL}/api/applications/onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Tanvi Deshmukh',
        email: testEmail,
        phone: '9876543210',
        college: 'Bangalore Institute of Technology',
        course: 'B.Tech AI & Data Science',
        year: '3rd Year',
        department: 'Artificial Intelligence',
        bio: 'Club enthusiast interested in organizing tech symposiums and workshops.',
        skills: 'Python, PyTorch, Event Coordination',
        linkedinUrl: 'https://linkedin.com/in/tanvi-deshmukh',
        githubUrl: 'https://github.com/tanvi-deshmukh',
        positions: ['Technical Lead', 'Event Management Team'],
      }),
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    appId = data.applicationId;
    orderId = data.orderId;
    paymentId = data.paymentId;
    applicantToken = data.token;
    assert.ok(appId && orderId);
  });

  // TEST 4: Payment Verification via HMAC-SHA256
  const mockPayId = `pay_rzp_${Date.now()}`;
  await test('Verify Razorpay payment and transition application to UNDER_REVIEW', async () => {
    const signaturePayload = `${orderId}|${mockPayId}`;
    const hmacSig = crypto.createHmac('sha256', RAZORPAY_SECRET).update(signaturePayload).digest('hex');

    const res = await fetch(`${BASE_URL}/api/applications/verify-onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: appId,
        paymentId: paymentId,
        razorpay_order_id: orderId,
        razorpay_payment_id: mockPayId,
        razorpay_signature: hmacSig,
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'PAID');
    assert.strictEqual(data.applicationStatus, 'UNDER_REVIEW');
  });

  // TEST 5: Admin Approval & Official Member ID + QR Code Issuance
  let issuedMemberCode = '';
  let issuedQrToken = '';
  await test('President approves application and issues official Member ID + QR Token', async () => {
    const res = await fetch(`${BASE_URL}/api/applications/admin/${appId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${presidentToken}`,
      },
      body: JSON.stringify({
        assignedPosition: 'Technical Lead',
        note: 'Approved by President after portfolio review.',
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.application.memberCode, 'Should return issued memberCode');
    assert.ok(data.application.qrToken, 'Should return issued qrToken');
    assert.ok(data.application.qrCodeDataUrl, 'Should return QR Code Data URL');
    issuedMemberCode = data.application.memberCode;
    issuedQrToken = data.application.qrToken;
    console.log(`      Issued Official Member ID: ${issuedMemberCode}`);
    console.log(`      Issued Secure QR Token: ${issuedQrToken.slice(0, 16)}...`);
  });

  // TEST 6: Idempotency of Member ID (Repeated approval does not create duplicate IDs)
  await test('Idempotency: Repeated approval returns existing Member ID without duplicate sequence', async () => {
    const res = await fetch(`${BASE_URL}/api/applications/admin/${appId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${presidentToken}`,
      },
      body: JSON.stringify({
        assignedPosition: 'Technical Lead',
      }),
    });

    const data = await res.json();
    assert.strictEqual(data.application.memberCode, issuedMemberCode, 'Must keep identical Member ID');
  });

  // TEST 7: Member Digital Card API (GET /api/members/me/id-card)
  await test('Member retrieves their official Digital Card with QR Code and active status', async () => {
    const res = await fetch(`${BASE_URL}/api/members/me/id-card`, {
      headers: { Authorization: `Bearer ${applicantToken}` },
    });

    assert.strictEqual(res.status, 200);
    const card = await res.json();
    assert.strictEqual(card.hasActiveCard, true);
    assert.strictEqual(card.memberCode, issuedMemberCode);
    assert.strictEqual(card.membershipStatus, 'ACTIVE');
    assert.ok(card.qrCodeDataUrl && card.qrCodeDataUrl.startsWith('data:image/png;base64,'));
    console.log(`      Card Display Name: ${card.displayName}, Member ID: ${card.memberCode}, Valid Until: ${card.validUntil}`);
  });

  // TEST 8: Public QR Verification (GET /api/members/verify/:token)
  await test('Public QR scanning verification verifies member authenticity with privacy protection', async () => {
    const res = await fetch(`${BASE_URL}/api/members/verify/${issuedQrToken}`);
    assert.strictEqual(res.status, 200);
    const result = await res.json();
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.memberCode, issuedMemberCode);
    assert.strictEqual(result.membershipStatus, 'ACTIVE');
    // Privacy safeguard: should not expose email, phone or internal database IDs
    assert.strictEqual(result.email, undefined);
    assert.strictEqual(result.phone, undefined);
    console.log(`      Public Verification Message: "${result.message}"`);
  });

  // TEST 9: Staff QR Verification (GET /api/members/staff/verify/:token)
  await test('Staff QR verification returns full verified credentials including positions & college', async () => {
    const res = await fetch(`${BASE_URL}/api/members/staff/verify/${issuedQrToken}`, {
      headers: { Authorization: `Bearer ${presidentToken}` },
    });

    assert.strictEqual(res.status, 200);
    const staffResult = await res.json();
    assert.strictEqual(staffResult.valid, true);
    assert.strictEqual(staffResult.memberCode, issuedMemberCode);
    assert.strictEqual(staffResult.email, testEmail);
    assert.ok(staffResult.verifiedAt);
    console.log(`      Staff Verified: ${staffResult.displayName} (${staffResult.email}) - Role: ${staffResult.positions?.join(', ')}`);
  });

  // TEST 10: Rejection of Invalid / Fake QR Token
  await test('Invalid or forged QR token returns valid: false', async () => {
    const fakeToken = 'fake_forged_token_00000000000000000000000000000000000000000000000000';
    const res = await fetch(`${BASE_URL}/api/members/verify/${fakeToken}`);
    const result = await res.json();
    assert.strictEqual(result.valid, false);
    console.log(`      Invalid Token Response: "${result.message}"`);
  });

  console.log('\n================================================================');
  console.log(`🏁 ALL ${passed}/${total} MEMBER ID & QR IDENTIFICATION TESTS PASSED!`);
  console.log('================================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runMemberIdentityTests().catch((e) => {
  console.error('Test execution error:', e);
  process.exit(1);
});
