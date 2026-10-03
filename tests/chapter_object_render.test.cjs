const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs');
const path = require('path');
const { extractGameMetrics } = require('../src/utils/homeHelper.cjs');

test('REPRO: Rendering activeChapter object directly in React child throws Objects are not valid as a React child', () => {
  const metrics = extractGameMetrics(null);

  // Verify activeChapter is indeed a full Chapter object with expected keys
  assert.ok(typeof metrics.activeChapter === 'object' && metrics.activeChapter !== null);
  assert.equal(metrics.activeChapter.number, 1);
  assert.ok('bossName' in metrics.activeChapter);
  assert.ok('stageConfig' in metrics.activeChapter);
  assert.ok('runnerConfig' in metrics.activeChapter);

  // Replicate the exact bug: <Text style={styles.ribbonText}>CHƯƠNG {activeChapter || 1}</Text>
  const buggyChild = metrics.activeChapter || 1;
  assert.throws(
    () => {
      ReactDOMServer.renderToStaticMarkup(
        React.createElement('span', null, 'CHƯƠNG ', buggyChild)
      );
    },
    (err) => {
      return (
        err instanceof Error &&
        err.message.includes('Objects are not valid as a React child')
      );
    }
  );

  // The correct fix: activeChapter?.number || 1 renders valid string
  const fixedChild = metrics.activeChapter?.number || 1;
  const markup = ReactDOMServer.renderToStaticMarkup(
    React.createElement('span', null, 'CHƯƠNG ', fixedChild)
  );
  assert.equal(markup, '<span>CHƯƠNG 1</span>');
});

test('STATIC AUDIT: All frontend screen JSX files must not render raw chapter/boss/stage objects as JSX children', () => {
  const screensDir = path.join(__dirname, '../src/screens');
  const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.js') || f.endsWith('.jsx'));

  // Look for raw object identifiers inside JSX children: e.g. >...{activeChapter}...<
  const dangerousChildPatterns = [
    />[^<]*\{activeChapter\s*(?:\|\|[^.}]*)?\}/,
    />[^<]*\{currentChapter\s*(?:\|\|[^.}]*)?\}/,
    />[^<]*\{selectedChapter\s*(?:\|\|[^.}]*)?\}/,
    />[^<]*\{stage\s*(?:\|\|[^.}]*)?\}/,
    />[^<]*\{bossData\s*(?:\|\|[^.}]*)?\}/,
  ];

  const violations = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(screensDir, file), 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, lineIdx) => {
      for (const pattern of dangerousChildPatterns) {
        if (pattern.test(line)) {
          violations.push({
            file,
            line: lineIdx + 1,
            code: line.trim()
          });
        }
      }
    });
  }

  // When bug is present in HomeScreenGame.js line 345, violations will contain it!
  assert.equal(
    violations.length,
    0,
    `Found raw object rendered as React child: ${JSON.stringify(violations, null, 2)}`
  );
});
