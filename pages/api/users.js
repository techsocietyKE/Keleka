
import {mongooseConnect} from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handle(req,res){
   const {method} = req;
   await mongooseConnect()


    if (method === 'GET') {
        if  (req.query.id) {
            res.json(await User.findOne({_id:req.query.id}))
        }else{
            res.json(await User.find())
        }
    }


    if (method === 'POST') {
        const { fullname, email, role,phoneNumber,idnumber, password } = req.body;
    
        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
    
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const userDoc = await User.create({
            fullname,
            phoneNumber,
            email,
            role,
            idnumber,
            password: hashedPassword
        });
    
        res.json(userDoc);
    }
    

    if (method === "PUT"){
        const {fullname,email,role,phoneNumber,password: hashedPassword,idnumber,_id} = req.body;
        await User.updateOne({_id},{fullname,role,phoneNumber,email,password: hashedPassword,idnumber})
        res.json(true)
    }
    if (method === 'DELETE'){
        if(req.query?.id){
            await User.deleteOne( { _id : req.query?.id });
            res.json(true)
        }
    }
}