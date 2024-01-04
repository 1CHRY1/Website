var table;
var fileExist="false";

// import nodemailer from 'nodemailer';
// let transporter = nodemailer.createTransport({
//     service: 'QQ', // 使用Gmail作为邮件服务商，你也可以使用其他服务商
//     auth: {
//         user: '2217173586@qq.com', // 你的电子邮件地址
//         pass: 'Chry221717' // 你的电子邮件密码或者应用程序专用密码
//     }
// });

$(function () {
    $('.logo.top').addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).removeClass('animated zoomIn');
    });
    $('.logotitle').addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).removeClass('animated zoomIn');
    });

    // $("input[name='submit_ins']").tagsinput({
    //
    //     trimValue:true
    // });

    $('#keywords').tagsinput({

        trimValue:true
    });

    $("#pid").css("display","none");

     table = $('#dynamic-table').DataTable({
        "aaSorting": [[0, "asc"]],
        "paging": false,
        "ordering":true,
        "info": false,
        "searching": false,
         "autoWidth":false,
    });

     //gender
    $('input').iCheck({
        //checkboxClass: 'icheckbox_square-blue',  // 注意square和blue的对应关系
        radioClass: 'iradio_flat-green',
        increaseArea: '0%' // optional

    });
    //btn popup
    $("[data-toggle='popover']").popover({
        trigger:"hover"
    });

    clearSubmit();

    axios.get('/LoadUserServlet', {})
        .then(function (response) {
            //console.log(response)
            if(response.data.email!="") {
                getArticleList();
                $("#nav_login").css("display", "none");
                $("#nav_space").css("display", "block");
                $("#nav_space").addClass("active");
                $("#nav_space").children("a")[0].innerText = "Welcome! " + response.data.name;
                $("#userName").text(response.data.name + " |");
                $("#userID").text(response.data.uid );
                $("#userName_submit").text(response.data.name);
                $("#Login").hide();
                $("#UserSpace").fadeIn();
                //$("#Submit_page").fadeIn();
            }
            else{
                $("#nav_login").css("display", "block");
                $("#nav_space").css("display", "none");
                $("#Login").fadeIn();
            }
        })
        .catch(function (error) {
            alert("Log in error")
        });

    $(window).scrollTop(0);

});

//Enter
function keyLogin(){
    if (event.keyCode==13)
    {
        if($("#Login").css("display")!="none"&&$("#resetPW").css("display")!="block"){
            document.getElementById("btn-login").click();
        }
        // else if($("#Submit_page").css("display")!="none"){
        //     if(document.activeElement.className!="tagsinput_event"&&document.activeElement.id!="uploadFile"){
        //         document.getElementById("submit").click();
        //     }
        //
        // }
    }}




//navigation
$(".nav-item").click(function () {

    $(".nav-item.active").each(function () {
        $($(this).children('a').data("href")).hide();
        $(this).removeClass("active");
    });
    $(this).addClass("active");
    $($(this).children('a').data("href")).fadeIn();
    $("#Register").hide();
    $("#Submit_page").hide();
    //$("#UserSpace").hide();
});

$("#nav_space").click(function(){
    getArticleList();
})

//turn to register
$(".register").click(function () {
    $("#nav_login").addClass("active");
    $("#Login").hide();
    $("#Register").show();
    $("#Submit_page").hide();
    $("#UserSpace").hide();
})
//turn to login
$(".login").click(function(){
    $("#nav_login").addClass("active");
    $("#Register").hide();
    $("#Login").show();
    $("#Submit_page").hide();
    $("#UserSpace").hide();
})

//reset
$("#btn-reset").click(function(){
    $("#login_account").val("");
    $("#login_password").val("");
})
//login
$("#btn-login").click(function () {
    if($("#login_account").val()==="")
    {
        alert("Account can not be empty");
        $("#login_account").focus();
        return;
    }
    else if($("#login_password").val()===""){
        alert("Password can not be empty");
        $("#login_password").focus();
        return;
    }
    else {
        var params = new URLSearchParams();
        params.append("email", $("#login_account").val().trim());
        params.append("password", $("#login_password").val());

        axios.post('/LoginServlet', params, {})
            .then(function (response) {
                if (response.data == 1) {
                    getArticleList();
                    axios.get('/LoadUserServlet', {})
                        .then(function (response) {
                            $("#nav_login").css("display", "none");
                            $("#nav_space").css("display", "block");
                            $("#nav_space").addClass("active");
                            $("#nav_space").children("a")[0].innerText = "Welcome! " + response.data.name;
                            $("#userName").text(response.data.name + " |");
                            $("#userID").text(response.data.uid );
                            $("#userName_submit").text(response.data.name);
                            $("#Login").hide();
                            $("#UserSpace").fadeIn();
                            //$("#Submit_page").fadeIn();
                        })
                        .catch(function (error) {
                            alert("Log in error")
                        });
                }
                else {
                    alert("Your account name or password is incorrect");
                    $("#login_password").focus();
                }
            })
            .catch(function (error) {
                alert("Login error")
            });
    }
})

//logout
$("#logout").click(function(){
    axios.get('/LogoutServlet', {
    })
        .then(function (response) {
            if(response.data.result=="success"){
                $("#nav_login").css("display","block");
                $("#nav_space").css("display","none");
                $("#nav_login").addClass("active");
                $("#UserSpace").hide();
                $("#Login").fadeIn();

                clearSubmit();
            }
        })
        .catch(function (error) {
            console.log(error);
        });
})

//back to userSpace
$("#userName_submit").click(function(){
    getArticleList();
    $("#Login").hide();
    $("#Register").hide();
    $("#Submit_page").hide();
    $("#UserSpace").show();
})

//to pay for register
$("#registration-fee").click(function(){
    $("#UserSpace").hide();
    $("#Payfor").show();
})

// //to fill the receiving invoices information
// $('.form-control-static .Receive_invoice').click(function () {
//     checkRadioSelection();
//     function checkRadioSelection() {
//         const selectedValue = $("input[name='Receive_invoices']:checked").val();
//         if (selectedValue === "Reporting") {
//             $("#postalAddress").show(); // 显示地址<span>元素
//             $("#postalAssociate").show(); // 显示联系人<span>元素
//             $("#postalPhone").show(); // 显示联系人电话<span>元素
//         } else {
//             $("#postalAddress").hide(); // 隐藏地址<span>元素
//             $("#postalAssociate").hide(); // 隐藏联系人<span>元素
//             $("#postalPhone").hide(); // 显示联系人电话<span>元素
//         }
//     }
// });
// //while start up
// $(document).ready(function() {
//     // 检查初始选中状态，并根据选项显示或隐藏相关元素
//     checkRadioSelection();
//     // 为name="Receive_invoices"的单选按钮添加事件监听器
//     $('input[type=radio][name=Receive_invoices]').change(function() {
//         // 根据选项显示或隐藏相关元素
//         checkRadioSelection();
//     });
//
//     // 根据选项显示或隐藏相关元素的函数
//     function checkRadioSelection() {
//         const selectedValue = $("input[name='Receive_invoices']:checked").val();
//         if (selectedValue === "Postal") {
//             $("#postalAddress").show(); // 显示地址<span>元素
//             $("#postalAssociate").show(); // 显示联系人<span>元素
//             $("#postalPhone").show(); // 显示联系人电话<span>元素
//         } else {
//             $("#postalAddress").hide(); // 隐藏地址<span>元素
//             $("#postalAssociate").hide(); // 隐藏联系人<span>元素
//             $("#postalPhone").hide(); // 显示联系人电话<span>元素
//         }
//     }
// });

