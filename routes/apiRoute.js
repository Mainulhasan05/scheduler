const router = require("express").Router();
const { verifyToken } = require("../middlewares/middleware")
// const {uploadEmailsController}=require("../controllers/upload")
const { addTemplateController, getTemplatesController
    , deleteTemplateController, getSingleTemplateController,
    updateTemplateController
} = require("../controllers/template_controllers")

const { uploadEmailsController, getEmailsController,
    addEmailsToContactListController, getAllEmailsController,
    updateEmailController,
    getSingleEmailController, deleteEmailController } = require("../controllers/email_controller")
// contact list
const { createContactListController, getSingleContactListController, deleteContactListController
    , getContactListsController, getListThatContainAnEmailController,
    addSingleEmailToContactListController, deleteContactListAndConacts
} = require("../controllers/contactlist_controllers")
const {
    createCampaign,
    getCampaigns,
    deleteCampaign
} = require("../controllers/campaign_controllers")

const { handleSchedule,testCorn,closeAllSchedules,
    getRunningSchedules,stopScheduleUsingJobID
 } = require("../controllers/scheduler_controllers")

const { sendMail } = require("../controllers/mail_sender")


router.post("/upload_emails", verifyToken, uploadEmailsController)
// router.post("/add_template",verifyToken,addTemplateController)
// router.get("/get_templates",verifyToken,getTemplatesController)
// router.delete("/delete_template/:id",verifyToken,deleteTemplateController)
// router.put("/update_template/:id",verifyToken,updateTemplateController)

router.post("/add_template", addTemplateController)
router.get("/get_templates", getTemplatesController)
router.delete("/delete_template/:id", deleteTemplateController)
router.get("/get_template/:id", getSingleTemplateController)
router.put("/update_template/:id", updateTemplateController)


// email controller
// router.post("/add_email",verifyToken,addEmailController)
// router.get("/get_emails",verifyToken,getEmailsController)
// router.delete("/delete_email/:id",verifyToken,deleteEmailController)
// router.get("/get_email/:id",verifyToken,getSingleEmailController)
// router.put("/update_email/:id",verifyToken,updateEmailController)

router.post("/import_contacts", uploadEmailsController)
router.post("/import_contacts_to_list", addEmailsToContactListController)
router.get("/get_emails", getEmailsController)
router.delete("/delete_email/:id", deleteEmailController)
router.get("/get_email/:id", getSingleEmailController)
router.post("/update_contact", updateEmailController)
// router.put("/update_email/:id",updateEmailController)


// contact list apis
// router.post("/add_contact_list",verifyToken,addContactListController)
// router.get("/get_contact_lists",verifyToken,getContactListsController)
// router.delete("/delete_contact_list/:id",verifyToken,deleteContactListController)
// router.get("/get_contact_list/:id",verifyToken,getSingleContactListController)
// router.put("/update_contact_list/:id",verifyToken,updateContactListController)

router.post("/create_contact_list", createContactListController)
router.get("/get_contact_lists", getContactListsController)
router.delete("/delete_contact_list/:id", deleteContactListController)
router.get("/get_contact_list/:id", getSingleContactListController)
router.get("/get_list_that_contain_an_email/:id", getListThatContainAnEmailController)
router.post("/add_single_email_to_list", addSingleEmailToContactListController)
router.delete("/delete_contact_list_and_contacts/:id", deleteContactListAndConacts)

// router.put("/update_contact_list/:id",updateContactListController)



// scheduler email sender
router.post("/send_schedule_emails", handleSchedule)

// campaign
router.post("/create_campaign", createCampaign)
router.get("/get_campaigns", getCampaigns)
router.delete("/delete_campaign/:id", deleteCampaign)



router.post("/send_email", sendMail)
router.get("/test_corn",testCorn)
router.get("/close_all_schedules", closeAllSchedules)
router.get("/stop_schedule/:jobId", stopScheduleUsingJobID)
// router.get("/get_running_schedules", getRunningSchedules)
module.exports = router;