const CampaignModel = require("../schemas/campaignSchema");
const schedulerSchema = require("../schemas/schedulerSchema");
const { decodeToken } = require("./auth_controllers");

const createCampaign = async (req, res) => {
    try {
        const { _id } = await decodeToken(req.headers.authorization);
        const { name, type, description, schedule, status } = req.body;
        const campaign = new CampaignModel({
            name,
            type,
            description,
            schedule,
            status:1,
            owner: _id
        });
        await campaign.save();
        res.status(200).json({
            "success": true,
            "msg": "Campaign created successfully"
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}

const getCampaigns = async (req, res) => {
    try {
        const { _id } = await decodeToken(req.headers.authorization);
        const campaigns = await CampaignModel.find({ owner: _id });
        res.status(200).json({
            "success": true,
            "msg": "Campaigns fetched successfully",
            "campaigns": campaigns
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}

const deleteCampaign = async (req, res) => {
    try {
        const { _id } = await decodeToken(req.headers.authorization);
        const { campaign_id } = req.body;
        const campaign = await CampaignModel.findOne({ _id: campaign_id, owner: _id });
        if (campaign) {
            await CampaignModel.deleteOne({ _id: campaign_id, owner: _id });
            res.status(200).json({
                "success": true,
                "msg": "Campaign deleted successfully"
            })
        } else {
            res.status(400).json({
                "success": false,
                "msg": "Campaign not found"
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
    createCampaign,
    getCampaigns,
    deleteCampaign
}