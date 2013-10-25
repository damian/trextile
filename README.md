# Textdown [![travis-ci](https://api.travis-ci.org/damian/textdown.png)](http://travis-ci.org/#!/damian/textdown) [![Code Climate](https://codeclimate.com/github/damian/textdown.png)](https://codeclimate.com/github/damian/textdown)

Textdown is a lightweight Textile to HTML conversion library written in JavaScript. You can find a [demo here](http://damian.github.io/textdown/).

## Getting started

The interface to Textdown is incredibly simple. It consumes a Textile string, and outputs HTML using the toHtml method.

```javascript
var html = new Textile('my *textile* string').toHtml();

// prints "<p>my <strong>textile</strong> string<p>"
console.log(html);
```

## TODO

- Tables
- Attributes
- Nested ordered and unordered lists
