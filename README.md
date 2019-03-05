# Modular Manuals
## version 0.2.3

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
* sort list alphabetically or shuffled
* manuals location can be internal (assets) or external (internet)
* manuals are cached with no expiration
* opensource

## prerequisites
* npm
* react-native

## installation
* clone or download the repository
* run npm install
* run react-native run-android

released under **GNU GENERAL PUBLIC LICENSE v3** www.mebitek.com

![Actual Setup](https://cdn.modulargrid.net/img/racks/modulargrid_833923.jpg)

### module list
* Make Noise Erbe-Verb Illustrated (thx to http://www.vo1t.com)
* Make Noise Echophon
* WMD Mini Slew
* Make Noise Morphagene Button Combo (thx to fourhexagons - https://www.muffwiggler.com/forum/)
* Make Noise Erbe-Verb
* Make Noise QPAS
* Expert Sleepers Disting MK4
* Make Noise Brains
* Make Noise STO
* Make Noise Optomix
* Make Noise Function Supplement (thx to demonamination - https://www.muffwiggler.com/forum/)
* 2HP MIX
* Make Noise Tempi
* Make Noise Maths Illustrated  (thx to demonamination - https://www.muffwiggler.com/forum/)
* Moog Mother32
* Erica Synths Pico DSP
* Moog Mother32 PatchBook
* Make Noise Tempi Cheat Sheet (thx to  https://www.muffwiggler.com/forum)
* 2HP VCA
* Make Noise Pressure Points
* Expert Sleepers Disting MK4 Illustrated (thx http://www.vo1t.com)
* Make Noise Morphagene
* Moog Mother32 Quickstart
* uO_C
* Make Noise Function
* Make Noise Maths
* Make Noise Wogglebug
* Make Noise modDemix
* Make Noise René
* Make Noise LxD
* Make Noise DPO
* Make Noise Rosie
* Make Noise Shared System
* Make Noise Telharmonic
* Erica Synths Pico SEQS

### I do not own any manual rights
### all rights are owned by the modules manifacture
### http://makenoisemusic.com/
### http://www.expert-sleepers.co.uk/
### http://www.twohp.com/
### https://www.ericasynths.lv/
### https://ornament-and-cri.me/
### https://www.moogmusic.com/
