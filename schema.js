const schema = {
    type: 'array',
    default: [],
    items:{
        type: 'object',
        required: [
            'id',
            'from',
            'languages'
        ],
        properties: {
            id: {
                type: 'string',
            },
            from: {
                type: 'string',
            },
            languages: {
                type: 'array',
                items:{
                    type: 'object',
                    required: [
                        'id',
                        'subject',
                        'html'
                    ],
                    properties: {
                        id: {
                            type: 'string',
                        },
                        subject: {
                            type: 'string',
                        },
                        html: {
                            type: 'string',
                        }
                    }
                }
            }
        }
    }
}

module.exports=schema;