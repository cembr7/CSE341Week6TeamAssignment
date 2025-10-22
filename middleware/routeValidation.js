const mongoose = require('mongodb');

const validateAllContacts = (req, res, next) => {

    if (req.query.page && isNaN(req.query.page)) {        
        return res.status(400).json({            
            message: 'Invalid query parameter: page must be a number'        
        }); 
    }       
 
    if (req.query.limit && isNaN(req.query.limit)) {        
        return res.status(400).json({            
            message: 'Invalid query parameter: limit must be a number'        
        });    
    }    next();
}

const validateSingleContact = (req, res, next) => {
    const {id} = req.params.id;

    // Validate that ID parameter exists   
    /*if (!id) { 
    return res.status(400).json({           
        message: 'Contact ID is required'        
    });    
           
}    */
 
    // Validate MongoDB ObjectId format   
    if (!mongoose.Types.ObjectId.isValid(id)) {     
    return res.status(400).json({           
        message: 'Invalid contact ID format. Must be a valid MongoDB ObjectId (24 hex characters).',           
        providedId: id        
    });    
    }   

    next();
        
}
module.exports = {validateAllContacts, validateSingleContact};

