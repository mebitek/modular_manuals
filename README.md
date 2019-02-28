# Modular Manuals

An Android app that helps to consult Modular System Manuals

it's configurable, just edit ```manuals.json``` to reflect your modular setup and easily navigate the manuals in your app.

```manuals.json``` has the followinf structure:

```
[
  {
    "key": "Make Noise Shared System",
    "url": "http://www.makenoisemusic.com/content/manuals/bg-sharedsystemmanual.pdf",
    "type": "ext"
  }
]
```

where:

* **key:** the name of the module
* **url:** the url of the manual
* **type:** [int|ext] 
  * int: laod the manual from internal asset folder (```android/app/src/main/assets/custom```)
  * ext: load the manual from internet url

## feature:
* native android code
* search filter manual list
* editable manuals.json list
* manuals location can be internal (assets) or external (internet)
* manuals are cached with no expiration
* opensource

released under **GNU GENERAL PUBLIC LICENSE v3** www.mebitek.com

![Actual Setup](https://cdn.modulargrid.net/img/racks/modulargrid_835929.jpg)