//register
$("#register_btn").click(function(){
    if($("input[name='email']").eq(0).val().trim()==""){
        alert("Email can not be empty");
        return;
    }

    var email=$("input[name='email']").eq(0).val().trim();
    var reg=/^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    var reg1=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

    if(!reg.test(email)&&!reg1.test(email)) {
        alert("Please enter the correct email!");
        return;
    }


    //
    // if($("input[name='code']").eq(0).val().trim()==""){
    //     alert("Code can not be empty");
    //     return;
    // }

    if($("input[name='password']").eq(1).val().trim()==""){
        alert("Password can not be empty");
        return;
    }

    if($("input[name='password_again']").eq(0).val().trim()==""){
        alert("Password again can not be empty");
        return;
    }

    if($("input[name='password']").eq(1).val()!=$("input[name='password_again']").eq(0).val()) {
        alert("Password and Confirm Password are inconsistent");
        return;
    }

    if($("input[name='name']").eq(0).val().trim()==""){
        alert("Name can not be empty");
        return;
    }
    //
    // if($("input[name='gender']")[0].checked==false&&$("input[name='gender']")[1].checked==false){
    //     alert("Please select gender");
    //     return;
    // }

    if($("#userTitle option:selected").val().trim()==""){
        alert("Name can not be empty");
        return;
    }

    if($("input[name='affiliation']").eq(0).val().trim()==""){
        alert("Affiliation can not be empty");
        return;
    }

    if ( (($("input[name='gender']").eq(0).is(":checked"))==false) && (($("input[name='gender']").eq(1).is(":checked"))==false)) {
        alert("gender can not be empty");
        return;
    }

    // if ( (($("input[name='visa']").eq(0).is(":checked"))==false) && (($("input[name='visa']").eq(1).is(":checked"))==false)) {
    //     alert("visa can not be empty");
    //     return;
    // }

    // axios.get('/AGAYGWG/ValidateCodeServlet', {
    //     params: {
    //         register_code: $("input[name='code']").eq(0).val().trim()
    //     }
    // })
    //     .then(function (response) {
    //         if(response.data==1){
                var user = {};
                var form = $(".register");
                for (i = 0; i < form.length; i++) {
                    user[form[i].name] = form[i].value;
                }


                if (($("input[name='gender']").eq(1).is(":checked"))==true)
                    user["gender"] = "Female";
                else
                    user["gender"] = "Male";

                // if (($("input[name='visa']").eq(1).is(":checked"))==true)
                //     user["visa"] = "Yes";
                // else
                //     user["visa"] = "No";

                user["title"] = $("#userTitle").val();
    //
                var params = new URLSearchParams();
                params.append("user", JSON.stringify(user));
    //
    //             //console.log(params);

                axios.post('/RegisterServlet', params, {})
                    .then(function (response) {
                        if(response.data.result=="true"){

                            $("input[name='email']").eq(0).val("")
                            //$("input[name='code']").eq(0).val("")
                            $("input[name='password']").eq(1).val("")
                            $("input[name='password_again']").eq(0).val("")
                            $("input[name='name']").eq(0).val("")
                            $("input[name='gender']").eq(0).attr("checked","checked");
                            $(".iradio_flat-green").eq(0).addClass("checked");
                            $(".iradio_flat-green").eq(1).removeClass("checked");
                            $("#userTitle").val("Mr.")
                            $("input[name='affiliation']").eq(0).val("")
                            $("input[name='position']").eq(0).val("")
                            $("input[name='major']").eq(0).val("")
                            $("input[name='education']").eq(0).val("")
                            $("input[name='phone']").eq(0).val("")

                            alert("Register successfully.");
                            $("#Register").hide();
                            $("#Login").show();
                            $("#Submit_page").hide();

                axios.post('/EmailDaoImpl',{
                    recipient: '2217173586@qq.com',
                    mailTitle: 'Hello',
                    mailContent: 'This is the content of the email.'
                    })
                    .then(response => {
                                // 处理成功结果
                                console.log(response);
                            })
                            .catch(error => {
                                // 处理错误
                                console.error(error);
                            })
                            // //给注册成功的用户邮箱发送邮件
                            // let mailOptions = {
                            //     from: '2217173586@qq.com',
                            //     to: '3307862402@qq.com',
                            //     subject: 'Hello from Node.js',
                            //     text: 'This is a test email sent from Node.js'
                            // };
                            // transporter.sendMail(mailOptions, function(error, info) {
                            //     if (error) {
                            //         console.log(error);
                            //     } else {
                            //         console.log('Email sent: ' + info.response);
                            //     }
                            // });
                        }
                        else if(response.data.result=="exist"){
                            alert("This email address has been registered,please change it.")
                        }
                        else{
                            alert("Register failed")
                        }
                    })
                    // .catch(function (error) {
                    //     alert("Register error")
                    // });
        //     }
        //     else {
        //         alert("Please enter the correct code")
        //     }
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });

    // if($("input[name='code']").eq(0).val().trim()==code) {
    //
    //     var user = {};
    //     var form = $(".register");
    //     for (i = 0; i < form.length; i++) {
    //         user[form[i].name] = form[i].value;
    //     }
    //     user["gender"] = $("input[name='gender']")[0].checked == true ? "Male" : "Female";
    //     user["title"] = $("#userTitle").val();
    //
    //     var params = new URLSearchParams();
    //     params.append("user", JSON.stringify(user));
    //
    //     //console.log(params);
    //
    //     axios.post('/AGAYGWG/RegisterServlet', params, {})
    //         .then(function (response) {
    //             if(response.data.result=="true"){
    //                 alert("Register success");
    //                 $("#Register").hide();
    //                 $("#Login").show();
    //                 $("#Submit_page").hide();
    //             }
    //             else if(response.data.result=="exist"){
    //                 alert("This email address has been registered,please change it.")
    //             }
    //             else{
    //                 alert("Register failed")
    //             }
    //         })
    //         .catch(function (error) {
    //             alert("Register error")
    //         });
    // }
    // else{
    //     alert("Please enter the correct code")
    // }
})

//check email
//var code;
// $("#check").click(function(){
//     if($("input[name='email']").eq(0).val().trim()==""){
//         alert("Email can not be empty");
//         return;
//     }
//     else {
//
//         axios.get('/AGAYGWG/ValidateEmailServlet', {
//             params: {
//                 email: $("input[name='email']").eq(0).val()
//             }
//         })
//             .then(function (response) {
//
//                 var result = response.data;
//                 if (result == "success") {
//                     $("input[name='code']").eq(0).focus();
//                     alert("Send email successfully, please check your mailbox.")
//                     //code = response.data.code;
//                 }
//                 else if (result == "exist") {
//                     alert("This email has been registered, please change your email.")
//                 }
//                 else {
//                     alert("Send email failed, please try again.")
//                 }
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     }
// })
//submit page
$("#submit_article").click(function () {
    clearSubmit();
    //$("#nav_space").addClass("active");
    $("#Login").hide();
    $("#Register").hide();
    $("#Submit_page").show();
    $("#UserSpace").hide();
    //$("#SubmitDDL").show();
})

//save
$("#save").click(function(){
    if (confirm("Are you sure to save this paper?")) {

        if($("textarea[name='title']").eq(0).val()==""){
            alert("Title can not be empty.");
            return;
        }

        $("#save").attr("disabled","disabled");
        $("#submit").attr("disabled","disabled");

        var data = new FormData();//重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传
        data.append("inputFile",$("#uploadFile")[0].files[0]);

        var params = new URLSearchParams();
        //params.append("email", $("#login_account").val());
        params.append("type","save");
        params.append("pid",$("input[name='pid']").eq(0).val());
        params.append("title",$("textarea[name='title']").eq(0).val());
        params.append("abstract",$("textarea[name='abstract']").eq(0).val());
        params.append("keywords",$("input[name='keywords']").eq(0).val());
        params.append("EPA",$("select[name='EPA']").eq(0).val());
        params.append("sess",$("select[name='sess']").eq(0).val());
        params.append("fileExist",fileExist);

        var authorInfo=new Array();
        var firstName=$("input[name='submit_first_name']");
        var lastName=$("input[name='submit_last_name']");
        var title=$("select[name='submit_title']");
        var country=$("select[name='submit_country']");
        var ins=$("textarea[name='submit_ins']");


        for(i=0;i<firstName.length;i++){
            if(firstName.eq(i).val()==""&&lastName.eq(i).val()==""&&ins.eq(i).val()==""){

            }
            else if(firstName.eq(i).val()!=""||lastName.eq(i).val()!=""||ins.eq(i).val()!=""){
                var author={};
                author["firstName"]=firstName.eq(i).val();
                author["lastName"]=lastName.eq(i).val();
                author["title"]=title.eq(i).val();
                author["country"]=country.eq(i).val();
                author["ins"]=ins.eq(i).val();

                authorInfo.push(author);
            }

        }
        params.append("authors",JSON.stringify(authorInfo));

        console.log("data:",data)
        // 发起一个POST请求
        axios({
            method: 'post',
            url: '/SubmitServlet',
            data: data,
            params:params
        })
            .then(function(data){
                if(data.data.result=="success"){
                    clearSubmit();

                    getArticleList();

                    alert("Save successfully!");
                    $("#Login").hide();
                    $("#Register").hide();
                    $("#Submit_page").hide();
                    $("#UserSpace").show();

                    $(".popover").remove();
                    $("#save").removeAttr("disabled");
                    $("#submit").removeAttr("disabled");
                }
                else
                {
                    alert("Save failed");
                    $(".popover").remove();
                    $("#save").removeAttr("disabled");
                    $("#submit").removeAttr("disabled");
                }
            }).catch(function(err){
            alert("Save error");
            $(".popover").remove();
            $("#save").removeAttr("disabled");
            $("#submit").removeAttr("disabled");
        })

    }
    else {

    }

})

