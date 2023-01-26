var svc_ad = "localhost:5000"

$(function() {
    $("#infoPage #wid").on("change", function () {
        var wid = window.location.pathname.match(/\/\d+/)[0].slice(1);
        $("#infoPage #edit_btn").prop("href", `/${wid}/edit`)

        var flag = 0;
        var pairDict = {};
        $.each(["nation","local","varieties","type","use"], function(_,val){
            pairDict[val] = {}
            $.ajax({
                type: "GET",
                url: `http://${svc_ad}/${val}`,
                contentType : "application/json; charset-utf-8",
                error: function() {
                    console.log('error');
                },
                success: function(response) {
                    $.each(response, function(_,dict){
                        var key = Object.keys(dict)[0];
                        pairDict[val][key] = dict[key]
                    })
                    flag += 1
                    if (flag == 5)
                    {
                        getData()
                    }
                }
            })
        })
        function getData() {
            $('#infoPage td').empty()
            $('#infoPage #name').empty()
            $.ajax({
                type: "GET",
                url : `http://${svc_ad}/wine/${wid}`,
                contentType : "application/json; charset-utf-8",
                error: function() {
                    console.log('error');
                },
                success : function(response){
                    $.each(Object.keys(response), function(_, key) {
                        if (["nation", "local", "varieties", "type", "use"].includes(key))
                        {
                            $(`#infoPage #${key}`).append(`${pairDict[key][response[key]]}`)
                        }
                        else if (key.indexOf('_') != -1)
                        {
                            var strList = key.split('_')
                            strList[1].indexOf('lower') != -1
                            ? $(`#infoPage #${strList[0]}`).prepend(`${response[key]}~`)
                            : $(`#infoPage #${strList[0]}`).append(`${response[key]}`)
                        }
                        else
                        {
                            $(`#infoPage #${key}`).append(`${response[key]}`)
                        }
                    })
                }
            })
        }
    })
})
