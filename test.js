const test = require('ava');
const alfyTest = require('alfy-test');

test('Naive integration test', async t => {
    const alfy = alfyTest();
    const result = await alfy('buTTon');

    t.deepEqual(result, [
        {
            arg: 'https://ng.ant.design/components/button/en',
            quicklookurl: 'https://ng.ant.design/components/button/en',
            subtitle: 'General > Button',
            title: 'Button'
		}
	]);
});