//submit 验证登陆状态
$("#submit").click(function(){
    if (confirm("Are you sure to submit this paper?")) {

        if($("textarea[name='title']").eq(0).val()==""){
            alert("Title can not be empty.");
            return;
        }

        var data = new FormData();//重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传
        data.append("inputFile",$("#uploadFile")[0].files[0]);

        var params = new URLSearchParams();
        //params.append("email", $("#login_account").val());
        params.append("type","submit");
        params.append("pid",$("input[name='pid']").eq(0).val());
        params.append("title",$("textarea[name='title']").eq(0).val());
        params.append("abstract",$("textarea[name='abstract']").eq(0).val());
        params.append("keywords",$("input[name='keywords']").eq(0).val());
        params.append("EPA",$("select[name='EPA']").eq(0).val());
        params.append("sess",$("select[name='sess']").eq(0).val());
        params.append("fileExist",fileExist);

        var authorInfo=new Array();
        var firstName=$("input[name='submit_first_name']");
        var lastName=$("input[name='submit_last_name']");
        var title=$("select[name='submit_title']");
        var country=$("select[name='submit_country']");
        var ins=$("textarea[name='submit_ins']");

        if(firstName.eq(0).val()==""||lastName.eq(0).val()==""||ins.eq(0).val()=="")
        {
            alert("Please fill in the First Author information.");
            return;
        }

        for(i=0;i<firstName.length;i++){
            if(firstName.eq(i).val()!=""&&lastName.eq(i).val()!=""&&ins.eq(i).val()!=""){
                var author={};
                author["firstName"]=firstName.eq(i).val();
                author["lastName"]=lastName.eq(i).val();
                author["title"]=title.eq(i).val();
                author["country"]=country.eq(i).val();
                author["ins"]=ins.eq(i).val();

                authorInfo.push(author);
            }
            else if(firstName.eq(i).val()==""&&lastName.eq(i).val()==""&&ins.eq(i).val()==""){

            }
            else {
                alert("Please fill in author's information.");
                return;
            }
        }
        params.append("authors",JSON.stringify(authorInfo));

        // if($("textarea[name='abstract']").eq(0).val()==""){
        //     if($("#uploadFile")[0].files[0]==null){
        //         alert("You must submit Abstract or Menuscript.")
        //         $("#abstract").focus();
        //         return;
        //     }
        // }

        if($("select[name='EPA']").eq(0).val()==null||$("select[name='EPA']").eq(0).val()==""){
            if($("#uploadFile")[0].files[0]==null) {
                alert("\"Submit for EPA\" can not be empty.");
                $("#EPA").focus();
                return;
            }
        }
        if($("select[name='sess']").eq(0).val()==null||$("select[name='sess']").eq(0).val()==""){
            if($("#uploadFile")[0].files[0]==null) {
                alert("\"Session\" can not be empty.");
                $("#sess").focus();
                return;
            }
        }
        $("#save").attr("disabled","disabled");
        $("#submit").attr("disabled","disabled");

        // 发起一个POST请求
        axios({
            method: 'post',
            url: '/SubmitServlet',
            data: data,
            params:params
        })
            .then(function(data){
                if(data.data.result=="success"){
                    clearSubmit();

                    getArticleList();

                    alert("Submit successfully!");
                    $("#Login").hide();
                    $("#Register").hide();
                    $("#Submit_page").hide();
                    $("#UserSpace").show();

                    $(".popover").remove();
                    $("#save").removeAttr("disabled");
                    $("#submit").removeAttr("disabled");
                }
                else
                {
                    alert("Submit failed");
                    $(".popover").remove();
                    $("#save").removeAttr("disabled");
                    $("#submit").removeAttr("disabled");
                }
            }).catch(function(err){
                alert("Submit error");
                $(".popover").remove();
                $("#save").removeAttr("disabled");
                $("#submit").removeAttr("disabled");
            })
    }
    else {

    }

})
//get article
function getArticleList() {
    axios({
        method: 'post',
        url: '/GetArticleListServlet'
    })
        .then(function(data){
            //console.log(data);
            table.clear().draw();
            for(i=0;i<data.data.length;i++){
                // console.log(data.data[i]);
                var article=data.data[i];
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
                var edit_btn="<div class='btn-group' style='width:100%'><a role='button' class='btn btn-info btn_edit pull-left' style='font-size: 16px;width: 77%;'>Edit</a>" +
                    "<a role='button' class='btn btn-danger btn_remove pull-left' style='font-size: 16px;width: 20%;margin-left: 2%;'>✕</a></div>";
                var view_btn="<div class='btn-group' style='width:100%'><a role='button' class='btn btn-success btn_view pull-left' style='font-size: 16px;width:77%;'>View</a>" +
                    "<a role='button' class='btn btn-danger btn_remove pull-left' style='font-size: 16px;width: 20%;margin-left: 2%;'>✕</a></div>";
                var btn;
                if(article.Status=="saved"){
                    btn=edit_btn;
                }
                else{
                    btn=view_btn;
                }
                //Keywords
                var keywords_str="";
                var Keywords=article.Keywords;
                for(j=0;j<Keywords.length;j++){
                    keywords_str+=Keywords[j];
                    if(j!=Keywords.length-1){
                        keywords_str+=", ";
                    }
                }
                table.row.add([article.PID,article.Title,Authors,keywords_str,Date,btn]).draw();
            }

        }).catch(function(err){
            console.log(err)
        alert("getArticle error");
    })
}
//remove author
$(document).on("click", ".fa-times", function () {
    $(this).parents(".panel").eq(0).remove();
    author_num--;
    $(".fa-times").eq($(".fa-times").length-1).css("display","block")
});
//add author
var author_num = 1;
$(".author-add").click(function(){
    addAuthor();
});

