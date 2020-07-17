# human-schema [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url]

Human Schema is a user-friendly declarative schema system similar to JSONSchema but: simpler, more geospatial types, and built with intuitive UI generation in mind. This library should be used in conjunction with other libraries in the ecosystem like iris-ql, object-transform-stack, and others.

## Install

```
npm install human-schema --save
```

## Basic Schema Example

```json
{
  "id": "911-call",
  "name": "911 Call",
  "notes": "A 911 call.",
  "schema": {
    "receivedAt": {
      "name": "Received",
      "type": "date",
      "validation": {
        "required": true
      }
    },
    "dispatchedAt": {
      "name": "Dispatched",
      "type": "date"
    },
    "arrivedAt": {
      "name": "Arrived",
      "type": "date"
    },
    "units": {
      "name": "Units",
      "type": "array",
      "validation": {
        "notEmpty": true,
        "maxItems": 2048
      },
      "items": {
        "name": "Unit ID",
        "type": "text",
        "validation": {
          "required": true,
          "notEmpty": true,
          "maxLength": 2048
        }
      }
    },
    "officers": {
      "name": "Officers",
      "type": "array",
      "validation": {
        "notEmpty": true,
        "maxItems": 2048
      },
      "items": {
        "name": "Officer ID",
        "type": "text",
        "validation": {
          "required": true,
          "notEmpty": true,
          "maxLength": 2048
        }
      }
    },
    "code": {
      "name": "Code",
      "type": "text",
      "validation": {
        "notEmpty": true,
        "maxLength": 2048
      }
    },
    "type": {
      "name": "Type",
      "type": "text",
      "validation": {
        "notEmpty": true,
        "maxLength": 2048
      }
    },
    "notes": {
      "name": "Notes",
      "type": "text",
      "validation": {
        "notEmpty": true
      }
    },
    "images": {
      "name": "Images",
      "type": "array",
      "validation": {
        "notEmpty": true,
        "maxItems": 2048
      },
      "items": {
        "name": "Image",
        "type": "text",
        "validation": {
          "required": true,
          "image": true
        }
      }
    },
    "address": {
      "name": "Address",
      "type": "text",
      "validation": {
        "notEmpty": true,
        "maxLength": 2048
      }
    },
    "location": {
      "name": "Location",
      "type": "point",
      "validation": {
        "required": true
      }
    }
  }
}

```


## DB Support

If you optionally want deep geospatial validation, you can provide a postgres connection to an instance with PostGIS installed. In the future, via node-gdal-next this library will handle deep geo validation without querying a DB.

[downloads-image]: http://img.shields.io/npm/dm/human-schema.svg
[npm-url]: https://npmjs.org/package/human-schema
[npm-image]: http://img.shields.io/npm/v/human-schema.svg

[travis-url]: https://travis-ci.org/staeco/human-schema
[travis-image]: https://travis-ci.org/staeco/human-schema.png?branch=master
