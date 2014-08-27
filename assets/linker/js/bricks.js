$(function () {
    $('#bricks-table').dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/bricks",
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
            { "data": "title" },
            { "data": "createdByEmail" },
            { "data": "createdAt" }
        ]
    });
});