function addAuthor() {
    author_num++;
    $(".fa-times").css("display","none");
    var content_box = $(".author-add").eq(0).parent().children('div');
    var str="<div class=\"panel\" style=\"border-color:#ccc\">\n" +
        "                            <div class=\"panel-heading\">\n" +
        "                            <h4 class=\"panel-title\">\n" +
        "                            <a class=\"accordion-toggle collapsed\" data-toggle=\"collapse\" aria-expanded=\"true\" href=\"#collapse"+author_num+"\">\n" +
        "                                <b>Author "+author_num+"</b>\n" +
        "                            </a>\n" +
        "                            </h4>\n" +
        "                                <a href=\"javascript:void(0);\" class=\"fa fa-times\"\n" +
        "                                   style=\"float:right;margin-top:-16px;color:black;font-size:10px\">✕</a>\n" +
        "                            </div>\n" +
        "                            <div id=\"collapse"+author_num+"\" class=\"panel-collapse collapse in\">\n" +
        "                            <div class=\"panel-body\">\n" +
        "                                <div>\n" +
        "                                    <lable class='control-label' style='font-size: 15px;font-weight: bold;'>\n" +
        "                                        <span style=\"font-size:18px;color: red;\">*</span> First Name:\n" +
        "                                    </lable>\n" +
        "                                    <div class='input-group col-sm-12'>\n" +
        "                                        <input type='text' name=\"submit_first_name\" class='form-control' style=\"font-weight: bold;\">\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                                <div>\n" +
        "                                    <lable class='control-label' style='font-size: 15px;font-weight: bold;'>\n" +
        "                                        <span style=\"font-size:18px;color: red;\">*</span> Last Name:\n" +
        "                                    </lable>\n" +
        "                                    <div class='input-group col-sm-12'>\n" +
        "                                        <input type='text' name=\"submit_last_name\" class='form-control' style=\"font-weight: bold;\">\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                                <div>\n" +
        "                                    <lable class='control-label' style='font-size: 15px;font-weight: bold;'>\n" +
        "                                        <span style=\"font-size:18px;color: red;\">*</span> Title:\n" +
        "                                    </lable>\n" +
        "                                    <div class='input-group col-sm-12'>\n" +
        "                                        <select class=\"form-control m-bot15\" name=\"submit_title\" style=\"font-weight: bold;\">\n" +
        "                                                <option value=\"Mr.\">Mr.</option>\n" +
        "                                                <option value=\"Mrs.\">Mrs.</option>\n" +
        "                                                <option value=\"Miss.\">Miss.</option>"+
        "                                                <option value=\"Dr.\">Dr.</option>\n" +
        "                                                <option value=\"Prof.\">Prof.</option>" +
        "                                         </select>\n" +
        "                                    </div>\n" +
        "                                    <lable class='control-label' style='font-size: 15px;font-weight: bold;'>\n" +
        "                                        <span style=\"font-size:18px;color: red;\">*</span> Country or Region:\n" +
        "                                    </lable>\n" +
        "                                    <div class='input-group col-sm-12'>\n" +
        "                                        <select class=\"form-control m-bot15\" name=\"submit_country\" style=\"font-weight: bold;\">\n" +
        "                                                <option value=\"Afghanistan\">Afghanistan</option>\n" +
        "                                                <option value=\"Aland Islands\">Aland Islands</option>\n" +
        "                                                <option value=\"Albania\">Albania</option>\n" +
        "                                                <option value=\"Algeria\">Algeria</option>\n" +
        "                                                <option value=\"American Samoa\">American Samoa</option>\n" +
        "                                                <option value=\"Andorra\">Andorra</option>\n" +
        "                                                <option value=\"Angola\">Angola</option>\n" +
        "                                                <option value=\"Anguilla\">Anguilla</option>\n" +
        "                                                <option value=\"Antarctica\">Antarctica</option>\n" +
        "                                                <option value=\"Antigua and Barbuda\">Antigua and Barbuda</option>\n" +
        "                                                <option value=\"Argentina\">Argentina</option>\n" +
        "                                                <option value=\"Armenia\">Armenia</option>\n" +
        "                                                <option value=\"Aruba\">Aruba</option>\n" +
        "                                                <option value=\"Australia\">Australia</option>\n" +
        "                                                <option value=\"Austria\">Austria</option>\n" +
        "                                                <option value=\"Azerbaijan\">Azerbaijan</option>\n" +
        "                                                <option value=\"Bahamas (The)\">Bahamas (The)</option>\n" +
        "                                                <option value=\"Bahrain\">Bahrain</option>\n" +
        "                                                <option value=\"Bangladesh\">Bangladesh</option>\n" +
        "                                                <option value=\"Barbados\">Barbados</option>\n" +
        "                                                <option value=\"Belarus\">Belarus</option>\n" +
        "                                                <option value=\"Belgium\">Belgium</option>\n" +
        "                                                <option value=\"Belize\">Belize</option>\n" +
        "                                                <option value=\"Benin\">Benin</option>\n" +
        "                                                <option value=\"Bermuda\">Bermuda</option>\n" +
        "                                                <option value=\"Bhutan\">Bhutan</option>\n" +
        "                                                <option value=\"Bolivia\">Bolivia</option>\n" +
        "                                                <option value=\"Bosnia and Herzegovina\">Bosnia and Herzegovina</option>\n" +
        "                                                <option value=\"Botswana\">Botswana</option>\n" +
        "                                                <option value=\"Bouvet Island\">Bouvet Island</option>\n" +
        "                                                <option value=\"Brazil\">Brazil</option>\n" +
        "                                                <option value=\"British Indian Ocean Territory (the)\">British Indian Ocean Territory (the)</option>\n" +
        "                                                <option value=\"Brunei Darussalam\">Brunei Darussalam</option>\n" +
        "                                                <option value=\"Bulgaria\">Bulgaria</option>\n" +
        "                                                <option value=\"Burkina Faso\">Burkina Faso</option>\n" +
        "                                                <option value=\"Burundi\">Burundi</option>\n" +
        "                                                <option value=\"Cambodia\">Cambodia</option>\n" +
        "                                                <option value=\"Cameroon\">Cameroon</option>\n" +
        "                                                <option value=\"Canada\">Canada</option>\n" +
        "                                                <option value=\"Cape Verde\">Cape Verde</option>\n" +
        "                                                <option value=\"Cayman Islands (the)\">Cayman Islands (the)</option>\n" +
        "                                                <option value=\"Central African Republic (the)\">Central African Republic (the)</option>\n" +
        "                                                <option value=\"Chad\">Chad</option>\n" +
        "                                                <option value=\"Chile\">Chile</option>\n" +
        "                                                <option value=\"China\">China</option>\n" +
        "                                                <option value=\"Christmas Island\">Christmas Island</option>\n" +
        "                                                <option value=\"Cocos (Keeling) Islands (the)\">Cocos (Keeling) Islands (the)</option>\n" +
        "                                                <option value=\"Colombia\">Colombia</option>\n" +
        "                                                <option value=\"Comoros\">Comoros</option>\n" +
        "                                                <option value=\"Congo\">Congo</option>\n" +
        "                                                <option value=\"Congo (the Democratic Republic of the)\">Congo (the Democratic Republic of the)</option>\n" +
        "                                                <option value=\"Cook Islands (the)\">Cook Islands (the)</option>\n" +
        "                                                <option value=\"Costa Rica\">Costa Rica</option>\n" +
        "                                                <option value=\"Côte d'Ivoire\">Côte d'Ivoire</option>\n" +
        "                                                <option value=\"Croatia\">Croatia</option>\n" +
        "                                                <option value=\"Cuba\">Cuba</option>\n" +
        "                                                <option value=\"Cyprus\">Cyprus</option>\n" +
        "                                                <option value=\"Czech Republic (the)\">Czech Republic (the)</option>\n" +
        "                                                <option value=\"Denmark\">Denmark</option>\n" +
        "                                                <option value=\"Djibouti\">Djibouti</option>\n" +
        "                                                <option value=\"Dominica\">Dominica</option>\n" +
        "                                                <option value=\"Dominican Republic (the)\">Dominican Republic (the)</option>\n" +
        "                                                <option value=\"Ecuador\">Ecuador</option>\n" +
        "                                                <option value=\"Egypt\">Egypt</option>\n" +
        "                                                <option value=\"El Salvador\">El Salvador</option>\n" +
        "                                                <option value=\"Equatorial Guinea\">Equatorial Guinea</option>\n" +
        "                                                <option value=\"Eritrea\">Eritrea</option>\n" +
        "                                                <option value=\"Estonia\">Estonia</option>\n" +
        "                                                <option value=\"Ethiopia\">Ethiopia</option>\n" +
        "                                                <option value=\"Falkland Islands (the) [Malvinas]\">Falkland Islands (the) [Malvinas]</option>\n" +
        "                                                <option value=\"Faroe Islands (the)\">Faroe Islands (the)</option>\n" +
        "                                                <option value=\"Fiji\">Fiji</option>\n" +
        "                                                <option value=\"Finland\">Finland</option>\n" +
        "                                                <option value=\"France\">France</option>\n" +
        "                                                <option value=\"French Guiana\">French Guiana</option>\n" +
        "                                                <option value=\"French Polynesia\">French Polynesia</option>\n" +
        "                                                <option value=\"French Southern Territories (the)\">French Southern Territories (the)</option>\n" +
        "                                                <option value=\"Gabon\">Gabon</option>\n" +
        "                                                <option value=\"Gambia (The)\">Gambia (The)</option>\n" +
        "                                                <option value=\"Georgia\">Georgia</option>\n" +
        "                                                <option value=\"Germany\">Germany</option>\n" +
        "                                                <option value=\"Ghana\">Ghana</option>\n" +
        "                                                <option value=\"Gibraltar\">Gibraltar</option>\n" +
        "                                                <option value=\"Greece\">Greece</option>\n" +
        "                                                <option value=\"Greenland\">Greenland</option>\n" +
        "                                                <option value=\"Grenada\">Grenada</option>\n" +
        "                                                <option value=\"Guadeloupe\">Guadeloupe</option>\n" +
        "                                                <option value=\"Guam\">Guam</option>\n" +
        "                                                <option value=\"Guatemala\">Guatemala</option>\n" +
        "                                                <option value=\"Guernsey\">Guernsey</option>\n" +
        "                                                <option value=\"Guinea\">Guinea</option>\n" +
        "                                                <option value=\"Guinea-Bissau\">Guinea-Bissau</option>\n" +
        "                                                <option value=\"Guyana\">Guyana</option>\n" +
        "                                                <option value=\"Haiti\">Haiti</option>\n" +
        "                                                <option value=\"Heard Island and McDonald Islands\">Heard Island and McDonald Islands</option>\n" +
        "                                                <option value=\"Holy See (the) [Vatican City State]\">Holy See (the) [Vatican City State]</option>\n" +
        "                                                <option value=\"Honduras\">Honduras</option>\n" +
        "                                                <option value=\"Hong Kong SAR, China\">Hong Kong SAR, China</option>\n" +
        "                                                <option value=\"Hungary\">Hungary</option>\n" +
        "                                                <option value=\"Iceland\">Iceland</option>\n" +
        "                                                <option value=\"India\">India</option>\n" +
        "                                                <option value=\"Indonesia\">Indonesia</option>\n" +
        "                                                <option value=\"Iran (the Islamic Republic of)\">Iran (the Islamic Republic of)</option>\n" +
        "                                                <option value=\"Iraq\">Iraq</option>\n" +
        "                                                <option value=\"Ireland\">Ireland</option>\n" +
        "                                                <option value=\"Isle of Man\">Isle of Man</option>\n" +
        "                                                <option value=\"Israel\">Israel</option>\n" +
        "                                                <option value=\"Italy\">Italy</option>\n" +
        "                                                <option value=\"Jamaica\">Jamaica</option>\n" +
        "                                                <option value=\"Japan\">Japan</option>\n" +
        "                                                <option value=\"Jersey\">Jersey</option>\n" +
        "                                                <option value=\"Jordan\">Jordan</option>\n" +
        "                                                <option value=\"Kazakhstan\">Kazakhstan</option>\n" +
        "                                                <option value=\"Kenya\">Kenya</option>\n" +
        "                                                <option value=\"Kiribati\">Kiribati</option>\n" +
        "                                                <option value=\"Korea (the Democratic People's Republic of)\">Korea (the Democratic People's Republic of)</option>\n" +
        "                                                <option value=\"Korea (the Republic of)\">Korea (the Republic of)</option>\n" +
        "                                                <option value=\"Kuwait\">Kuwait</option>\n" +
        "                                                <option value=\"Kyrgyzstan\">Kyrgyzstan</option>\n" +
        "                                                <option value=\"Lao People's Democratic Republic (the)\">Lao People's Democratic Republic (the)</option>\n" +
        "                                                <option value=\"Latvia\">Latvia</option>\n" +
        "                                                <option value=\"Lebanon\">Lebanon</option>\n" +
        "                                                <option value=\"Lesotho\">Lesotho</option>\n" +
        "                                                <option value=\"Liberia\">Liberia</option>\n" +
        "                                                <option value=\"Libyan Arab Jamahiriya (the)\">Libyan Arab Jamahiriya (the)</option>\n" +
        "                                                <option value=\"Liechtenstein\">Liechtenstein</option>\n" +
        "                                                <option value=\"Lithuania\">Lithuania</option>\n" +
        "                                                <option value=\"Luxembourg\">Luxembourg</option>\n" +
        "                                                <option value=\"Macao SAR, China\">Macao SAR, China</option>\n" +
        "                                                <option value=\"Macedonia (the former Yugoslav Republic of)\">Macedonia (the former Yugoslav Republic of)</option>\n" +
        "                                                <option value=\"Madagascar\">Madagascar</option>\n" +
        "                                                <option value=\"Malawi\">Malawi</option>\n" +
        "                                                <option value=\"Malaysia\">Malaysia</option>\n" +
        "                                                <option value=\"Maldives\">Maldives</option>\n" +
        "                                                <option value=\"Mali\">Mali</option>\n" +
        "                                                <option value=\"Malta\">Malta</option>\n" +
        "                                                <option value=\"Marshall Islands (the)\">Marshall Islands (the)</option>\n" +
        "                                                <option value=\"Martinique\">Martinique</option>\n" +
        "                                                <option value=\"Mauritania\">Mauritania</option>\n" +
        "                                                <option value=\"Mauritius\">Mauritius</option>\n" +
        "                                                <option value=\"Mayotte\">Mayotte</option>\n" +
        "                                                <option value=\"Mexico\">Mexico</option>\n" +
        "                                                <option value=\"Micronesia (the Federated States of)\">Micronesia (the Federated States of)</option>\n" +
        "                                                <option value=\"Moldova (the Republic of)\">Moldova (the Republic of)</option>\n" +
        "                                                <option value=\"Monaco\">Monaco</option>\n" +
        "                                                <option value=\"Mongolia\">Mongolia</option>\n" +
        "                                                <option value=\"Montenegro\">Montenegro</option>\n" +
        "                                                <option value=\"Montserrat\">Montserrat</option>\n" +
        "                                                <option value=\"Morocco\">Morocco</option>\n" +
        "                                                <option value=\"Mozambique\">Mozambique</option>\n" +
        "                                                <option value=\"Myanmar\">Myanmar</option>\n" +
        "                                                <option value=\"Namibia\">Namibia</option>\n" +
        "                                                <option value=\"Nauru\">Nauru</option>\n" +
        "                                                <option value=\"Nepal\">Nepal</option>\n" +
        "                                                <option value=\"Netherlands (the)\">Netherlands (the)</option>\n" +
        "                                                <option value=\"Netherlands Antilles (the)\">Netherlands Antilles (the)</option>\n" +
        "                                                <option value=\"New Caledonia\">New Caledonia</option>\n" +
        "                                                <option value=\"New Zealand\">New Zealand</option>\n" +
        "                                                <option value=\"Nicaragua\">Nicaragua</option>\n" +
        "                                                <option value=\"Niger (the)\">Niger (the)</option>\n" +
        "                                                <option value=\"Nigeria\">Nigeria</option>\n" +
        "                                                <option value=\"Niue\">Niue</option>\n" +
        "                                                <option value=\"Norfolk Island\">Norfolk Island</option>\n" +
        "                                                <option value=\"Northern Mariana Islands (the)\">Northern Mariana Islands (the)</option>\n" +
        "                                                <option value=\"Norway\">Norway</option>\n" +
        "                                                <option value=\"Oman\">Oman</option>\n" +
        "                                                <option value=\"Pakistan\">Pakistan</option>\n" +
        "                                                <option value=\"Palau\">Palau</option>\n" +
        "                                                <option value=\"Palestinian Territory (the Occupied)\">Palestinian Territory (the Occupied)</option>\n" +
        "                                                <option value=\"Panama\">Panama</option>\n" +
        "                                                <option value=\"Papua New Guinea\">Papua New Guinea</option>\n" +
        "                                                <option value=\"Paraguay\">Paraguay</option>\n" +
        "                                                <option value=\"Peru\">Peru</option>\n" +
        "                                                <option value=\"Philippines (the)\">Philippines (the)</option>\n" +
        "                                                <option value=\"Pitcairn\">Pitcairn</option>\n" +
        "                                                <option value=\"Poland\">Poland</option>\n" +
        "                                                <option value=\"Portugal\">Portugal</option>\n" +
        "                                                <option value=\"Puerto Rico\">Puerto Rico</option>\n" +
        "                                                <option value=\"Qatar\">Qatar</option>\n" +
        "                                                <option value=\"Réunion\">Réunion</option>\n" +
        "                                                <option value=\"Romania\">Romania</option>\n" +
        "                                                <option value=\"Russian Federation (the)\">Russian Federation (the)</option>\n" +
        "                                                <option value=\"Rwanda\">Rwanda</option>\n" +
        "                                                <option value=\"Saint Helena\">Saint Helena</option>\n" +
        "                                                <option value=\"Saint Kitts and Nevis\">Saint Kitts and Nevis</option>\n" +
        "                                                <option value=\"Saint Lucia\">Saint Lucia</option>\n" +
        "                                                <option value=\"Saint Pierre and Miquelon\">Saint Pierre and Miquelon</option>\n" +
        "                                                <option value=\"Saint Vincent and the Grenadines\">Saint Vincent and the Grenadines</option>\n" +
        "                                                <option value=\"Samoa\">Samoa</option>\n" +
        "                                                <option value=\"San Marino\">San Marino</option>\n" +
        "                                                <option value=\"Sao Tome and Principe\">Sao Tome and Principe</option>\n" +
        "                                                <option value=\"Saudi Arabia\">Saudi Arabia</option>\n" +
        "                                                <option value=\"Senegal\">Senegal</option>\n" +
        "                                                <option value=\"Serbia\">Serbia</option>\n" +
        "                                                <option value=\"Seychelles\">Seychelles</option>\n" +
        "                                                <option value=\"Sierra Leone\">Sierra Leone</option>\n" +
        "                                                <option value=\"Singapore\">Singapore</option>\n" +
        "                                                <option value=\"Slovakia\">Slovakia</option>\n" +
        "                                                <option value=\"Slovenia\">Slovenia</option>\n" +
        "                                                <option value=\"Solomon Islands (the)\">Solomon Islands (the)</option>\n" +
        "                                                <option value=\"Somalia\">Somalia</option>\n" +
        "                                                <option value=\"South Africa\">South Africa</option>\n" +
        "                                                <option value=\"South Georgia and the South Sandwich Islands\">South Georgia and the South Sandwich Islands</option>\n" +
        "                                                <option value=\"Spain\">Spain</option>\n" +
        "                                                <option value=\"Sri Lanka\">Sri Lanka</option>\n" +
        "                                                <option value=\"Sudan (the)\">Sudan (the)</option>\n" +
        "                                                <option value=\"Suriname\">Suriname</option>\n" +
        "                                                <option value=\"Svalbard and Jan Mayen\">Svalbard and Jan Mayen</option>\n" +
        "                                                <option value=\"Swaziland\">Swaziland</option>\n" +
        "                                                <option value=\"Sweden\">Sweden</option>\n" +
        "                                                <option value=\"Switzerland\">Switzerland</option>\n" +
        "                                                <option value=\"Syrian Arab Republic (the)\">Syrian Arab Republic (the)</option>\n" +
        "                                                <option value=\"Taiwan, China\">Taiwan, China</option>\n" +
        "                                                <option value=\"Tajikistan\">Tajikistan</option>\n" +
        "                                                <option value=\"Tanzania, United Republic of\">Tanzania, United Republic of</option>\n" +
        "                                                <option value=\"Thailand\">Thailand</option>\n" +
        "                                                <option value=\"Timor-Leste\">Timor-Leste</option>\n" +
        "                                                <option value=\"Togo\">Togo</option>\n" +
        "                                                <option value=\"Tokelau\">Tokelau</option>\n" +
        "                                                <option value=\"Tonga\">Tonga</option>\n" +
        "                                                <option value=\"Trinidad and Tobago\">Trinidad and Tobago</option>\n" +
        "                                                <option value=\"Tunisia\">Tunisia</option>\n" +
        "                                                <option value=\"Turkey\">Turkey</option>\n" +
        "                                                <option value=\"Turkmenistan\">Turkmenistan</option>\n" +
        "                                                <option value=\"Turks and Caicos Islands (the)\">Turks and Caicos Islands (the)</option>\n" +
        "                                                <option value=\"Tuvalu\">Tuvalu</option>\n" +
        "                                                <option value=\"Uganda\">Uganda</option>\n" +
        "                                                <option value=\"Ukraine\">Ukraine</option>\n" +
        "                                                <option value=\"United Arab Emirates (the)\">United Arab Emirates (the)</option>\n" +
        "                                                <option value=\"United Kingdom (the)\">United Kingdom (the)</option>\n" +
        "                                                <option value=\"United States (the)\">United States (the)</option>\n" +
        "                                                <option value=\"United States Minor Outlying Islands (the)\">United States Minor Outlying Islands (the)</option>\n" +
        "                                                <option value=\"Uruguay\">Uruguay</option>\n" +
        "                                                <option value=\"Uzbekistan\">Uzbekistan</option>\n" +
        "                                                <option value=\"Vanuatu\">Vanuatu</option>\n" +
        "                                                <option value=\"Venezuela\">Venezuela</option>\n" +
        "                                                <option value=\"Viet Nam\">Viet Nam</option>\n" +
        "                                                <option value=\"Virgin Islands (British)\">Virgin Islands (British)</option>\n" +
        "                                                <option value=\"Virgin Islands (U.S.)\">Virgin Islands (U.S.)</option>\n" +
        "                                                <option value=\"Wallis and Futuna\">Wallis and Futuna</option>\n" +
        "                                                <option value=\"Western Sahara\">Western Sahara</option>\n" +
        "                                                <option value=\"Yemen\">Yemen</option>\n" +
        "                                                <option value=\"Zambia\">Zambia</option>\n" +
        "                                                <option value=\"Zimbabwe\">Zimbabwe</option>" +
        "                                         </select>\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                                <div>\n" +
        "                                    <lable class='control-label' style='font-size: 15px;font-weight: bold;'>\n" +
        "                                        <span style=\"font-size:18px;color: red;\">*</span> Institution(s):\n" +
        "                                    </lable>\n" +
        "                                    <div class='input-group col-sm-12'>\n" +
        "                                        <textarea type='text' name=\"submit_ins\" class='form-control' style=\"font-weight: bold;\"></textarea>\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                                   <div name=\"tip\">\n" +
        "                                        <lable class='control-label' style='font-size: 15px;'>\n" +
        "                                        Use <span class=\"label label-info\" style=\"font-weight: bold;\">;</span> between institutions " +
        "                                        </lable>\n" +
        "                                    </div>"+
        "                            </div>\n" +
        "                            </div>\n" +
        "                            </div>";

    content_box.append(str);

    // $("input[name='submit_ins']").tagsinput({
    //     trimValue:true
    // });

}

