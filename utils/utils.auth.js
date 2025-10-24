export function authCheck(req,res){
    if(!req.isAdmin){
        res.status(403).send("Forbidden: You do not have access to this resource.");
        return false;
    } else return true
}