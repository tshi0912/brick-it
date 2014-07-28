$(function () {
    $('#users-table').dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/users",
            "type": "GET"
        },
        "columns": [
            { "data": "nickName" },
            { "data": "email" },
            { "data": "createdAt" }
        ]
    });
});