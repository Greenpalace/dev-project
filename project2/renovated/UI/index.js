function init() {
    $("#searchDiv").hide()
    $("#addDiv").hide()
    $("#infoDiv").hide()
    $("#editDiv").hide()
}

var app = Sammy(function () {
    this.get("/", function () {
        init()
        $("#searchDiv").show()
    });

    this.get("/add", function () {
        init()
        $("#addDiv").show()
    });
 
    this.get("/:w_id/edit", function () {
        init()
        $("#editDiv #wid").val(this.params['w_id']).trigger("change")
        $("#editDiv").show()
    });
    
    this.get("/:w_id", function () {
        init()
        if ($("#infoDiv #wid").val() != this.params['w_id'])
        {
            $("#infoDiv #wid").val(this.params['w_id']).trigger("change")
        }
        $("#infoDiv").show()
    });
});

$(function () {
    $("#searchDiv").load("http://localhost/WineSearch/winesearch.html");
    $("#addDiv").load(`http://localhost/WineAdd/add.html`);
    $("#editDiv").load("http://localhost/WineEdit/edit.html");
    $("#infoDiv").load(`http://localhost/WineInfo/ui_info.html`);
    app.run()
});
