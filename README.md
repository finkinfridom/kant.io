# Kant.io

The easiest way to achieve critical path CSS in any of your website!

There are 2 ways to use Kant.io in your website:

## Option 1

Inject an `<img>` HTML tag pointing to `https://kant.io/[project_id]/api/pixel`

e.g.
`<img src="https://kant.io/ab548547-9b0a-dabd-a6c2-0ec0cb8b950b/api/pixel"/>`

this endpoint will receive the information from the page requesting it and then it will create the proper critical CSS

## Option 2 (TBD)

Send a `pagePublished` notification with this payload (through RabbitMQ or Azure ServiceBus):

    {
        "notificationId": [any unique-identifier valid for your system],
        "path": [the page path just published]
    }
