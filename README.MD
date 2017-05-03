# Glue, APIs Framework.

### Warning: WIP

##  Known limitations
- doesnt support multiple requests

## TODO
- create an ast instead of the current hacked ts gen.

    ```
    {
        validators:[
            {
                name:string,
                args:[
                    'number',
                    'string'
                ]
            }
        ],
        guards:[
            {
                name:string,
                args:[
                    'string' // type
                ]
            }
        ],
        routes:[
            {
                name:string,
                handlers:[
                    {
                        name:string,
                        method:string,
                        path:string,
                        input:{
                            name:string,
                            type:string
                        },
                        guards:[
                            {
                                name:string,
                                args:['arg1','arg2']
                            }
                        ]
                    }
                ]
            }
        ],
        objects:[
            {
                name:string,
                props:[
                    {
                        name:string,
                        type:string,
                        validations:[
                            {
                                name:string,
                                args:['arg1','arg2']
                            }
                        ]
                    }
                ]
            }
        ]
    }
    ```