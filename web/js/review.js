$(function () {
    $('.logo.top').addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).removeClass('animated zoomIn');
    });
    $('.logotitle').addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).removeClass('animated zoomIn');
    });

    table = $('#dynamic-table').DataTable({
        "aaSorting": [[0, "asc"]],
        "paging": false,
        "ordering":true,
        "info": false,
        "searching": false,
        "autoWidth":false,
    });

    getAllPapers();

});
//download
$(document).on("click",".paperdown",function(){
    var pid=$(this).parents("tr").children("td").eq(0).text();
    var name=$(this).text();
    downloadFile(pid,name)
})
//accept
$(document).on("click",".btn_accept",function(){
    var pid=$(this).parents("tr").children("td").eq(0).text();
    changePaperStatus(pid,"accepted",$(this).parents("tr").children("td"));

})
//reject
$(document).on("click",".btn_reject",function(){
    var pid=$(this).parents("tr").children("td").eq(0).text();
    changePaperStatus(pid,"rejected",$(this).parents("tr").children("td"));

})

function getAllPapers() {
    axios({
        method: 'post',
        url: '/GetAllPaperServlet'
    })
        .then(function(data){
            //console.log(data);
            table.clear().draw();
            for(i=0;i<data.data.length;i++){
                // console.log(data.data[i]);
                var article=data.data[i];
                if(article.Status=="saved"){
                    continue;
                }
                //author
                var Authors="";
                for(j=0;j<article.Authors.length;j++){
                    var author=article.Authors[j];
                    var ins_arr=author.ins.split(';');
                    var ins_str="";
                    for(k=0;k<ins_arr.length;k++)
                    {
                        ins_str+=ins_arr[k];
                        if(k!=ins_arr.length-1){
                            ins_str+="; <br>"
                        }
                    }

                    Authors+="["+(j+1)+"]"+"."+author.title+author.firstName+" "+author.lastName+", "+ins_str;
                    if(j!=article.Authors.length-1){
                        Authors+="; <br>"
                    }
                }
                //date
                var date=article.Date;
                var year=1900+date.year;
                var Date=year+"/"+(date.month+1)+"/"+date.date+" "+date.hours+":"+date.minutes+":"+date.seconds;
                //btn
                var btn="<a role='button' class='btn btn-success btn_accept pull-left' style='font-size: 16px;width: 100%'>Accept</a>" +
                    "<a role='button' class='btn btn-danger btn_reject pull-left' style='font-size: 16px;width: 100%;margin-top:2px'>Reject</a>";

                //Keywords
                var keywords_str="";
                var Keywords=article.Keywords;
                for(j=0;j<Keywords.length;j++){
                    keywords_str+=Keywords[j];
                    if(j!=Keywords.length-1){
                        keywords_str+=", ";
                    }
                }
                //Status
                var status=generateLabel(article.Status);

                //FullPaper
                var fullPaper="none";
                if(article.FilePath!=""){
                    var path_arr=article.FilePath.split('/');
                    fullPaper="<a class='paperdown' href='javascript:void(0)'>"+path_arr[path_arr.length-1]+"</a>";
                }
                table.row.add([article.PID,article.Owner.name+" "+article.Owner.email,article.Title,Authors,article.Abstract,keywords_str,fullPaper,Date,status,btn]).draw();
            }

        }).catch(function(err){
        console.log(err)
        alert("getPaper error");
    })
}

function downloadFile(pid,name){
    var params = new URLSearchParams();
    params.append("pid", pid);

    axios({
        method: 'post',
        params: params,
        url: '/DownloadFileServlet',
        responseType:'blob'
    })
        .then(function(res){
            console.log(res)
            var content = res.data
            var blob = new Blob([content])
            var fileName = name

            if ('download' in document.createElement('a')) { // 非IE下载
                var elink = document.createElement('a')
                elink.download = fileName
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
                document.body.removeChild(elink)
            } else { // IE10+下载
                navigator.msSaveBlob(blob, fileName)
            }

        })
        .catch(function(err){

        })

}

function changePaperStatus(pid,status,tds){
    var params = new URLSearchParams();
    params.append("pid", pid);
    params.append("status",status);

    axios({
        method: 'post',
        params: params,
        url: '/ChangePaperStatusServlet',

    })
        .then(function(res){
            var td=tds.eq(tds.length-2);
            td.text("");
            td.append(generateLabel(status))

        })
        .catch(function(err){

        })

}

function getClass(status){
    var cla;
    switch(status){
        case "received":
            cla="info";
            break;
        case "accepted":
            cla="success";
            break;
        case "rejected":
            cla="danger";
            break;
    }
    return cla;
}

function generateLabel(status) {

    var cla=getClass(status);

    var label="<br><center><span class='label label-"+cla+"' style='font-size:16px;margin-top:2px;'>"+status+"</span></center>"
    return label;
}

