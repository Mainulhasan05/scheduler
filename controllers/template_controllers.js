
const jwt = require("jsonwebtoken");
const Template = require("../schemas/templateSchema");

const addTemplateController = async (req, res) => {
    try {
        const {_id} = await decodeToken(req.headers.authorization);
        const { subject, body } = req.body
        const newTemplate = new Template({ subject, body, "owner":_id })
        const savedTemplate = await newTemplate.save();
        
        res.status(200).json({
            "success": true,
            "msg": "Template added successfully",
            "template": savedTemplate
        })

    } catch (error) {

        res.status(400).json({
            "success": false,
            "msg": error.message
        })
    }
}

const getTemplatesController = async (req, res) => {
    try {
        
        const {_id} = await decodeToken(req.headers.authorization);
        
        const templates = await Template.find({ owner:_id }, { subject: 1, updatedAt: 1 });
        
        res.status(200).json({ 
            "success": true,
            "templates": templates })

    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": error.message
        })
    }
}

const deleteTemplateController = async (req, res) => {
    try {
        
        const owner = await decodeToken(req.headers.authorization);
        const { id } = req.params;
        const template = await Template.findOne({ _id: id, owner });
        if (!template) {
            return res.status(400).json({
                "success": false,
                "msg": "Template not found"
            })
        }
        await Template.deleteOne({ _id: id, owner });
        res.status(200).json({
            "success": true,
            "msg": "Template deleted successfully"
        })
    }
    catch (error) {
        res.status(400).json({
            "success": false,
            "msg": error.message
        })
    }
}

const getSingleTemplateController = async (req, res) => {
    try {

        const owner = await decodeToken(req.headers.authorization);
        const { id } = req.params;
        const template = await Template.findOne({ _id: id, owner });
        
        if (!template) {
            return res.status(400).json({
                "success": false,
                "msg": "Template not found"
            })
        }
        res.status(200).json({
            "success": true,
            "template": template
        })
    }
    catch (error) {
        res.status(400).json({
            "success": false,
            "msg": error.message
        })
    }
}

const updateTemplateController = async (req, res) => {
    try {
        const owner = await decodeToken(req.headers.authorization);
        const { id } = req.params;
        const { subject, body } = req.body;
        // update template
        const template = await Template.findOne({ _id: id, owner });
        if (!template) {
            return res.status(400).json({
                "success": false,
                "msg": "Template not found"
            })
        }
        template.subject = subject;
        template.body = body;
        await template.save();
        res.status(200).json({
            "success": true,
            "msg": "Template updated successfully"
        })
    }
    catch (error) {
        res.status(400).json({
            "success": false,
            "msg": error.message
        })
    }
}


const decodeToken = async (token)=>{
    try {
        
        const decoded=jwt.verify(token,process.env.TOKEN_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

module.exports = {
    addTemplateController,
    getTemplatesController,
    deleteTemplateController,
    getSingleTemplateController,
    updateTemplateController
}