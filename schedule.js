const cron = require('node-cron');

const task = () => {
  console.log('Printed after 10 seconds');
};

cron.schedule('*/10 * * * * *', task);
