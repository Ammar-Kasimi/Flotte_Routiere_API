const camionService = require('../services/camionService');

class CamionController{
    async create(req,res,next){
        try{
        let camion = await camionService.createCamion(req.body)
        res.status(201).json({success:true,data:camion})
        }catch(error){
            next(error)
        }
    }
    async getAll(req,res,next){
        try{
            let camions= await camionService.getAllCamions()
            res.status(200).json({success:true,data:camions})
        }catch(error){
            next(error)
        }
        

    }
    async getById(req, res, next) {
        try {
            const camion = await camionService.getCamionById(req.params.id);
            res.status(200).json({ success: true, data: camion });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const camion = await camionService.updateCamion(req.params.id, req.body);
            res.status(200).json({ success: true, data: camion });
        } catch (error) {
            next(error);
        }
    }

    async archive(req, res, next) {
        try {
            const camion = await camionService.archiveCamion(req.params.id);
            res.status(200).json({ success: true, message: 'Camion archivé avec succès', data: camion });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CamionController();
