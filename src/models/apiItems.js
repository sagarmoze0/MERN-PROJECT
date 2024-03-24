const mongoose=require('mongoose')
const apiSchema=new mongoose.Schema(
    {
        id: {type: Number, required: ''},
        title: {type: String, required: ''},
        price: {type: Number, required: ''},
        description: { type: String, required: ''},
        category: {type: String, required: ''},
        image: {type: String, required: ''},
        sold : {type: String, required: ''},
        dateOfSale: { type: Date, default: Date.now } 
    },
    {
        timestamps: true
    }
)

const ApiModel=mongoose.model('apiItems',apiSchema)

module.exports=ApiModel