
// const regex = /[^0-9]/g;
// const result = str.replace(regex, "");
// const wid = parseInt(result);
//var wid = 15;
// test = {
//     nation: { data: { 1: "nation1", 2: "nation2" }},
//     type: { data: { 1: "type1", 2: "type2" }},
// }
// w_data   = 
// {
//     name: string|null,
//     producer: string|null,
//     nation: int|null,
//     local: int|null,
//     varieties: int|null,
//     type: int|null,
//     sweet: int|null,
//     use: int|null,
//     acidity: int|null,
//     body: int|null,
//     tannin: int|null,
//     price: int|null,
//     year: int|null,
//     ml: int|null,
//     adv_upper: int|null,
//     adv_lower: int|null,
//     degree_upper: int|null,
//     degree_lower: int|null,
    
    
// }


// $.ajax1({
//     type: 'GET',
//     url: `http://localhost:${svc_port}/:w_id`,

//     dataType: "application/json; charset-utf-8",
//     contentType: "application/json; charset-utf-8",
//     error: function() { 
//         console.log('error')
//     },
    

//     success: function(response) {
//         w_data = data.dataList
//         for (let i = 0; i<=17; ++i);
//             obj[Object.keys(obj)[i]]=w_data[0]
//     },
//     function(response){}

// });
// $("#patch").click(function(){
//     $.ajax2({
//         type: 'DELETE',
//         url: 'http://localhost:${svc_port}',

//         dataType: "application/json; charset-utf-8",
//         contentType: "application/json; charset-utf-8",
//         error: function() { 
//             console.log('error')
//         },
    

//         success: function(){
//             alert(); // 통신 성공시 실행 함수

//         },
//     })
// })
var wid = window.location.pathname.match(/\/\d+/)[0].slice(1);
var ip = "172.18.228.19"
$(function() {
    $("#edit").prop("href", `/${wid}/edit`)
    var svc_port = 30804;
    // var urlid = window.location.pathname;
    // const str = urlid;
    

    var flag = 0;
    var pairDict = {};
    var detailDict = {};
    $.each(["nation","local","varieties","type","use"], function(_,val){
        pairDict[val] = {}
        $.ajax({
            type: "GET",
            url: `http://${ip}:${svc_port}/${val}`,
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
        $.ajax({
            type: "GET",
            url : `http://${ip}:${svc_port}/wine/${wid}`,
            contentType : "application/json; charset-utf-8",
            error: function() {
                console.log('error');
            },
            success : function(response){
                detailDict["name"]= $("#name").text(response.name);
                detailDict["producer"]=$("#producer").text(response.producer);
                detailDict["nation"]=$("#nation").text(pairDict.nation[response.nation]);
                detailDict["local"]=$("#local").text(pairDict.local[response.local]);
                detailDict["varieties"]=$("#varieties").text(pairDict.varieties[response.varieties]);
                detailDict["type"]=$("#type").text(pairDict.type[response.type]);
                detailDict["use"]=$("#use").text(pairDict.use[response.use]);
                detailDict["abv_upper"]=$("#abv_upper").text(response.abv_upper);
                detailDict["abv_lower"]=$("#abv_l").text(response.abv_lower);
                detailDict["degree_upper"]=$("#degree_h").text(response.degree_upper);
                detailDict["degree_lower"]=$("#degree_l").text(response.degree_lower);
                detailDict["name"]=$("#sweet").text(response.sweet);
                detailDict["acidity"]=$("#acidity").text(response.acidity);
                detailDict["body"]=$("#body").text(response.body);
                detailDict["tannin"]=$("#tannin").text(response.tannin);
                detailDict[price]=$("#price").text(response.price);
                detailDict[year]=$("#year").text(response.year);
                detailDict[ml]=$("#ml").text(response.ml);
                
            }
        })
    }

    $('button[name="patchbutton"]').on("click", function() {
        $.ajax({
            type: "PATCH",
            url : `http://${ip}:${svc_port}/wine/${wid}`,
            data : JSON.stringify(detailDict),
            contentType : "application/json; charset-utf-8",
            error: function() {
                console.log('error');
            },
            success : function(){
            },
        })
    })

    $('button[name="deletebutton"]').on("click", function() {
        $.ajax({
            type: "DELETE",
            url : `http://${ip}:${svc_port}/wine/${wid}`,
            contentType : "application/json; charset-utf-8",
            error: function() { 
                console.log('error');
            },
            success : function(){
            }
        })
    })
})