//clear Submit
function clearSubmit() {

    $("input[name='pid']").eq(0).val("")
    $("#pid").css("display","none");
    $("textarea[name='title']").eq(0).val("")
    $("textarea[name='abstract']").eq(0).val("");
    $("select[name='EPA']").eq(0).val("");
    $("select[name='sess']").eq(0).val("");
    $('#keywords').tagsinput({trimValue:true});
    $('#keywords').tagsinput('removeAll');
    var obj = document.getElementById('uploadFile');
    obj.outerHTML=obj.outerHTML;
    $("#fileBlock").removeAttr("disabled");
    $("#fileBlock").css("display","none");
    $("#fileGroup").css("display","none");
    $("#uploadFile").css("display","block");

    fileExist="false";

    InitAuthors();
    $(".author-add").css("display","block");

    $("textarea[name='title']").eq(0).removeAttr("readonly")
    $("textarea[name='abstract']").eq(0).removeAttr("readonly")
    $("select[name='EPA']").eq(0).removeAttr("disabled")
    $("select[name='sess']").eq(0).removeAttr("disabled")
    $("#submit_btns").css("display","block");
    $("[name='tip']").css("display","block")

}

function InitAuthors(){
    author_num=1;
    $(".authors").remove();
    $("#accordion").prepend("                            <div class=\"authors\">\n" +
        "                                <div class=\"panel\" style=\"border-color:#ccc\">\n" +
        "                                <div class=\"panel-heading\">\n" +
        "                                <h4 class=\"panel-title\">\n" +
        "                                <a class=\"accordion-toggle collapsed\" data-toggle=\"collapse\" href=\"#collapseOne\" aria-expanded=\"true\">\n" +
        "                                    <b>Author 1</b>\n" +
        "                                </a>\n" +
        "                                </h4>\n" +
        "\n" +
        "                                </div>\n" +
        "                                <div id=\"collapseOne\" class=\"panel-collapse collapse in\">\n" +
        "                                <div class=\"panel-body\">\n" +
        "                                    <div>\n" +
        "                                        <lable class='control-label' style='font-size: 15px;font-weight: bold;'>\n" +
        "                                           <span style=\"font-size:18px;color: red;\">*</span> First Name:\n" +
        "                                        </lable>\n" +
        "                                        <div class='input-group col-sm-12'>\n" +
        "                                            <input type='text' name=\"submit_first_name\" class='form-control' style=\"font-weight: bold;\">\n" +
        "                                        </div>\n" +
        "                                    </div>\n" +
        "                                    <div>\n" +
        "                                        <lable class='control-label' style='font-size: 15px;font-weight: bold;'>\n" +
        "                                           <span style=\"font-size:18px;color: red;\">*</span> Last Name:\n" +
        "                                        </lable>\n" +
        "                                        <div class='input-group col-sm-12'>\n" +
        "                                            <input type='text' name=\"submit_last_name\" class='form-control'  style=\"font-weight: bold;\">\n" +
        "                                        </div>\n" +
        "                                    </div>\n" +
        "                                    <div>\n" +
        "                                        <lable class='control-label' style='font-size: 15px;font-weight: bold;'>\n" +
        "                                           <span style=\"font-size:18px;color: red;\">*</span> Title:\n" +
        "                                        </lable>\n" +
        "                                        <div class='input-group col-sm-12'>\n" +
        "                                            <select class=\"form-control m-bot15\" name=\"submit_title\" style=\"font-weight: bold;\">\n" +
        "                                                <option value=\"Mr.\">Mr.</option>\n" +
        "                                                <option value=\"Mrs.\">Mrs.</option>\n" +
        "                                                <option value=\"Miss.\">Miss.</option>"+
        "                                                <option value=\"Dr.\">Dr.</option>\n" +
        "                                                <option value=\"Prof.\">Prof.</option>" +
        "                                             </select>\n" +
        "                                        </div>\n" +
        "                                    <lable class='control-label' style='font-size: 15px;font-weight: bold;'>\n" +
        "                                        <span style=\"font-size:18px;color: red;\">*</span>  Country or Region:\n" +
        "                                    </lable>\n" +
        "                                    <div class='input-group col-sm-12'>\n" +
        "                                        <select class=\"form-control m-bot15\" name=\"submit_country\" style=\"font-weight: bold;\">\n" +
        "                                                <option value=\"Afghanistan\">Afghanistan</option>\n" +
        "                                                <option value=\"Aland Islands\">Aland Islands</option>\n" +
        "                                                <option value=\"Albania\">Albania</option>\n" +
        "                                                <option value=\"Algeria\">Algeria</option>\n" +
        "                                                <option value=\"American Samoa\">American Samoa</option>\n" +
        "                                                <option value=\"Andorra\">Andorra</option>\n" +
        "                                                <option value=\"Angola\">Angola</option>\n" +
        "                                                <option value=\"Anguilla\">Anguilla</option>\n" +
        "                                                <option value=\"Antarctica\">Antarctica</option>\n" +
        "                                                <option value=\"Antigua and Barbuda\">Antigua and Barbuda</option>\n" +
        "                                                <option value=\"Argentina\">Argentina</option>\n" +
        "                                                <option value=\"Armenia\">Armenia</option>\n" +
        "                                                <option value=\"Aruba\">Aruba</option>\n" +
        "                                                <option value=\"Australia\">Australia</option>\n" +
        "                                                <option value=\"Austria\">Austria</option>\n" +
        "                                                <option value=\"Azerbaijan\">Azerbaijan</option>\n" +
        "                                                <option value=\"Bahamas (The)\">Bahamas (The)</option>\n" +
        "                                                <option value=\"Bahrain\">Bahrain</option>\n" +
        "                                                <option value=\"Bangladesh\">Bangladesh</option>\n" +
        "                                                <option value=\"Barbados\">Barbados</option>\n" +
        "                                                <option value=\"Belarus\">Belarus</option>\n" +
        "                                                <option value=\"Belgium\">Belgium</option>\n" +
        "                                                <option value=\"Belize\">Belize</option>\n" +
        "                                                <option value=\"Benin\">Benin</option>\n" +
        "                                                <option value=\"Bermuda\">Bermuda</option>\n" +
        "                                                <option value=\"Bhutan\">Bhutan</option>\n" +
        "                                                <option value=\"Bolivia\">Bolivia</option>\n" +
        "                                                <option value=\"Bosnia and Herzegovina\">Bosnia and Herzegovina</option>\n" +
        "                                                <option value=\"Botswana\">Botswana</option>\n" +
        "                                                <option value=\"Bouvet Island\">Bouvet Island</option>\n" +
        "                                                <option value=\"Brazil\">Brazil</option>\n" +
        "                                                <option value=\"British Indian Ocean Territory (the)\">British Indian Ocean Territory (the)</option>\n" +
        "                                                <option value=\"Brunei Darussalam\">Brunei Darussalam</option>\n" +
        "                                                <option value=\"Bulgaria\">Bulgaria</option>\n" +
        "                                                <option value=\"Burkina Faso\">Burkina Faso</option>\n" +
        "                                                <option value=\"Burundi\">Burundi</option>\n" +
        "                                                <option value=\"Cambodia\">Cambodia</option>\n" +
        "                                                <option value=\"Cameroon\">Cameroon</option>\n" +
        "                                                <option value=\"Canada\">Canada</option>\n" +
        "                                                <option value=\"Cape Verde\">Cape Verde</option>\n" +
        "                                                <option value=\"Cayman Islands (the)\">Cayman Islands (the)</option>\n" +
        "                                                <option value=\"Central African Republic (the)\">Central African Republic (the)</option>\n" +
        "                                                <option value=\"Chad\">Chad</option>\n" +
        "                                                <option value=\"Chile\">Chile</option>\n" +
        "                                                <option value=\"China\">China</option>\n" +
        "                                                <option value=\"Christmas Island\">Christmas Island</option>\n" +
        "                                                <option value=\"Cocos (Keeling) Islands (the)\">Cocos (Keeling) Islands (the)</option>\n" +
        "                                                <option value=\"Colombia\">Colombia</option>\n" +
        "                                                <option value=\"Comoros\">Comoros</option>\n" +
        "                                                <option value=\"Congo\">Congo</option>\n" +
        "                                                <option value=\"Congo (the Democratic Republic of the)\">Congo (the Democratic Republic of the)</option>\n" +
        "                                                <option value=\"Cook Islands (the)\">Cook Islands (the)</option>\n" +
        "                                                <option value=\"Costa Rica\">Costa Rica</option>\n" +
        "                                                <option value=\"Côte d'Ivoire\">Côte d'Ivoire</option>\n" +
        "                                                <option value=\"Croatia\">Croatia</option>\n" +
        "                                                <option value=\"Cuba\">Cuba</option>\n" +
        "                                                <option value=\"Cyprus\">Cyprus</option>\n" +
        "                                                <option value=\"Czech Republic (the)\">Czech Republic (the)</option>\n" +
        "                                                <option value=\"Denmark\">Denmark</option>\n" +
        "                                                <option value=\"Djibouti\">Djibouti</option>\n" +
        "                                                <option value=\"Dominica\">Dominica</option>\n" +
        "                                                <option value=\"Dominican Republic (the)\">Dominican Republic (the)</option>\n" +
        "                                                <option value=\"Ecuador\">Ecuador</option>\n" +
        "                                                <option value=\"Egypt\">Egypt</option>\n" +
        "                                                <option value=\"El Salvador\">El Salvador</option>\n" +
        "                                                <option value=\"Equatorial Guinea\">Equatorial Guinea</option>\n" +
        "                                                <option value=\"Eritrea\">Eritrea</option>\n" +
        "                                                <option value=\"Estonia\">Estonia</option>\n" +
        "                                                <option value=\"Ethiopia\">Ethiopia</option>\n" +
        "                                                <option value=\"Falkland Islands (the) [Malvinas]\">Falkland Islands (the) [Malvinas]</option>\n" +
        "                                                <option value=\"Faroe Islands (the)\">Faroe Islands (the)</option>\n" +
        "                                                <option value=\"Fiji\">Fiji</option>\n" +
        "                                                <option value=\"Finland\">Finland</option>\n" +
        "                                                <option value=\"France\">France</option>\n" +
        "                                                <option value=\"French Guiana\">French Guiana</option>\n" +
        "                                                <option value=\"French Polynesia\">French Polynesia</option>\n" +
        "                                                <option value=\"French Southern Territories (the)\">French Southern Territories (the)</option>\n" +
        "                                                <option value=\"Gabon\">Gabon</option>\n" +
        "                                                <option value=\"Gambia (The)\">Gambia (The)</option>\n" +
        "                                                <option value=\"Georgia\">Georgia</option>\n" +
        "                                                <option value=\"Germany\">Germany</option>\n" +
        "                                                <option value=\"Ghana\">Ghana</option>\n" +
        "                                                <option value=\"Gibraltar\">Gibraltar</option>\n" +
        "                                                <option value=\"Greece\">Greece</option>\n" +
        "                                                <option value=\"Greenland\">Greenland</option>\n" +
        "                                                <option value=\"Grenada\">Grenada</option>\n" +
        "                                                <option value=\"Guadeloupe\">Guadeloupe</option>\n" +
        "                                                <option value=\"Guam\">Guam</option>\n" +
        "                                                <option value=\"Guatemala\">Guatemala</option>\n" +
        "                                                <option value=\"Guernsey\">Guernsey</option>\n" +
        "                                                <option value=\"Guinea\">Guinea</option>\n" +
        "                                                <option value=\"Guinea-Bissau\">Guinea-Bissau</option>\n" +
        "                                                <option value=\"Guyana\">Guyana</option>\n" +
        "                                                <option value=\"Haiti\">Haiti</option>\n" +
        "                                                <option value=\"Heard Island and McDonald Islands\">Heard Island and McDonald Islands</option>\n" +
        "                                                <option value=\"Holy See (the) [Vatican City State]\">Holy See (the) [Vatican City State]</option>\n" +
        "                                                <option value=\"Honduras\">Honduras</option>\n" +
        "                                                <option value=\"Hong Kong SAR, China\">Hong Kong SAR, China</option>\n" +
        "                                                <option value=\"Hungary\">Hungary</option>\n" +
        "                                                <option value=\"Iceland\">Iceland</option>\n" +
        "                                                <option value=\"India\">India</option>\n" +
        "                                                <option value=\"Indonesia\">Indonesia</option>\n" +
        "                                                <option value=\"Iran (the Islamic Republic of)\">Iran (the Islamic Republic of)</option>\n" +
        "                                                <option value=\"Iraq\">Iraq</option>\n" +
        "                                                <option value=\"Ireland\">Ireland</option>\n" +
        "                                                <option value=\"Isle of Man\">Isle of Man</option>\n" +
        "                                                <option value=\"Israel\">Israel</option>\n" +
        "                                                <option value=\"Italy\">Italy</option>\n" +
        "                                                <option value=\"Jamaica\">Jamaica</option>\n" +
        "                                                <option value=\"Japan\">Japan</option>\n" +
        "                                                <option value=\"Jersey\">Jersey</option>\n" +
        "                                                <option value=\"Jordan\">Jordan</option>\n" +
        "                                                <option value=\"Kazakhstan\">Kazakhstan</option>\n" +
        "                                                <option value=\"Kenya\">Kenya</option>\n" +
        "                                                <option value=\"Kiribati\">Kiribati</option>\n" +
        "                                                <option value=\"Korea (the Democratic People's Republic of)\">Korea (the Democratic People's Republic of)</option>\n" +
        "                                                <option value=\"Korea (the Republic of)\">Korea (the Republic of)</option>\n" +
        "                                                <option value=\"Kuwait\">Kuwait</option>\n" +
        "                                                <option value=\"Kyrgyzstan\">Kyrgyzstan</option>\n" +
        "                                                <option value=\"Lao People's Democratic Republic (the)\">Lao People's Democratic Republic (the)</option>\n" +
        "                                                <option value=\"Latvia\">Latvia</option>\n" +
        "                                                <option value=\"Lebanon\">Lebanon</option>\n" +
        "                                                <option value=\"Lesotho\">Lesotho</option>\n" +
        "                                                <option value=\"Liberia\">Liberia</option>\n" +
        "                                                <option value=\"Libyan Arab Jamahiriya (the)\">Libyan Arab Jamahiriya (the)</option>\n" +
        "                                                <option value=\"Liechtenstein\">Liechtenstein</option>\n" +
        "                                                <option value=\"Lithuania\">Lithuania</option>\n" +
        "                                                <option value=\"Luxembourg\">Luxembourg</option>\n" +
        "                                                <option value=\"Macao SAR, China\">Macao SAR, China</option>\n" +
        "                                                <option value=\"Macedonia (the former Yugoslav Republic of)\">Macedonia (the former Yugoslav Republic of)</option>\n" +
        "                                                <option value=\"Madagascar\">Madagascar</option>\n" +
        "                                                <option value=\"Malawi\">Malawi</option>\n" +
        "                                                <option value=\"Malaysia\">Malaysia</option>\n" +
        "                                                <option value=\"Maldives\">Maldives</option>\n" +
        "                                                <option value=\"Mali\">Mali</option>\n" +
        "                                                <option value=\"Malta\">Malta</option>\n" +
        "                                                <option value=\"Marshall Islands (the)\">Marshall Islands (the)</option>\n" +
        "                                                <option value=\"Martinique\">Martinique</option>\n" +
        "                                                <option value=\"Mauritania\">Mauritania</option>\n" +
        "                                                <option value=\"Mauritius\">Mauritius</option>\n" +
        "                                                <option value=\"Mayotte\">Mayotte</option>\n" +
        "                                                <option value=\"Mexico\">Mexico</option>\n" +
        "                                                <option value=\"Micronesia (the Federated States of)\">Micronesia (the Federated States of)</option>\n" +
        "                                                <option value=\"Moldova (the Republic of)\">Moldova (the Republic of)</option>\n" +
        "                                                <option value=\"Monaco\">Monaco</option>\n" +
        "                                                <option value=\"Mongolia\">Mongolia</option>\n" +
        "                                                <option value=\"Montenegro\">Montenegro</option>\n" +
        "                                                <option value=\"Montserrat\">Montserrat</option>\n" +
        "                                                <option value=\"Morocco\">Morocco</option>\n" +
        "                                                <option value=\"Mozambique\">Mozambique</option>\n" +
        "                                                <option value=\"Myanmar\">Myanmar</option>\n" +
        "                                                <option value=\"Namibia\">Namibia</option>\n" +
        "                                                <option value=\"Nauru\">Nauru</option>\n" +
        "                                                <option value=\"Nepal\">Nepal</option>\n" +
        "                                                <option value=\"Netherlands (the)\">Netherlands (the)</option>\n" +
        "                                                <option value=\"Netherlands Antilles (the)\">Netherlands Antilles (the)</option>\n" +
        "                                                <option value=\"New Caledonia\">New Caledonia</option>\n" +
        "                                                <option value=\"New Zealand\">New Zealand</option>\n" +
        "                                                <option value=\"Nicaragua\">Nicaragua</option>\n" +
        "                                                <option value=\"Niger (the)\">Niger (the)</option>\n" +
        "                                                <option value=\"Nigeria\">Nigeria</option>\n" +
        "                                                <option value=\"Niue\">Niue</option>\n" +
        "                                                <option value=\"Norfolk Island\">Norfolk Island</option>\n" +
        "                                                <option value=\"Northern Mariana Islands (the)\">Northern Mariana Islands (the)</option>\n" +
        "                                                <option value=\"Norway\">Norway</option>\n" +
        "                                                <option value=\"Oman\">Oman</option>\n" +
        "                                                <option value=\"Pakistan\">Pakistan</option>\n" +
        "                                                <option value=\"Palau\">Palau</option>\n" +
        "                                                <option value=\"Palestinian Territory (the Occupied)\">Palestinian Territory (the Occupied)</option>\n" +
        "                                                <option value=\"Panama\">Panama</option>\n" +
        "                                                <option value=\"Papua New Guinea\">Papua New Guinea</option>\n" +
        "                                                <option value=\"Paraguay\">Paraguay</option>\n" +
        "                                                <option value=\"Peru\">Peru</option>\n" +
        "                                                <option value=\"Philippines (the)\">Philippines (the)</option>\n" +
        "                                                <option value=\"Pitcairn\">Pitcairn</option>\n" +
        "                                                <option value=\"Poland\">Poland</option>\n" +
        "                                                <option value=\"Portugal\">Portugal</option>\n" +
        "                                                <option value=\"Puerto Rico\">Puerto Rico</option>\n" +
        "                                                <option value=\"Qatar\">Qatar</option>\n" +
        "                                                <option value=\"Réunion\">Réunion</option>\n" +
        "                                                <option value=\"Romania\">Romania</option>\n" +
        "                                                <option value=\"Russian Federation (the)\">Russian Federation (the)</option>\n" +
        "                                                <option value=\"Rwanda\">Rwanda</option>\n" +
        "                                                <option value=\"Saint Helena\">Saint Helena</option>\n" +
        "                                                <option value=\"Saint Kitts and Nevis\">Saint Kitts and Nevis</option>\n" +
        "                                                <option value=\"Saint Lucia\">Saint Lucia</option>\n" +
        "                                                <option value=\"Saint Pierre and Miquelon\">Saint Pierre and Miquelon</option>\n" +
        "                                                <option value=\"Saint Vincent and the Grenadines\">Saint Vincent and the Grenadines</option>\n" +
        "                                                <option value=\"Samoa\">Samoa</option>\n" +
        "                                                <option value=\"San Marino\">San Marino</option>\n" +
        "                                                <option value=\"Sao Tome and Principe\">Sao Tome and Principe</option>\n" +
        "                                                <option value=\"Saudi Arabia\">Saudi Arabia</option>\n" +
        "                                                <option value=\"Senegal\">Senegal</option>\n" +
        "                                                <option value=\"Serbia\">Serbia</option>\n" +
        "                                                <option value=\"Seychelles\">Seychelles</option>\n" +
        "                                                <option value=\"Sierra Leone\">Sierra Leone</option>\n" +
        "                                                <option value=\"Singapore\">Singapore</option>\n" +
        "                                                <option value=\"Slovakia\">Slovakia</option>\n" +
        "                                                <option value=\"Slovenia\">Slovenia</option>\n" +
        "                                                <option value=\"Solomon Islands (the)\">Solomon Islands (the)</option>\n" +
        "                                                <option value=\"Somalia\">Somalia</option>\n" +
        "                                                <option value=\"South Africa\">South Africa</option>\n" +
        "                                                <option value=\"South Georgia and the South Sandwich Islands\">South Georgia and the South Sandwich Islands</option>\n" +
        "                                                <option value=\"Spain\">Spain</option>\n" +
        "                                                <option value=\"Sri Lanka\">Sri Lanka</option>\n" +
        "                                                <option value=\"Sudan (the)\">Sudan (the)</option>\n" +
        "                                                <option value=\"Suriname\">Suriname</option>\n" +
        "                                                <option value=\"Svalbard and Jan Mayen\">Svalbard and Jan Mayen</option>\n" +
        "                                                <option value=\"Swaziland\">Swaziland</option>\n" +
        "                                                <option value=\"Sweden\">Sweden</option>\n" +
        "                                                <option value=\"Switzerland\">Switzerland</option>\n" +
        "                                                <option value=\"Syrian Arab Republic (the)\">Syrian Arab Republic (the)</option>\n" +
        "                                                <option value=\"Taiwan, China\">Taiwan, China</option>\n" +
        "                                                <option value=\"Tajikistan\">Tajikistan</option>\n" +
        "                                                <option value=\"Tanzania, United Republic of\">Tanzania, United Republic of</option>\n" +
        "                                                <option value=\"Thailand\">Thailand</option>\n" +
        "                                                <option value=\"Timor-Leste\">Timor-Leste</option>\n" +
        "                                                <option value=\"Togo\">Togo</option>\n" +
        "                                                <option value=\"Tokelau\">Tokelau</option>\n" +
        "                                                <option value=\"Tonga\">Tonga</option>\n" +
        "                                                <option value=\"Trinidad and Tobago\">Trinidad and Tobago</option>\n" +
        "                                                <option value=\"Tunisia\">Tunisia</option>\n" +
        "                                                <option value=\"Turkey\">Turkey</option>\n" +
        "                                                <option value=\"Turkmenistan\">Turkmenistan</option>\n" +
        "                                                <option value=\"Turks and Caicos Islands (the)\">Turks and Caicos Islands (the)</option>\n" +
        "                                                <option value=\"Tuvalu\">Tuvalu</option>\n" +
        "                                                <option value=\"Uganda\">Uganda</option>\n" +
        "                                                <option value=\"Ukraine\">Ukraine</option>\n" +
        "                                                <option value=\"United Arab Emirates (the)\">United Arab Emirates (the)</option>\n" +
        "                                                <option value=\"United Kingdom (the)\">United Kingdom (the)</option>\n" +
        "                                                <option value=\"United States (the)\">United States (the)</option>\n" +
        "                                                <option value=\"United States Minor Outlying Islands (the)\">United States Minor Outlying Islands (the)</option>\n" +
        "                                                <option value=\"Uruguay\">Uruguay</option>\n" +
        "                                                <option value=\"Uzbekistan\">Uzbekistan</option>\n" +
        "                                                <option value=\"Vanuatu\">Vanuatu</option>\n" +
        "                                                <option value=\"Venezuela\">Venezuela</option>\n" +
        "                                                <option value=\"Viet Nam\">Viet Nam</option>\n" +
        "                                                <option value=\"Virgin Islands (British)\">Virgin Islands (British)</option>\n" +
        "                                                <option value=\"Virgin Islands (U.S.)\">Virgin Islands (U.S.)</option>\n" +
        "                                                <option value=\"Wallis and Futuna\">Wallis and Futuna</option>\n" +
        "                                                <option value=\"Western Sahara\">Western Sahara</option>\n" +
        "                                                <option value=\"Yemen\">Yemen</option>\n" +
        "                                                <option value=\"Zambia\">Zambia</option>\n" +
        "                                                <option value=\"Zimbabwe\">Zimbabwe</option>" +
        "                                         </select>\n" +
        "                                    </div>\n" +
        "                                    </div>\n" +
        "                                    <div>\n" +
        "                                        <lable class='control-label' style='font-size: 15px;font-weight: bold;'>\n" +
        "                                           <span style=\"font-size:18px;color: red;\">*</span> Institution(s):\n" +
        "                                        </lable>\n" +
        "                                        <div class='input-group col-sm-12'>\n" +
        "                                            <textarea type='text' name=\"submit_ins\" class='form-control'  style=\"font-weight: bold;\"></textarea>\n" +
        "                                        </div>\n" +
        "                                    </div>\n" +
        "                                   <div  name=\"tip\">\n" +
        "                                        <lable class='control-label' style='font-size: 15px;'>\n" +
        "                                        Use <span class=\"label label-info\" style=\"font-weight: bold;\">;</span> between institutions" +
        "                                        </lable>\n" +
        "                                    </div>"+
        "\n" +
        "                                </div>\n" +
        "                                </div>\n" +
        "                                </div>\n"

    );

    // $("input[name='submit_ins']").tagsinput({
    //     trimValue:true
    // });
}

