/**
 * API Testing Service
 * Comprehensive testing utilities for all external APIs
 */
import { fetchShabad, generateExplanation, generateVoiceExplanation } from './api';
import { API_BASE_URL, RECOGNITION_API_URL, GEMINI_API_KEY } from '../config';

/**
 * Test result structure
 * @typedef {Object} TestResult
 * @property {string} name - Test name
 * @property {boolean} passed - Whether test passed
 * @property {string} status - Status message
 * @property {number} duration - Test duration in ms
 * @property {Object} data - Response data (if applicable)
 * @property {string} error - Error message (if failed)
 */

/**
 * Test GurbaniNow API connectivity
 */
export async function testGurbaniNowAPI() {
  const startTime = Date.now();
  const testResult = {
    name: 'GurbaniNow API - Basic Connectivity',
    passed: false,
    status: '',
    duration: 0,
    data: null,
    error: null
  };

  try {
    // Test with a known Shabad ID (Mool Mantar)
    const shabadId = '1';
    const data = await fetchShabad(shabadId);

    testResult.passed = true;
    testResult.status = 'Successfully fetched Shabad data';
    testResult.data = {
      shabadId,
      lineCount: data.shabad?.length || 0,
      raag: data.shabadinfo?.raag || 'N/A',
      writer: data.shabadinfo?.writer || 'N/A',
      pageNo: data.shabadinfo?.pageNo || 'N/A'
    };
  } catch (error) {
    testResult.passed = false;
    testResult.status = 'Failed to connect to GurbaniNow API';
    testResult.error = error.message;
  } finally {
    testResult.duration = Date.now() - startTime;
  }

  return testResult;
}

/**
 * Test multiple Shabad IDs
 */
