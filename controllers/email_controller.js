const EmailModel = require("../schemas/emailSchema");

const ContactList = require("../schemas/contactListSchema");
const { verifyToken } = require("../middlewares/middleware");
const { decodeToken } = require("../controllers/auth_controllers");
const e = require("express");


const uploadEmailsController = async (req, res) => {
    try {
        const { _id } = await decodeToken(req.headers.authorization);
        const { emails } = req.body;

        const emailsWithOwnerId = emails.map(email => ({
            ...email,
            owner: _id
        }));
        // await saveEmailsWithOwnerId(emailsWithOwnerId);
        await saveEmailsWithOwnerId2(_id, emailsWithOwnerId);

        console.log("Sending response...")
        res.status(200).json({
            "success": true,
            "msg": "Email added successfully"
        })

    } catch (error) {

    }
}

async function checkEmailExists(email, owner) {
    console.log("checking...")
    const existingEmail = await EmailModel.findOne({ email, owner });
    return existingEmail; // Returns true if the email exists, false otherwise
}




async function saveEmailsWithOwnerId(emailsWithOwnerId) {
    let savedEmailsIds = new Set();

    for (const email of emailsWithOwnerId) {
        const emailExists = await checkEmailExists(email.email, email.owner);


        if (!emailExists) {
            console.log("Saving email...")
            
            try {
                const newEmail = new EmailModel(email);
                let add = await newEmail.save();
                savedEmailsIds.add(add._id);
                console.log("Email saved successfully.");
            } catch (error) {
                console.log("Error saving email:", error)
            }
        }
        else {
            try {
                savedEmailsIds.add(emailExists._id);
            } catch (error) {

            }

        }
    }
    savedEmailsIds = [...new Set(savedEmailsIds)];
    return savedEmailsIds;
}

const getSingleEmailController = async (req, res) => {
    try {
        const { _id } = await decodeToken(req.headers.authorization);
        const { id } = req.params;
        const email = await EmailModel.findOne({ _id: id, owner: _id });
        res.status(200).json({
            "success": true,
            "email": email
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}

const deleteEmailController = async (req, res) => {
    try {
        const { _id } = await decodeToken(req.headers.authorization);
        const { id } = req.params;
        const deleted = await ContactList.updateMany({ emails: id }, { $pull: { emails: id }, $inc: { elementCount: -1 } })

        await EmailModel.deleteOne({ _id: id, owner: _id });
        res.status(200).json({
            "success": true,
            "msg": "Email deleted successfully"
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": error.message
        })
    }
}

const getEmailsController = async (req, res) => {
    try {
        const { _id } = await decodeToken(req.headers.authorization);
        const contacts = await EmailModel.find({ owner: _id });
        console.log(contacts.length)
        console.log(_id)
        res.status(200).json({
            "success": true,
            "contacts": contacts
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}



// handle emails to the contact list
const addEmailsToContactListController = async (req, res) => {
    try {
        const { _id } = await decodeToken(req.headers.authorization);
        
        const { contactListId, emails } = req.body;
        
        
        const contactList = await ContactList.findOne({ _id: contactListId });
        if (contactList.owner == _id) {
            const emailsWithOwnerId = emails.map(email => ({
                ...email,
                owner: _id
            }));
            const emailIds = await saveEmailsWithOwnerId2(_id,emailsWithOwnerId);
            // delete those ids that are already in the contact list, match with _id
            const filteredEmailIds = emailIds.filter(emailId => !contactList.emails.includes(emailId));
            contactList.emails = [...contactList.emails, ...filteredEmailIds];
            contactList.elementCount = contactList.emails.length;


            await contactList.save();
            res.status(200).json({
                "success": true,
                "msg": "Emails added to contact list successfully"
            })
        } else {
            res.status(400).json({
                "success": false,
                "msg": "You are not the owner of this contact list"
            })
        }
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": error.message
        })
    }
}

async function saveEmailsWithOwnerId2(owner, emailsWithOwnerId2) {
    let savedEmailsIds = new Set(); 
    let emailsToBeCreated = [];
    try {
        console.log("in part 2")
        const emailsWithOwnerId = emailsWithOwnerId2.filter((email, index, self) =>
            email.email !== '' && email.email && email.email.trim() !== '' &&
            index === self.findIndex((t) => t.email === email.email && t.email !== '')
        );

          
        
        
        const existingEmails = await EmailModel.find({ owner });
        
        for (const email of emailsWithOwnerId) {
            const emailExists = existingEmails.find(existingEmail => existingEmail.email === email.email);
        
            if (!emailExists) {
                
                emailsToBeCreated.push(email);

                // const newEmail = new EmailModel(email);
                // let add = await newEmail.save();
                // savedEmailsIds.add(add._id);
                
                // console.log("Email saved successfully.");

            }
            else {
                if(emailExists.owner == owner)
                    savedEmailsIds.add(emailExists._id);                
            }
        }
    } catch (error) {
        console.log("Error saving email:", error)
    }
    
    console.log("emailsToBeCreated",emailsToBeCreated.length)

    if(emailsToBeCreated.length > 0){
    const insertedEmails = await EmailModel.insertMany(emailsToBeCreated);
    const insertedEmailsIds = insertedEmails.map(email => email._id);
    
    savedEmailsIds = [...savedEmailsIds,...insertedEmailsIds];
    }
    savedEmailsIds = [...new Set(savedEmailsIds)];
    return savedEmailsIds;
}


const getAllEmailsController = async (req, res) => {
    try {
        const { _id } = await decodeToken(req.headers.authorization);
        const emails = await EmailModel.find({ owner: _id });
        res.status(200).json({
            "success": true,
            "emails": emails
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}

const updateEmailController = async (req, res) => {
    try {
        const { _id } = await decodeToken(req.headers.authorization);
        
        const { email_id,email } = req.body;
        // find the email
        const emailExists = await EmailModel.findOne({ _id: email_id, owner: _id });
        if (emailExists) {
            emailExists.email = email;
            await emailExists.save();
            res.status(200).json({
                "success": true,
                "msg": "Email updated successfully",
                "email": emailExists
            })
        } else {
            res.status(400).json({
                "success": false,
                "msg": "Email not found"
            })
        }
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}

module.exports = {
    uploadEmailsController, getEmailsController,
    addEmailsToContactListController,
    getSingleEmailController,
    deleteEmailController,
    getAllEmailsController,
    updateEmailController

}

