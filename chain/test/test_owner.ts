import axios from "axios"
import fs from "fs"


// password
let password: string;
try{
    password = (fs.readFileSync("../secret/.secret-pw")).toString()
}catch{
    password = (fs.readFileSync("/home/stephensb/sb-labs/secret/.secret-pw")).toString()
}


const removeList = {
    names: ["Steve"]
}

const main = async () =>{

    await remove();

    process.exit();
}

const remove = async () =>{
    const formdata = new FormData();
    formdata.append('data', JSON.stringify(removeList))

    const resp = await axios.post("http:localhost:3001/owner/remove", {password: password, removeList: removeList.names})

    console.log(resp)
    
}
main()

