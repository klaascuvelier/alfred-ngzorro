const alfy = require('alfy');
const data = require('./components.json');

const items = Object
    .keys(data)
    .map(group => {
        return data[group].map(item => {
            return {...item, group};
        });
    })
    .reduce((all, components) => [...all, ...components], []);

const results = alfy
    .inputMatches(items, 'name')
    .map(item => ({
        title: item.name,
        subtitle: `${item.group} > ${item.name}`,
        arg: item.link,
        quicklookurl: item.link
    }));

alfy.output(results);
