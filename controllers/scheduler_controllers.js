const ScheduleModel = require('../schemas/schedulerSchema');
const CampaignModel = require('../schemas/campaignSchema');
const schedule = require('node-schedule');
const {sendEmail} = require("../config/smtp_config");
const runningSchedules = [];
var jobId=1;

var job;
const { decodeToken } = require("./auth_controllers");
const handleSchedule = async (req, res) => {

    try {
        const { _id } = await decodeToken(req.headers.authorization);
        const nextSchedule = calculateNextTime2(req.body.schedule);
        const { emails } = req.body;
        const emailsWithStatus = emails.map(email => ({
            email: email.email,
            sent: false
        }));
        req.body.emails = emailsWithStatus;
        req.body.nextSchedule = nextSchedule;
        
        const campaign = new CampaignModel({
            name: req.body.name,
            emails: req.body.emails,
            body: req.body.mailBody,
            subject: req.body.subject,
            status: req.body.status,
            owner: _id
        });
        await campaign.save();
        console.log("campaign saved")

        const pattern=getJobSchedulePattern2(req.body.schedule)
        console.log("pattern",pattern)
        job = schedule.scheduleJob(pattern, scheduleEmailSend);
        runningSchedules.push({
              "jobId":jobId,
              "job":job
          })
          

        const scheduleTable = new ScheduleModel(
            {
                ...
                req.body,
                "campaign_id": campaign._id,
                "jobId":jobId,
            }
        );
        await scheduleTable.save();
        jobId++;
        console.log("schedule saved")
        



        res.status(200).json({
            "success": true,
            "msg": "Schedule handled successfully"
        })
        

    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": error.message
        })
    }
}

function getJobSchedulePattern(schedule) {
    const { hours = '*', minutes = '*', seconds = '*' } = schedule;
  
    // Ensure that hours, minutes, and seconds are within the valid range
    let normalizedHours;
    let normalizedMinutes;
    let normalizedSeconds;
    if(hours=="" || hours==null || hours==0){
    normalizedHours = hours > 0 && hours <= 23 ? hours : '*';
    normalizedMinutes = minutes > 0 && minutes <= 59 ? minutes : '*';
    normalizedSeconds = seconds > 0 && seconds <= 59 ? seconds : '*';
    }
    else{
        normalizedHours = hours > 0 && hours <= 23 ? hours : '*';
        normalizedMinutes = minutes > 0 && minutes <= 59 ? minutes : '*';
        normalizedSeconds = seconds > 0 && seconds <= 59 ? seconds : '*';
    }
    // Construct the cron pattern
    const cronPattern = `${normalizedSeconds} ${normalizedMinutes} ${normalizedHours} * * *`;
  
    return cronPattern;
  }

  function getJobSchedulePattern2(schedule) {
    console.log(schedule)
    let cronPattern=""
    if(schedule==1){
        // every minute
        cronPattern="0 * * * * *"
    }
    else if(schedule==2){
        // hour
        cronPattern="0 0 * * * *"
    }
    else if(schedule==3){
        // daily
        cronPattern="0 0 * * *"
    }
  
    return cronPattern;
  }


// jodi exact value dei, tokhn exact value er sathe actual time match korbe
// jodi 23:59pm e pathaite chai tkhn dite hobe 59 23 * * *
// ar jodi chai 10 sec por, */10 * * * * *
// jodi chai 10min 10sec por por, */10 */10 * * * *
var activeJobsCount = 0;
const testCorn = async (req, res) => {
    job = schedule.scheduleJob('* */1 * * * *', scheduleEmailSend);
    // job = schedule.scheduleJob('*/1 */0 * * * *', ()=>{
    //     console.log("job running",new Date().toLocaleTimeString())
    // });
    console.log("testCorn")
    res.status(200).json({
        "success": true,
        "msg": "Schedule handled successfully"
    })
}


