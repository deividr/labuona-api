import * as t from 'tap';

function doStuffThatLogsStuff() {
  console.error('expected', 'message');
}

t.test('console stuff', (t) => {
  const { error } = console;
  t.teardown((): any => (console.error = error));
  const errorLog: Array<any> = [];
  console.error = (...m) => errorLog.push(m);

  doStuffThatLogsStuff();
  t.match(errorLog, [['expected', 'message']]);
  t.end();
});
