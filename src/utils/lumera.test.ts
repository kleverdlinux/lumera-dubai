import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateEnquiryForm,
  validatePhoneForCountry,
} from './enquiryValidation';
import {
  computeOvalCarouselMetrics,
  computeScrollProgressBar,
  DESKTOP_OVAL_SPEC,
  parseOdometerTokens,
  smoothstep,
} from './carouselMath';

test('validatePhoneForCountry enforces country-specific length and leading-zero rules', () => {
  assert.equal(validatePhoneForCountry('+91 9876543210'), true);
  assert.equal(validatePhoneForCountry('+91 98765'), false);

  assert.equal(validatePhoneForCountry('+971 501234567'), true);
  assert.equal(validatePhoneForCountry('+971 0501234567'), true);
  assert.equal(validatePhoneForCountry('+971 1234'), false);
});

test('validateEnquiryForm validates all required fields and formats', () => {
  const emptyResult = validateEnquiryForm({
    name: '',
    email: '',
    phone: '+91 ',
    interest: '',
    message: '',
    terms: false,
  });
  assert.equal(emptyResult.valid, false);
  assert.equal(emptyResult.errors.name, 'El nombre es obligatorio.');
  assert.equal(emptyResult.errors.email, 'El correo electrónico es obligatorio.');
  assert.equal(emptyResult.errors.phone, 'El teléfono es obligatorio.');
  assert.equal(emptyResult.errors.interest, 'Por favor selecciona la opción de interés.');
  assert.equal(emptyResult.errors.terms, 'Por favor acepta los términos antes de enviar.');

  const validResult = validateEnquiryForm({
    name: 'Alexander Wright',
    email: 'alex@lumera.ae',
    phone: '+971 501234567',
    interest: 'private-viewing',
    message: 'Interested in the Skyline Crest Penthouse.',
    terms: true,
  });
  assert.equal(validResult.valid, true);
  assert.deepEqual(validResult.errors, {});
});

test('smoothstep and computeOvalCarouselMetrics calculate accurate stage geometry', () => {
  assert.equal(smoothstep(0), 0);
  assert.equal(smoothstep(0.5), 0.5);
  assert.equal(smoothstep(1), 1);

  const metrics = computeOvalCarouselMetrics(DESKTOP_OVAL_SPEC, 1440, 1440);
  assert.equal(metrics.stageHalf, 720);
  assert.ok(Math.abs(metrics.centerW - 302.4) < 0.01);
  assert.ok(Math.abs(metrics.smallW - 165.6) < 0.01);
});

test('computeScrollProgressBar and parseOdometerTokens work accurately', () => {
  const barStart = computeScrollProgressBar(1000, 2000, 0);
  assert.equal(barStart.width, 50);
  assert.equal(barStart.left, 0);

  const barEnd = computeScrollProgressBar(1000, 2000, 1);
  assert.equal(barEnd.width, 50);
  assert.equal(barEnd.left, 50);

  const tokens = parseOdometerTokens('4.2M+');
  assert.equal(tokens.length, 5);
  assert.equal(tokens[0].isDigit, true);
  assert.equal(tokens[0].digit, 4);
  assert.equal(tokens[1].isDigit, false);
  assert.equal(tokens[1].char, '.');
  assert.equal(tokens[2].isDigit, true);
  assert.equal(tokens[2].digit, 2);
});
