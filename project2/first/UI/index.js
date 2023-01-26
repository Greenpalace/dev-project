var app = Sammy(function () {
    this.get("/", function () {
        $("#contentDiv").load("/WineSearch/winesearch.html");
    });

    this.get("/add", function () {
        $("#contentDiv").load(`/WineAdd/add.html`);
    });
 
    this.get("/:w_id/edit", function () {
        $("#contentDiv").load("/WineEdit/edit.html");
    });
    
    this.get("/:w_id", function () {
        $("#contentDiv").load(`/WineInfo/ui_info.html`);
    });

    this.notFound = function (verb, path) {
        $("#contentDiv").html("404");
    };
});

$(function () {
    app.run()
});
