const fs = require('fs');
const puppeteer = require('puppeteer');
const ora = require('ora');

const url = "https://ng.ant.design/components/button/en";

(async () => {
   const spinner = ora("Updating NG-Zorro components cache").start();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const result = await page.evaluate(() => {

            const menuGroups = Array.from(
                document.querySelectorAll(
                    ".main-menu [nz-menu] > [nz-menu-group]:not([hidden])"
                )
            );

            return menuGroups.reduce((acc, group) => {
                const title = group
                    .querySelector(".ant-menu-item-group-title")
                    .innerText.trim();
                const components = Array.from(
                    group.querySelectorAll("[nz-menu-item] a")
                ).map((item) => {
                    return {
                        link: item.href,
                        name: item.querySelector("span").innerText.trim(),
                    };
                });
                return { ...acc, [title]: components };
            }, {});


    });

    await browser.close();
    fs.writeFileSync("components.json", JSON.stringify(result, null, 4));

    spinner.succeed("NG-Zorro components cache updated");
})();
