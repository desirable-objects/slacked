# slacked-deploy-plugin

Deploys newly released docker images to a dockercloud hosted environment.

This means you can deploy software to production via slack!

Documentation coming soon, but in a pinch:

```
/deploy <docker-tag> of <application> on <environment>
```

This tallies up with the configuration file:

```json
{
    "deploy": {
        "environment": {
            "application": {
                "image": "some-repo/some-image",
                "serviceId": "your-dockercloud-service-id"
            }
        }
    }
}
```

Simply map your applications, environments, and services in this file, and all the validation is done by the plugin. Simple. You will be notified when a deployment starts, and when it is completed.