# Gold Copy Trading - Comprehensive Testing Suite

This directory contains the complete testing infrastructure for the Gold Copy Trading website, including end-to-end tests, performance monitoring, and automated quality assurance.

## Test Suite Overview

### 🧪 E2E Test Suite (`e2e-tests.js`)
Comprehensive end-to-end testing covering all critical functionality:

- **Core Functionality Tests**
  - Homepage load and content validation
  - Navigation and link integrity
  - Performance highlights accuracy
  - CTA button functionality

- **Report Pages Tests**
  - Combined portfolio report
  - Individual currency pair reports
  - Chart loading and rendering

- **Technical Infrastructure Tests**
  - PWA installation capabilities
  - Service Worker registration
  - Error handling system
  - Accessibility compliance
  - Performance metrics
  - SEO meta tags validation
  - Image optimization

- **User Experience Tests**
  - Mobile responsiveness
  - Cross-browser compatibility
  - Offline functionality

### 🎛️ Test Runner (`run-tests.html`)
Interactive web-based test runner with:

- **Visual Dashboard**
  - Real-time test execution status
  - Pass/fail statistics
  - Success rate visualization
  - Individual test results

- **Test Controls**
  - Run all tests at once
  - Execute individual test categories
  - Clear results and logs
  - Export test reports

- **Individual Test Categories**
  - Homepage validation
  - Navigation testing
  - Performance monitoring
  - Accessibility checks
  - SEO validation
  - PWA functionality
  - Chart rendering
  - Mobile responsiveness

## How to Use

### Running Tests Locally

1. **Access Test Runner**
   ```
   Open tests/run-tests.html in your browser
   ```

2. **Run All Tests**
   ```
   Click "Run All Tests" button
   ```

3. **Run Individual Tests**
   ```
   Click on any specific test category card
   ```

4. **View Results**
   ```
   Results display automatically with:
   - Pass/fail status
   - Execution time
   - Error details (if any)
   ```

### Automated Testing

Tests automatically run in development environments when:
- `localhost` or `127.0.0.1` is detected
- URL contains `?test=true` parameter
- Testing environment is configured

### Manual Testing via Console

```javascript
// Run specific test
await TestSuite.runSingleTest('homepage');

// Get current test results
const report = TestSuite.getTestReport();

// Clear all results
TestSuite.clearResults();
```

## Test Categories

### 1. Homepage Load Test
- Validates presence of critical elements
- Checks hero section content
- Verifies performance highlights
- Ensures CTA buttons are functional

### 2. Navigation Test
- Tests all internal links
- Validates link integrity
- Checks for broken navigation

### 3. Performance Test
- Monitors Core Web Vitals
- Checks page load times
- Validates performance monitoring
- Tests image optimization

### 4. Accessibility Test
- Validates skip navigation links
- Checks heading hierarchy
- Verifies alt text on images
- Tests form label associations

### 5. SEO Test
- Validates required meta tags
- Checks Open Graph tags
- Verifies canonical URLs
- Tests structured data

### 6. PWA Test
- Validates manifest file
- Tests service worker registration
- Checks installation capabilities
- Verifies offline functionality

### 7. Chart Test
- Validates Chart.js loading
- Tests canvas element presence
- Checks chart initialization
- Verifies data rendering

### 8. Mobile Responsiveness Test
- Tests various viewport sizes
- Validates responsive design
- Checks touch interactions
- Verifies mobile-specific features

## Test Results

### Success Metrics
- **100% Pass Rate**: All tests should pass for production deployment
- **< 3000ms**: Average test execution time
- **Zero Critical Failures**: No blocking issues detected

### Report Format
```json
{
  "summary": {
    "total": 17,
    "passed": 16,
    "failed": 1,
    "successRate": 94,
    "totalDuration": 2847
  },
  "results": [
    {
      "name": "Homepage Load",
      "status": "PASSED",
      "duration": 156,
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## Integration with CI/CD

### GitHub Actions Integration
```yaml
- name: Run E2E Tests
  run: |
    npm run test:e2e

- name: Generate Test Report
  run: |
    node tests/generate-report.js
```

### Performance Budgets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- First Input Delay: < 100ms
- Cumulative Layout Shift: < 0.1

## Troubleshooting

### Common Issues

1. **Chart.js Loading Failures**
   - Check CDN availability
   - Verify script loading order
   - Test fallback mechanisms

2. **Service Worker Registration**
   - Ensure HTTPS or localhost
   - Check browser compatibility
   - Verify service worker file path

3. **Accessibility Violations**
   - Review alt text requirements
   - Check form label associations
   - Validate heading structure

### Debug Mode
Add `?test=true&debug=true` to URL for verbose logging:
```
http://localhost:3000/?test=true&debug=true
```

## Best Practices

### Test Writing
- Keep tests focused and atomic
- Use descriptive test names
- Include proper error handling
- Document test expectations

### Maintenance
- Update tests with feature changes
- Review test coverage regularly
- Monitor test execution times
- Clean up obsolete tests

### Performance
- Run tests in parallel when possible
- Cache test data appropriately
- Optimize test execution order
- Monitor resource usage

## Contributing

When adding new features:
1. Write corresponding tests
2. Update test documentation
3. Verify all existing tests pass
4. Add performance budgets if applicable

## Support

For test-related issues:
- Check browser console for errors
- Review test execution logs
- Verify browser compatibility
- Contact development team

---

**Note**: This testing suite is designed to ensure the Gold Copy Trading website maintains high quality, performance, and accessibility standards across all deployments.