//check paper
function checkPaper(pid,readonly){

    clearSubmit();

    axios.get('/GetPaperServlet', {
        params: {
            pid: pid
        }
    })
        .then(function (response) {
            $("#Login").hide();
            $("#Register").hide();
            $("#Submit_page").show();
            $("#UserSpace").hide();

            console.log(response)

            $("input[name='pid']").eq(0).val(response.data.PID);
            $("#pid").css("display","block");
            $("textarea[name='title']").eq(0).val(response.data.Title);
            $("textarea[name='abstract']").eq(0).val(response.data.Abstract);
            $("select[name='EPA']").eq(0).val(response.data.EPA);
            $("select[name='sess']").eq(0).val(response.data.Sess);
            $('#keywords').tagsinput('removeAll')
            for(i=0;i<response.data.Keywords.length;i++){
                $('#keywords').tagsinput('add', response.data.Keywords[i]);
            }

            for(i=0;i<response.data.Authors.length;i++){
                if(i>0){
                    addAuthor();
                }
                var author=response.data.Authors[i];
                $("input[name='submit_first_name']").eq(i).val(author.firstName);
                $("input[name='submit_last_name']").eq(i).val(author.lastName);
                $("select[name='submit_title']").eq(i).val(author.title);
                $("select[name='submit_country']").eq(i).val(author.country);
                // var insArray=new Array();
                // insArray=author.ins.split(',');
                // for(j=0;j<insArray.length;j++){
                //     $("input[name='submit_ins']").eq(i).tagsinput('add', insArray[j]);
                // }
                $("textarea[name='submit_ins']").eq(i).val(author.ins);
            }

            if(response.data.FilePath!=""){
                fileExist="true";
                var names=response.data.FilePath.split("/");

                $("#fileName").text(names[names.length-1])
                $("#fileBlock").css("display","none");
                $("#fileGroup").css("display","block");
                $("#uploadFile").css("display","none");
            }

            if(readonly){
                //$("input[name='pid']").eq(0).attr("readonly","readonly");
                $("textarea[name='title']").eq(0).attr("readonly","readonly")
                $("textarea[name='abstract']").eq(0).attr("readonly","readonly")
                $("select[name='EPA']").eq(0).attr("disabled","disabled")
                $("select[name='sess']").eq(0).attr("disabled","disabled")
                //$(".bootstrap-tagsinput").attr("disabled","disabled");
                $('#keywords').tagsinput("destroy")
                $('#keywords').attr("readonly","readonly")
                $("input[name='submit_first_name']").attr("readonly","readonly")
                $("input[name='submit_last_name']").attr("readonly","readonly")
                $("select[name='submit_title']").attr("disabled","disabled")
                //$("textarea[name='submit_ins']").tagsinput("destroy")
                $("textarea[name='submit_ins']").attr("readonly","readonly")
                $("select[name='submit_country']").attr("disabled","disabled")


                $("#submit_btns").css("display","none");
                $("[name='tip']").css("display","none")

                $(".fa-times").css("display","none");
                $(".author-add").css("display","none");

                $("#fileBlock").removeAttr("disabled");
                $("#fileBlock").css("display","block");
                $("#fileGroup").css("display","none");
                $("#uploadFile").css("display","none");
                if(response.data.FilePath==""){
                    $("#fileBlock").text("No File")
                    $("#fileBlock").attr("disabled","disabled");
                }
                else{
                    var names=response.data.FilePath.split("/");
                    $("#fileBlock").text(names[names.length-1])
                }

            }


        })
        .catch(function (error) {
            console.log(error);
        });
}


