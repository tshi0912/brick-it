$(function () {
    $('#users-table').dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/users",
            "type": "GET"
        },
        order: [
            [3, 'desc']
        ],
        "columns": [
            {
                render: function(data, type, row){
                    return '<label><input type="checkbox"></label>';
                },
                orderable: false,
                className: 'check'
            },
            { "data": "nickName" },
            { "data": "email" },
            { "data": "createdAt" }
        ]
    });
});