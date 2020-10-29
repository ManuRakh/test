var fs = require('fs');
var axios = require('axios');
const { parse } = require('node-html-parser');
const url = process.argv[2]
const dir = process.argv[3]
// const file_path = `${dir}/${url}`

download_image(url, dir)
async function download_image(url, dir){
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    const download_url = await get_url(url)
    download_file_to_dir(download_url, dir)
}
async function get_url(url){
    var data = '';
    var config = {
    method: 'get',
    url: url,
    headers: { 
    },
    data : data
    };
    let response = await axios(config)
    response = response.data
    const root = parse(response);
        for(const meta of root.querySelectorAll('meta')){
            if(meta.rawAttrs.indexOf('property="og:image"')>=0){
                const split_arr = meta.rawAttrs.toString().split('property="og:image" content=')[1].replace("'\"", '').replace("\"", '').replace("\"", '')      
                return split_arr
            }
        }
}
function download_file_to_dir(url, dir){
    axios.get(url, {responseType: "stream"} )  
                .then(response => {  
                // Saving file to working directory  
                    response.data.pipe(fs.createWriteStream(dir+"/random_name.jpg"));  
                    console.log("SUCCESS")
                })
}