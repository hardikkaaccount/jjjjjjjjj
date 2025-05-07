export async function evaluateCodeBackend(code, functionName, testCases, language = 'javascript') {
  if (language !== 'javascript') {
    throw new Error('Only JavaScript is supported for backend evaluation.');
  }

  const results = [];
  let passedTests = 0;

  let codeFunction;
  try {
    codeFunction = new Function(`
      ${code}
      return ${functionName};
    `)();
  } catch (error) {
    // If code can't be parsed, all tests fail
    return {
      totalTests: testCases.length,
      passedTests: 0,
      results: testCases.map(testCase => ({
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        expected: testCase.output,
        got: undefined,
      })),
    };
  }

  for (const testCase of testCases) {
    try {
      const [n, powers] = JSON.parse(testCase.input);
      const output = codeFunction(n, powers);
      const outputStr = String(output);
      const passed = outputStr === testCase.output;
      if (passed) passedTests++;
      results.push({
        passed,
        input: testCase.input,
        output: outputStr,
        expected: testCase.output,
        got: outputStr,
      });
    } catch (error) {
      results.push({
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        expected: testCase.output,
        got: undefined,
        input: testCase.input,
      });
    }
  }

  return {
    totalTests: testCases.length,
    passedTests,
    results,
  };
} 