const { topics } = require('./music.json');
const dayjs = require('dayjs');

const startDate = dayjs('2024-08-26');

module.exports = {
    musicTopic: () => {
        const todayDate  = dayjs().format('YYYY-MM-DD');

        const diff = startDate.diff(todayDate, 'week');

        return topics[-1 * diff];
    }
}