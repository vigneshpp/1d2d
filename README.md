# 1d2d
Online 1d and 2D barcode (QR BarCode) Generator

The 1d2d online API is hosted on an [Locally in Wolver Home Lab](http://home.wolver.com/) using a node.js application.  You can use this API to dynamically generate barcode images from anywhere on the web.  The returned image is in PNG format.

The online API is implemented by the `node-bwipjs` module provided in the [main repository](https://github.com/metafloor/bwip-js), so if you are running a node server, you can implement the same functionality on your local systems.

The API is available over HTTP only via the URL:  

http://qrcode.wolver.com/
http://192.168.20.41:3200/


Only HTTP GET requests with parameters specified in the URL query string are valid.  

The two required parameters are the barcode type and the value to encode, using the `bcid` and `text` parameters:

```
http://qrcode.wolver.com/?bcid=code128&text=1234567890
http://qrcode.wolver.com/?bcid=qrcode&includetext&textalign=center&scale=3&text=www.google.com 
```

The `bcid=` must follow immediately after the `?` question mark.

The list of supported barcode types (encoders) is available at [[BWIPP Barcode Types]].

The remaining parameters can be broken into two groups, bwip-js parameters and BWIPP parameters.

## bwip-js Parameters

- `scaleX` : The x-axis scaling factor.  Must be an integer > 0.  Default is 2.
- `scaleY` : The y-axis scaling factor.  Must be an integer > 0.  Default is `scaleX`.
- `scale` : Sets both the x-axis and y-axis scaling factors.  Must be an integer > 0.

- `rotate` : Allows rotating the image to one of the four orthogonal orientations:

    * `N` : Normal (not rotated).  This is the default.
    * `R` : Clockwise 90 degree rotation.
    * `L` : Counter-clockwise 90 degree rotation.
    * `I` : Inverted 180 degree rotation.

- `monochrome` : Sets the image text to render in monochrome.  The default is 256-level gray-scale anti-aliased.

For example, to render a `code128` barcode at 3x scale with inverted orientation and displaying the text (a BWIPP-specific option):

```
http://qrcode.wolver.com/?bcid=code128&text=AB1234567890&scale=3&rotate=I&includetext
```

## BWIPP Parameters

BWIPP has two types of options, boolean and valued.  Boolean parameters take no value; their presence in the URL specifies enabled/true.  Valued parameters must be followed by an equals-sign (no spaces) and the value.   The value string must be URL-encoded.

The following is an example of rendering a `code128` barcode using the BWIPP `parsefnc` boolean option and specifying alternate text to appear below the barcode:

```
http://qrcode.wolver.com/?bcid=code128&text=%5EFNC1011234567890&parsefnc&alttext=%2801%291234567890
```

The `%5E` at the start of the `text=` parameter is the `^` ASCII caret, URL-encoded.  BWIPP uses `^` to indicate control words and other values unique to each type of barcode.
The `alttext`, in human-readable form is `(01)1234567890` where the parentheses were URL-encoded.  In JavaScript, use the `encodeURIComponent()` global method to encode the value string of any parameter.

You will need to consult the [BWIPP documentation](https://github.com/bwipp/postscriptbarcode/wiki) to understand what parameters are available for each barcode type.

## How to use

From within an HTML document, you can use the API anywhere you can specify an image URL.  For example, as a CSS `background-image` URL or as the `src` in an \<img\> tag.  For example:

```
<img alt="Barcoded value 1234567890"
     src="http://qrcode.wolver.com/?bcid=code128&text=1234567890&includetext">
```

When used from a server, you must initiate an HTTP GET request.  The HTTP response will be either status 200 with `Content-Type: image/png` or status 4XX with `Content-Type: text/plain` when an error occurs.  The returned text will give an indication of what went wrong.  Your client should also be prepared to handle HTTP 302 and 307 redirects. 

## Links

* [Home Page](http://metafloor.github.io/bwip-js/)
* [github Repository](https://github.com/metafloor/bwip-js)
* [`bwipjs` Methods Reference](https://github.com/metafloor/bwip-js/wiki/Methods-Reference)
* [Online Barcode Generator](http://metafloor.github.io/bwip-js/demo/demo.html)
* [Online Barcode API](https://github.com/metafloor/bwip-js/wiki/Online-Barcode-API)
* [npm Page](https://www.npmjs.com/package/bwip-js)
* [BWIPP Documentation](https://github.com/bwipp/postscriptbarcode/wiki)
* [Differences From BWIPP](https://github.com/metafloor/bwip-js/wiki/Differences-From-BWIPP)
* [Supported Barcode Types](https://github.com/metafloor/bwip-js/wiki/BWIPP-Barcode-Types)
* [Using Your Own Fonts](https://github.com/metafloor/bwip-js/wiki/Using-Your-Own-Fonts)
* [Annotated Example Drawing Object](https://github.com/metafloor/bwip-js/wiki/Annotated-Example-Drawing-Object)
* [Working with the Raw BWIPP Rendering Data](https://github.com/metafloor/bwip-js/wiki/Notes-on-the-Raw-BWIPP-Data)

## Installation

You can download the latest npm module using:

```
npm install bwip-js
```

Or the latest code from github:

    https://github.com/metafloor/bwip-js

Barcodes have the concept of module width (and height if a two-dimensional barcode).  For
linear barcodes, the module width is the width of the narrowest bar, and all other bar widths are
a multiple of it.  For 2D symbols, module width and height are the dimensions of the square
or rectangle that defines the symbol's layout grid.

For a barcode to be "in spec", the individual module dimensions must be consistent throughout the
symbol.  With high resolution printing, you can add/subtract a dot to adjust the size of individual
modules so the overall image meets the requested width or height, while still keeping the module
size within spec.  This is the intention behind BWIPP's `width` and `height` parameters.

bwip-js is designed for web usage, with a target display resolution of 72dpi.  (All of BWIPP's
internals are calculated in points and bwip-js just maps 1pt to 1px.)  At that low
resolution, it is not possible to add or subtract pixels without causing the symbol to go
out of spec.  Imagine a fairly common module width of 2px.  If you add or subtract a pixel,
you have changed the size by 50%.  Typical barcode specs require module sizes to be within 
5-10 pecent of nominal.

For this reason, bwip-js uses a constant module size so the resulting image is as 
large as possible, without exceeding the requested `width` or `height`.
The design causes the rendered barcodes to grow in "quantums".  An image will be
X-pixels wide with a module with of 2px, and Y-pixels wide with a module width of 3px,
and can not vary between those two sizes.

With bwip-js, the `scale` parameters can be thought of as requesting a particular module
width.  `scale=1` maps to a 1px module.  `scale=2` is a 2px module.  Etc.

When you specify `width`, you are effectively changing the scale of the final image.
Internally, bwip-js calcuates the requested `width x scale`, then divides
by the number of modules the symbol requires.  The floor of that value is the
module width (scale) of the rendered barcode.

If you run the above code on your local machine, you can test with the following URL:

```
http://localhost:3030/?bcid=isbn&text=978-1-56581-231-4+52250&includetext&guardwhitespace
```

The bwip-js request handler only operates on the URL query parameters and
ignores all path information.  Your application is free to structure the URL
path as needed to implement the desired HTTP request routing.


## Supported Barcode Types

 * auspost &#x2022; AusPost 4 State Customer Code
 * azteccode &#x2022; Aztec Code
 * azteccodecompact &#x2022; Compact Aztec Code
 * aztecrune &#x2022; Aztec Runes
 * bc412 &#x2022; BC412
 * channelcode &#x2022; Channel Code
 * codablockf &#x2022; Codablock F
 * code11 &#x2022; Code 11
 * code128 &#x2022; Code 128
 * code16k &#x2022; Code 16K
 * code2of5 &#x2022; Code 25
 * code32 &#x2022; Italian Pharmacode
 * code39 &#x2022; Code 39
 * code39ext &#x2022; Code 39 Extended
 * code49 &#x2022; Code 49
 * code93 &#x2022; Code 93
 * code93ext &#x2022; Code 93 Extended
 * codeone &#x2022; Code One
 * coop2of5 &#x2022; COOP 2 of 5
 * daft &#x2022; Custom 4 state symbology
 * databarexpanded &#x2022; GS1 DataBar Expanded
 * databarexpandedcomposite &#x2022; GS1 DataBar Expanded Composite
 * databarexpandedstacked &#x2022; GS1 DataBar Expanded Stacked
 * databarexpandedstackedcomposite &#x2022; GS1 DataBar Expanded Stacked Composite
 * databarlimited &#x2022; GS1 DataBar Limited
 * databarlimitedcomposite &#x2022; GS1 DataBar Limited Composite
 * databaromni &#x2022; GS1 DataBar Omnidirectional
 * databaromnicomposite &#x2022; GS1 DataBar Omnidirectional Composite
 * databarstacked &#x2022; GS1 DataBar Stacked
 * databarstackedcomposite &#x2022; GS1 DataBar Stacked Composite
 * databarstackedomni &#x2022; GS1 DataBar Stacked Omnidirectional
 * databarstackedomnicomposite &#x2022; GS1 DataBar Stacked Omnidirectional Composite
 * databartruncated &#x2022; GS1 DataBar Truncated
 * databartruncatedcomposite &#x2022; GS1 DataBar Truncated Composite
 * datalogic2of5 &#x2022; Datalogic 2 of 5
 * datamatrix &#x2022; Data Matrix
 * datamatrixrectangular &#x2022; Data Matrix Rectangular
 * datamatrixrectangularextension &#x2022; Data Matrix Rectangular Extension
 * dotcode &#x2022; DotCode
 * ean13 &#x2022; EAN-13
 * ean13composite &#x2022; EAN-13 Composite
 * ean14 &#x2022; GS1-14
 * ean2 &#x2022; EAN-2 (2 digit addon)
 * ean5 &#x2022; EAN-5 (5 digit addon)
 * ean8 &#x2022; EAN-8
 * ean8composite &#x2022; EAN-8 Composite
 * flattermarken &#x2022; Flattermarken
 * gs1-128 &#x2022; GS1-128
 * gs1-128composite &#x2022; GS1-128 Composite
 * gs1-cc &#x2022; GS1 Composite 2D Component
 * gs1datamatrix &#x2022; GS1 Data Matrix
 * gs1datamatrixrectangular &#x2022; GS1 Data Matrix Rectangular
 * gs1dotcode &#x2022; GS1 DotCode
 * gs1northamericancoupon &#x2022; GS1 North American Coupon
 * gs1qrcode &#x2022; GS1 QR Code
 * hanxin &#x2022; Han Xin Code
 * hibcazteccode &#x2022; HIBC Aztec Code
 * hibccodablockf &#x2022; HIBC Codablock F
 * hibccode128 &#x2022; HIBC Code 128
 * hibccode39 &#x2022; HIBC Code 39
 * hibcdatamatrix &#x2022; HIBC Data Matrix
 * hibcdatamatrixrectangular &#x2022; HIBC Data Matrix Rectangular
 * hibcmicropdf417 &#x2022; HIBC MicroPDF417
 * hibcpdf417 &#x2022; HIBC PDF417
 * hibcqrcode &#x2022; HIBC QR Code
 * iata2of5 &#x2022; IATA 2 of 5
 * identcode &#x2022; Deutsche Post Identcode
 * industrial2of5 &#x2022; Industrial 2 of 5
 * interleaved2of5 &#x2022; Interleaved 2 of 5 (ITF)
 * isbn &#x2022; ISBN
 * ismn &#x2022; ISMN
 * issn &#x2022; ISSN
 * itf14 &#x2022; ITF-14
 * japanpost &#x2022; Japan Post 4 State Customer Code
 * kix &#x2022; Royal Dutch TPG Post KIX
 * leitcode &#x2022; Deutsche Post Leitcode
 * mailmark &#x2022; Royal Mail Mailmark
 * matrix2of5 &#x2022; Matrix 2 of 5
 * maxicode &#x2022; MaxiCode
 * micropdf417 &#x2022; MicroPDF417
 * microqrcode &#x2022; Micro QR Code
 * msi &#x2022; MSI Modified Plessey
 * onecode &#x2022; USPS Intelligent Mail
 * pdf417 &#x2022; PDF417
 * pdf417compact &#x2022; Compact PDF417
 * pharmacode &#x2022; Pharmaceutical Binary Code
 * pharmacode2 &#x2022; Two-track Pharmacode
 * planet &#x2022; USPS PLANET
 * plessey &#x2022; Plessey UK
 * posicode &#x2022; PosiCode
 * postnet &#x2022; USPS POSTNET
 * pzn &#x2022; Pharmazentralnummer (PZN)
 * qrcode &#x2022; QR Code
 * rationalizedCodabar &#x2022; Codabar
 * raw &#x2022; Custom 1D symbology
 * rectangularmicroqrcode &#x2022; Rectangular Micro QR Code
 * royalmail &#x2022; Royal Mail 4 State Customer Code
 * sscc18 &#x2022; SSCC-18
 * symbol &#x2022; Miscellaneous symbols
 * telepen &#x2022; Telepen
 * telepennumeric &#x2022; Telepen Numeric
 * ultracode &#x2022; Ultracode
 * upca &#x2022; UPC-A
 * upcacomposite &#x2022; UPC-A Composite
 * upce &#x2022; UPC-E
 * upcecomposite &#x2022; UPC-E Composite
