# Kant.io

The easiest way to achieve critical path CSS in any of your website!

There are 2 ways to use Kant.io in your website:

## Option 1

Inject an `<img>` HTML tag pointing to `https://kant.io/api/[project_id]/pixel`

e.g.
`<img src="https://kantio.azurewebsites.net/api/ab548547-9b0a-dabd-a6c2-0ec0cb8b950b/pixel"/>`

this endpoint will receive the information from the page requesting it and then it will create the proper critical CSS

### Bonus tips

In the above example you can also specify those optional parameters:

- "css": Kant.io will automatically read and ingest all CSS `<link>` found in the page, but if you prefer to specify manually which items to be considered, you can specify them through `?css=file1.css&css=https://mydomain.com/file2.css`

## Option 2 (TBD)

Send a `pagePublished` notification with this payload (through RabbitMQ or Azure ServiceBus):

    {
        "notificationId": [any unique-identifier valid for your system],
        "path": [the page path just published],
        "css": [as per option 1 you can decide which CSS to be included. Optional]
    }

## How to get critical CSS

In your rendering pipeline, just before including your `<link>` elements, you MUST perform an HTTP request to:

`https://kantio.azurewebsites.net/api/[project_id]/criticalcss?referer=[the URL you want to get the critical CSS]`

the HTTP request will reply back with an HTML snippet containing:

    link rel="preload" href="[css_path]" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
    [loadCSS function from Filament Group]
    <style>
    [your critical path CSS]
    </style>
    <script>
    loadCSS([css_path]);
    </script>

see [app/src/templates/critical-css.ejs](app/src/templates/critical-css.ejs) for reference
