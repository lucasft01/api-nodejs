const CronJob = require('cron').CronJob;
const Restaurant = require('../models/Restaurant')

const updateRestaurants = async () => {
  try {
    const today = new Date()
    const day = today.getDay()
    const minutes = today.getMinutes()
    await Restaurant.update(
      {
        $and: [
          { "businessHours.weekDay": { $eq: day } },
          {
            $and: [
              { "businessHours.startTime": { $lte: minutes } },
              { "businessHours.endTime": { $gte: minutes } }
            ]
          }
        ]
      },
      {
        $set: { "open": true }
      }
    )
    await Restaurant.update(
      {
        $or: [
          { "businessHours": { $eq: [] } },
          { "businessHours.weekDay": { $ne: day } },
          {
            $or: [
              { "businessHours.startTime": { $gte: minutes } },
              { "businessHours.endTime": { $lte: minutes } }
            ]
          }
        ]
      },
      {
        $set: { "open": false }
      }
    )
  } catch (e) {
    console.error(e)
  }
}

console.log('Before job instantiation');
const job = new CronJob('*/10 * * * * *', function () {
  const d = new Date();
  console.log('Every Fifteenth Minute:', d);
  updateRestaurants()
});
console.log('After job instantiation');

module.exports = { job }