//edit
$(document).on("click", ".btn_edit", function () {
    var pid=$(this).parents("tr").children("td").eq(0).text();
    checkPaper(pid,false);

})

//view
$(document).on("click", ".btn_view", function () {
    var pid=$(this).parents("tr").children("td").eq(0).text();
    checkPaper(pid,true)
})

//remove
$(document).on("click",".btn_remove",function(){
    if (confirm("Are you sure to delete this paper?")) {
        var pid = $(this).parents("tr").children("td").eq(0).text();

        axios.get('/DeletePaperServlet', {
            params: {
                pid: pid
            }
        })
            .then(function (response) {
                getArticleList();
                alert("Delete successfully.")

            })
            .catch(function (err) {
                alert("Delete failed.")

            })
    }

})

//reselect file
$("#fileRemove").click(function(){
    fileExist="false";
    $("#fileGroup").css("display","none");
    $("#uploadFile").css("display","block");
})

//retrieve password
$("#modal_reset").click(function(){
    if($("#resetPW_email").val()==""){
        alert("Email can not be empty");
        return;
    }

    var params = new URLSearchParams();
    params.append("email", $("#resetPW_email").val().trim());

    axios.post('/SendPasswordServlet', params, {})
        .then(function (response) {
            var result = response.data.result;
            if (result == "success") {
                $("#resetPW_code").focus();
                alert("Send email successfully, please check your mailbox.")
                //code = response.data.code;
            }
            else if(result == "none"){
                alert("This email has not been registered!")
            }
            else {
                alert("Send email failed, please try again.")
            }

        })
        .catch(function (error) {
            alert("Send email failed, please try again.")
        });
})

