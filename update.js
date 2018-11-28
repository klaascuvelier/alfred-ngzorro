const fs = require('fs');
const puppeteer = require('puppeteer');
const ora = require('ora');

const url = 'https://ng.ant.design/docs/introduce/en';

(async () => {
	const spinner = ora('Updating NG-Zorro components cache').start();

	const browser = await puppeteer.launch();
  	const page = await browser.newPage();
  	await page.goto(url, {waitUntil: 'networkidle0'});
  	const bodyHandle = await page.$('body');
	const result = await page.evaluate(body => {
		const selectors = {
			mainMenu: '.main-menu',
			subMenu: 'li[nz-submenu]',
			subMenuTitle: '[title] h4',
			componentGroups: 'li[nz-menu-group]',
			menuItem: 'li[nz-menu-item]',
			groupTitle: '.ant-menu-item-group-title'
		};

		const mainMenu = body.querySelector(selectors.mainMenu);

		const componentsSubItem = [...mainMenu.querySelectorAll(selectors.subMenu)].find(
			menuItem => {
				const title = menuItem.querySelector(selectors.subMenuTitle);
				return title && title.textContent === 'Components';
			}
		);

		if (!componentsSubItem) {
			throw new Error('Could not find components on page');
		}

		const componentGroups = [...componentsSubItem.querySelectorAll(selectors.componentGroups)];

		return componentGroups.reduce((groups, group) => {
			const title = group.querySelector(selectors.groupTitle).textContent;
			const components = [...group.querySelectorAll(selectors.menuItem + ':not([hidden]) a')].map(item => {
				const name = item.querySelector('span').textContent;
				const link = item.href;

				return {name, link};
			});

			return {...groups, [title]: components};
		}, {});
	}, bodyHandle);
	await bodyHandle.dispose();
	await browser.close();

	fs.writeFileSync('components.json', JSON.stringify(result, null, 4));

	spinner.succeed('NG-Zorro components cache updated');
})();
