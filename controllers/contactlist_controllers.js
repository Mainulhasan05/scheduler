const ContactList = require("../schemas/contactListSchema");
const Email = require("../schemas/emailSchema");
const {decodeToken} = require("../controllers/auth_controllers");
const createContactListController = async (req, res) => {
    try {
        const { name } = req.body;
        console.log(name)
        const owner = await decodeToken(req.headers.authorization);

        const newContactList = new ContactList({ name, owner });
        const savedContactList = await newContactList.save();
        res.status(200).json({
            "success": true,
            "msg": "Contact List added successfully",
            "contactList": savedContactList
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}

const getContactListsController = async (req, res) => {
    try {
        
        const { _id } = await decodeToken(req.headers.authorization);
        const contactLists = await ContactList.find({ owner: _id }).select('name createdAt elementCount');;
        res.status(200).json({
            "success": true,
            "contactLists": contactLists
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}



const deleteContactListController = async (req, res) => {
    try {
        const { id } = req.params;
        
        await ContactList.deleteOne({ _id: id });
        res.status(200).json({
            "success": true,
            "msg": "Contact List deleted successfully"
        })
        
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}

const getSingleContactListController = async (req, res) => {
    try {
        
        const { id } = req.params;

        const { _id } = await decodeToken(req.headers.authorization);
        // check if the contact list belongs to the user , populate emails array
        
        const pageNumber = 1; // Desired page number
        const pageSize = 10; // Number of emails per page
        const skipCount = (pageNumber - 1) * pageSize;
        // const contactList = await ContactList.findOne({ _id: id, owner: _id }).populate("emails");
        const contactList = await ContactList.findOne({ _id: id, owner: _id }).populate({
            path: "emails",
            // options: { skip: skipCount, limit: pageSize }
          });
        
        res.status(200).json({
            "success": true,
            "contactList": contactList
        })

    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}


const getListThatContainAnEmailController = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id } = await decodeToken(req.headers.authorization);
        console.log(id)
        console.log(_id)
        const contactLists = await ContactList.find({ owner: _id, emails: id }).select('name createdAt elementCount');;
        console.log(contactLists)
        res.status(200).json({
            "success": true,
            "contactLists": contactLists
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}

const addSingleEmailToContactListController = async (req, res) => {
    try {
        
        const { email_id,contactListId } = req.body;
        const { _id } = await decodeToken(req.headers.authorization);
        const contactList = await ContactList.findOne({ _id: contactListId, owner: _id });
        if (contactList) {
            contactList.emails.push(email_id);
            contactList.elementCount = contactList.emails.length;
            await contactList.save();
            res.status(200).json({
                "success": true,
                "msg": "Email added successfully"
            })
        } else {
            res.status(400).json({
                "success": false,
                "msg": "Error occured"
            })
        }
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": error.message
        })
    }
}

const deleteContactListAndConacts= async (req, res) => {
    try {
        const { id } = req.params;
        const { _id } = await decodeToken(req.headers.authorization);
        const contactList = await ContactList.findOne({ _id: id, owner: _id });
        if (!contactList) {
            res.status(400).json({
                "success": false,
                "msg": "Contact List not found"
            })
        }
        const emailIds= contactList.emails;
        await ContactList.deleteOne({ _id: id, owner: _id });

        await Email.deleteMany({ _id: { $in: emailIds } });
        const otherContactLists = await ContactList.find({
            emails: { $in: emailIds },
        });
      
          // Step 4: Remove the email IDs from other ContactList models
        //   await ContactList.updateMany(
        //     { _id: { $in: otherContactLists.map((cl) => cl._id) } },
        //     { $pull: { emails: { $in: emailIds } } }
        //   );
        await ContactList.updateMany(
            { _id: { $in: otherContactLists.map((cl) => cl._id) }, emails: { $in: emailIds } },
            {
              $pull: { emails: { $in: emailIds } },
              $inc: { elementCount: -emailIds.length },
            }
          );
        res.status(200).json({
            "success": true,
            "msg": "Contact List deleted successfully"
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": error.message
        })
    }
}




module.exports = {
    createContactListController,
    getContactListsController,
    deleteContactListController,
    getSingleContactListController,
    getListThatContainAnEmailController,
    addSingleEmailToContactListController,
    deleteContactListAndConacts
}