$("#fileName").click(function () {
    if(confirm("Do you want to download this paper?")){
        downloadFile(0);
    }

})

$("#fileBlock").click(function () {
    if(confirm("Do you want to download this paper?")){
        downloadFile(1);
    }
})

function downloadFile(type){
    var params = new URLSearchParams();
    params.append("pid", $("input[name='pid']").eq(0).val().trim());

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
            var fileName = $("input[name='pid']").eq(0).val().trim()+".doc"
            if(type==0){
                fileName=$("#fileName").text();
            }
            else{
                fileName=$("#fileBlock").text();
            }

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
window.onload= function (){
    var from = sessionStorage.getItem("from");
    if(from == 'pageA') {
        $("#Register").show();
        sessionStorage.setItem("from",""); //销毁 from 防止在b页面刷新 依然触发$('#xxx').click()
    }
}
//reset btn
// $("#modal_reset").click(function(){
//     if($("#resetPW_email").val()==""){
//         alert("Email can not be empty");
//         return;
//     }
//     if($("#resetPW_code").val()==""){
//         alert("Code can not be empty");
//         return;
//     }
//     if($("#resetPW_password").val()!=$("#resetPW_password_again").val()){
//         alert("Password and Confirm Password are inconsistent");
//         return;
//     }
//     var params = new URLSearchParams();
//     params.append("code", $("#resetPW_code").val().trim());
//
//     axios.post('/AGAYGWG/ValidateCodeServlet', params, {})
//         .then(function (response) {
//             var result = response.data;
//             if(result==1){
//
//                 var params = new URLSearchParams();
//                 params.append("email", $("#resetPW_email").val().trim());
//                 params.append("password", $("#resetPW_password").val().trim());
//
//                 axios.post('/AGAYGWG/ResetPasswordServlet', params, {})
//                     .then(function (response) {
//                         var result = response.data;
//                         if(result==1){
//
//                             $("#resetPW").modal('hide')
//                             alert("Reset password successfully!")
//                         }
//                         else{
//                             alert("Reset password failed.");
//                         }
//
//                     })
//                     .catch(function (error) {
//                         alert("Reset password failed, please try again.")
//                     });
//
//             }
//             else{
//                 $("#resetPW_code").focus();
//                 alert("Please enter the correct code.");
//             }
//
//         })
//         .catch(function (error) {
//             alert("Send email failed, please try again.")
//         });
// })







