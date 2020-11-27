const pm2 = require('pm2')
const cron = require('node-cron');
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('./settings/setting.json'))

pm2.connect((error) => {
    if (error) {
      console.error(error)
    }

    pm2.start({ script: 'index.js' }, (error, apps) => {
      pm2.disconnect()
      if (error) {
        console.error(error)
      }
    })
    
    if(settings.Rest){
      cron.schedule("0 0 21 * * *", function(){
        settings.banChats = true
        fs.writeFileSync('./settings/setting.json',JSON.stringify(settings,null,2))
        pm2.restart('index', (error) => {
          if (error) {
            console.error(error)
          }
        })
        console.log('[INFO] Time to rest!');
      })
  
      cron.schedule("0 0 9 * * *", function(){
        settings.banChats = false
        fs.writeFileSync('./settings/setting.json',JSON.stringify(settings,null,2))
        pm2.restart('index', (error) => {
          if (error) {
            console.error(error)
          }
        })
        console.log('[INFO] Time to work :D');
      })
    }
    
    cron.schedule("0 0 0 * * *", function(){
      let obj = [{id: settings.sAdmin, limit: 1}];
      fs.writeFileSync('./settings/limit.json', JSON.stringify(obj));
      pm2.restart('index', (error) => {
        if (error) {
          console.error(error)
        }
    })
    console.log('[INFO] Limit restarted!');
  })
})