const closeAllSchedules = async (req, res) => {
    try {
        schedule.gracefulShutdown();
        res.status(200).json({
            "success": true,
            "msg": "Schedule handled successfully"
        })

    } catch (error) {

    }
}
const scheduleEmailSend = async () => {
    console.log("schedule Triggered")
    try {
        const schedules = await ScheduleModel.find({
            status: false,
            nextSchedule: { $lte: Date.now() }
        }).populate('campaign_id');
        // get the array from the campaign_id field
        schedules.map(async (schedule, index) => {
            const campaign = schedule.campaign_id;
            const emails = campaign.emails;
            console.log("emails", emails)
            // slice the email from mailSent to limit
            // filter only those emails whose sent:false
            const emailsToSend = emails.filter(email => email.sent == false).slice(0,schedule.limit).map(email => email.email);
            // send email to the emailsToSend
            console.log("emailsToSend", emailsToSend);
            if(emailsToSend.length>0){
                
            const res=await sendEmail("mdrifatbd5@gmail.com",emailsToSend, campaign.subject, campaign.body);
            console.log("Email sent")
            // update the sent field of the emails from campaign table
            await CampaignModel.updateMany(
                { _id: campaign._id, "emails.email": { $in: emailsToSend } },
                { $set: { "emails.$[elem].sent": true } },
                { arrayFilters: [{ "elem.email": { $in: emailsToSend } }] }
              );
            console.log("Emails updated")
            if(res){
                if (emailsToSend.length + schedule.mailSent === emails.length) {
                    await ScheduleModel.updateOne({ _id: schedule._id }, { $set: { status: true } });
                    console.log("Updating schedule status")
                    runningSchedules.map((schedule,index)=>{
                        if(schedule.jobId==schedule.jobId){
                            schedule.job.cancel();
                            console.log("Job cancelled")
                            runningSchedules.splice(index,1);
                        }
                    })
                    
                }
                else {
                    const nextSchedule = calculateNextTime2(schedule.schedule);
                    // await ScheduleModel.updateOne({ _id: schedule._id }, { $set: { nextSchedule: nextSchedule } });
                //   also update the mailSent field
                await ScheduleModel.updateOne({ _id: schedule._id }, { $set: { nextSchedule: nextSchedule, mailSent: emailsToSend.length + schedule.mailSent } });
                }
            }
            }
            else{
                runningSchedules.map((schedule,index)=>{
                    if(schedule.jobId==schedule.jobId){
                        schedule.job.cancel();
                        console.log("Job cancelled")
                        runningSchedules.splice(index,1);
                    }
                })
            }
            


        })




    } catch (error) {
        console.log("error", error.message)
    }
}

const getAllSchedules = async (req, res) => {
    try {
        res
            .status(200)
            .json({
                "success": true,
                "msg": "Schedule handled successfully",
                "running": runningSchedules.length,
            })
    } catch (error) {
        res.status
            .status(400)
            .json({
                "success": false,
                "msg": "Schedule handled successfully"
            })
    }
}

const stopScheduleUsingJobID=async(req,res)=>{
    try {
        const {jobId}=req.params
        runningSchedules.map((schedule,index)=>{
            if(schedule.jobId==jobId){
                schedule.job.cancel();
                console.log("Job cancelled")
                runningSchedules.splice(index,1);
            }
        })
        res.status(200).json({
            "success": true,
            "msg": "Job Canceled successfully"
        })

    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": error.message
        })
    }
}


function calculateNextTime(schedule) {
    const now = new Date();
    const nextTime = new Date(now);
    const { hours = 0, minutes = 0, seconds = 0 } = schedule;
    // if(hours=="" || hours==null){
    //     hours=0;
    // }
    // if(minutes=="" || minutes==null){
    //     minutes=0;
    // }
    // if(seconds=="" || seconds==null){
    //     seconds=0;
    // }
    
    // Add days to the nextTime
    console.log(hours, minutes, seconds)
    // Add hours, minutes, and seconds to the nextTime
    nextTime.setHours(nextTime.getHours() + parseInt(hours));

    nextTime.setMinutes(nextTime.getMinutes() + parseInt(minutes));
    nextTime.setSeconds(nextTime.getSeconds() + parseInt(seconds));
    console.log(nextTime.toLocaleString())
    return nextTime;
}
function calculateNextTime2(schedule) {
    const now = new Date();
    const nextTime = new Date(now);
    
    if(schedule==1){
        nextTime.setMinutes(nextTime.getMinutes()+1)
    }
    else if(schedule==2){
        nextTime.setHours(nextTime.getHours() + 1);
    }
    else if(schedule==3){
        nextTime.setHours(nextTime.getHours() + 24);
    }
    
    // Add days to the nextTime
    // console.log(hours, minutes, seconds)
    // // Add hours, minutes, and seconds to the nextTime
    // nextTime.setHours(nextTime.getHours() + parseInt(hours));

    // nextTime.setMinutes(nextTime.getMinutes() + parseInt(minutes));
    // nextTime.setSeconds(nextTime.getSeconds() + parseInt(seconds));
    console.log(nextTime.toLocaleString())
    return nextTime;
}
module.exports = {
    handleSchedule,
    testCorn,
    closeAllSchedules,
    stopScheduleUsingJobID
}