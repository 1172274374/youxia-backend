var li_list = document.querySelectorAll('.contact ul li')
var contact = document.querySelector('.contact')
var cart_ul = document.querySelector('.contact ul')

var x = 0

window.onload = function(){
    var time = setInterval(()=>{

        if(x<li_list.length-1){
            x++
        }else{
            x=0
        }
        li_list.forEach((item)=>{
            item.style.width = 150 + 'px'
        })

        li_list[x].style.width = 460 + 'px'

    },1000)

    li_list.forEach((item)=>{
        
        item.onmouseenter = function(){
            clearInterval(time)
            li_list.forEach((item)=>{
                item.style.width = 150 + 'px'
            })
            
            this.style.width = 460 + 'px'
        }
    })


    li_list.forEach((item)=>{
            
        item.onmouseout = function(event){
            var event = event || window.event;
            if(event.stopPropagation){
                event.stopPropagation();
            }else{
                event.cancelBubble = true;
            }
        }
    })

    cart_ul.onmouseout = function(){
        var time = setInterval(()=>{

            if(x<li_list.length-1){
                x++
            }else{
                x=0
            }
            li_list.forEach((item)=>{
                item.style.width = 150 + 'px'
            })
    
            li_list[x].style.width = 460 + 'px'
    
        },1000)
    }


}