export async function testMultipleShabads() {
  const startTime = Date.now();
  const testResult = {
    name: 'GurbaniNow API - Multiple Shabads',
    passed: false,
    status: '',
    duration: 0,
    data: null,
    error: null
  };

  const testShabadIds = ['1', '3589', '1365']; // Mool Mantar, Thir Ghar Baiso, Tati Vao Na Lagai
  const results = [];

  try {
    for (const shabadId of testShabadIds) {
      try {
        const data = await fetchShabad(shabadId);
        results.push({
          id: shabadId,
          success: true,
          lineCount: data.shabad?.length || 0,
          raag: data.shabadinfo?.raag || 'N/A'
        });
      } catch (error) {
        results.push({
          id: shabadId,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    testResult.passed = successCount === testShabadIds.length;
    testResult.status = `${successCount}/${testShabadIds.length} Shabads fetched successfully`;
    testResult.data = { results };
  } catch (error) {
    testResult.passed = false;
    testResult.status = 'Test execution failed';
    testResult.error = error.message;
  } finally {
    testResult.duration = Date.now() - startTime;
  }

  return testResult;
}

/**
 * Test Recognition API health
 */
export async function testRecognitionAPI() {
  const startTime = Date.now();
  const testResult = {
    name: 'Recognition API - Health Check',
    passed: false,
    status: '',
    duration: 0,
    data: null,
    error: null
  };

  try {
    const response = await fetch(`${RECOGNITION_API_URL}/health`);

    if (response.ok) {
      const data = await response.json();
      testResult.passed = true;
      testResult.status = 'Recognition API is healthy';
      testResult.data = data;
    } else {
      testResult.passed = false;
      testResult.status = `Health check failed with status ${response.status}`;
      testResult.error = `HTTP ${response.status}`;
    }
  } catch (error) {
    testResult.passed = false;
    testResult.status = 'Cannot connect to Recognition API';
    testResult.error = error.message;
  } finally {
    testResult.duration = Date.now() - startTime;
  }

  return testResult;
}

/**
 * Test Gemini API (if API key is provided)
 */
export async function testGeminiAPI() {
  const startTime = Date.now();
  const testResult = {
    name: 'Gemini API - Text Generation',
    passed: false,
    status: '',
    duration: 0,
    data: null,
    error: null
  };

  if (!GEMINI_API_KEY || GEMINI_API_KEY === '') {
    testResult.passed = false;
    testResult.status = 'Gemini API key not configured';
    testResult.error = 'VITE_GEMINI_API_KEY not set in environment';
    testResult.duration = Date.now() - startTime;
    return testResult;
  }

  try {
    const testText = "The Divine Light illuminates all beings equally.";
    const explanation = await generateExplanation(testText, GEMINI_API_KEY);

    testResult.passed = true;
    testResult.status = 'Gemini API generated explanation successfully';
    testResult.data = {
      inputLength: testText.length,
      outputLength: explanation.length,
      preview: explanation.substring(0, 100)
    };
  } catch (error) {
    testResult.passed = false;
    testResult.status = 'Failed to generate explanation';
    testResult.error = error.message;
  } finally {
    testResult.duration = Date.now() - startTime;
  }

  return testResult;
}

/**
 * Test Gemini TTS API
 */
export async function testGeminiTTS() {
  const startTime = Date.now();
  const testResult = {
    name: 'Gemini API - Text-to-Speech',
    passed: false,
    status: '',
    duration: 0,
    data: null,
    error: null
  };

  if (!GEMINI_API_KEY || GEMINI_API_KEY === '') {
    testResult.passed = false;
    testResult.status = 'Gemini API key not configured';
    testResult.error = 'VITE_GEMINI_API_KEY not set in environment';
    testResult.duration = Date.now() - startTime;
    return testResult;
  }

  try {
    const testText = "This is a test of the text to speech system.";
    const audioBase64 = await generateVoiceExplanation(testText, GEMINI_API_KEY);

    if (audioBase64) {
      testResult.passed = true;
      testResult.status = 'Gemini TTS generated audio successfully';
      testResult.data = {
        audioLength: audioBase64.length,
        format: 'PCM16 (base64)'
      };
    } else {
      testResult.passed = false;
      testResult.status = 'No audio data returned';
      testResult.error = 'Response contained no audio data';
    }
  } catch (error) {
    testResult.passed = false;
    testResult.status = 'Failed to generate voice';
    testResult.error = error.message;
  } finally {
    testResult.duration = Date.now() - startTime;
  }

  return testResult;
}

/**
 * Test API response time
 */
export async function testAPIResponseTime() {
  const testResult = {
    name: 'GurbaniNow API - Response Time',
    passed: false,
    status: '',
    duration: 0,
    data: null,
    error: null
  };

  const measurements = [];
  const iterations = 3;

  try {
    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      await fetchShabad('1');
      const duration = Date.now() - start;
      measurements.push(duration);
    }

    const avgResponseTime = measurements.reduce((a, b) => a + b, 0) / iterations;
    const maxResponseTime = Math.max(...measurements);
    const minResponseTime = Math.min(...measurements);

    testResult.passed = avgResponseTime < 2000; // Pass if under 2 seconds average
    testResult.status = testResult.passed ? 'Good response time' : 'Response time is slow';
    testResult.data = {
      average: `${avgResponseTime.toFixed(0)}ms`,
      min: `${minResponseTime}ms`,
      max: `${maxResponseTime}ms`,
      measurements
    };
    testResult.duration = measurements.reduce((a, b) => a + b, 0);
  } catch (error) {
    testResult.passed = false;
    testResult.status = 'Failed to measure response time';
    testResult.error = error.message;
  }

  return testResult;
}

/**
 * Run all API tests
 */
export async function runAllTests() {
  console.log('🧪 Running API Test Suite...\n');

  const tests = [
    testRecognitionAPI,
    testGurbaniNowAPI,
    testMultipleShabads,
    testAPIResponseTime,
    testGeminiAPI,
    testGeminiTTS
  ];

  const results = [];

  for (const test of tests) {
    console.log(`Running: ${test.name}...`);
    const result = await test();
    results.push(result);

    const statusIcon = result.passed ? '✅' : '❌';
    console.log(`${statusIcon} ${result.name}: ${result.status} (${result.duration}ms)`);

    if (result.error) {
      console.error(`   Error: ${result.error}`);
    }

    if (result.data) {
      console.log(`   Data:`, result.data);
    }

    console.log('');
  }

  // Summary
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log('='.repeat(60));
  console.log(`📊 Test Summary: ${passed}/${total} tests passed (${passRate}%)`);
  console.log('='.repeat(60));

  return {
    summary: {
      total,
      passed,
      failed: total - passed,
      passRate: parseFloat(passRate)
    },
    results
  };
}

/**
 * Run a quick smoke test (essential APIs only)
 */
export async function runSmokeTest() {
  console.log('🔥 Running Smoke Test...\n');

  const tests = [
    testRecognitionAPI,
    testGurbaniNowAPI
  ];

  const results = [];

  for (const test of tests) {
    const result = await test();
    results.push(result);

    const statusIcon = result.passed ? '✅' : '❌';
    console.log(`${statusIcon} ${result.name}: ${result.status}`);
  }

  const allPassed = results.every(r => r.passed);

  console.log('\n' + '='.repeat(60));
  console.log(allPassed ? '✅ Smoke test PASSED' : '❌ Smoke test FAILED');
  console.log('='.repeat(60));

  return {
    passed: allPassed,
    results
  };
}

/**
 * Export test results as JSON
 */
export function exportTestResults(results) {
  return JSON.stringify(results, null, 2);
}
