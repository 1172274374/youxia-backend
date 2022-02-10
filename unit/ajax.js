module.exports = {
    ajax:function(url){
        return new Promise((resolve,reject)=>{
            let xhr=XMLHttpRequest();
            xhr.open('get',url);
            xhr.onreadystatechange=function(){
                if(xhr.readystate === 4 && xhr.status === 200){
                        resolve(JSON.parse(xhr.responseText))
                }else{
                        reject(new Error('404 not found'))
                }
            }
        }).catch(err=>{
            console.log(err);
        })
    }
}